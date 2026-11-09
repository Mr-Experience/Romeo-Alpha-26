/**
 * Build-time prerender for search engines and AI crawlers.
 *
 * After `vite build`, this script serves dist/, renders every public route in
 * headless Chrome, and writes the fully rendered HTML back into dist/ so that
 * crawlers that don't run JavaScript (GPTBot, ClaudeBot, PerplexityBot, most
 * agents) receive real content, titles, canonicals and JSON-LD.
 *
 * It also writes:
 *   - dist/spa.html    (unrendered SPA shell for admin/inquiry/new routes)
 *   - dist/404.html    (served by Netlify with a real 404 status)
 *   - dist/sitemap.xml (every prerendered route, with <lastmod>)
 *
 * Never fails the build: if Chrome can't start, the site ships as a normal SPA.
 * Set SKIP_PRERENDER=1 to skip it.
 */
import { preview } from 'vite';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const SITE = 'https://romeoalphamaritime.com';
const DIST = path.resolve('dist');
const MAX_PAGES = 300;

// Seed routes; marketplace detail pages are discovered by following links.
const SEED_ROUTES = [
    '/', '/about', '/team', '/certifications', '/careers', '/contact', '/marketplace',
    '/service/maritime', '/service/charter', '/service/offshore', '/service/security',
    '/privacy', '/terms',
];
// Never prerender or list these.
const EXCLUDE = [/^\/admin/, /^\/login/, /^\/marketplace-inquiry/, /^\/operation-detail/, /\/mock-/];
const PRIORITY = { '/privacy': '0.3', '/terms': '0.3', '/': '1.0', '/marketplace': '0.9', '/contact': '0.8', '/about': '0.8' };

const log = (...a) => console.log('[prerender]', ...a);

// Seed every live vessel listing straight from the database, so listing pages are
// prerendered and in the sitemap even if the marketplace grid hasn't linked them yet.
async function listingRoutes() {
    try {
        let url = process.env.VITE_SUPABASE_URL;
        let key = process.env.VITE_SUPABASE_ANON_KEY;
        if (!url || !key) {
            const cfg = await fs.readFile(path.resolve('src/config.js'), 'utf8');
            url = url || (cfg.match(/supabaseUrl:[^']*'([^']+)'/) || [])[1];
            key = key || (cfg.match(/supabaseAnonKey:[^']*'([^']+)'/) || [])[1];
        }
        if (!url || !key) return [];
        const res = await fetch(`${url}/rest/v1/marketplace_items?select=id,is_active`, {
            headers: { apikey: key }, signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) { log(`listing seed: HTTP ${res.status}`); return []; }
        const rows = await res.json();
        const routes = rows.filter((r) => r.is_active !== false && r.id != null).map((r) => `/marketplace/${r.id}`);
        log(`listing seed: ${routes.length} live listings`);
        return routes;
    } catch (e) {
        log(`listing seed skipped: ${e.message}`);
        return [];
    }
}
const isExcluded = (p) => EXCLUDE.some((re) => re.test(p));
const outFile = (route) => (route === '/' ? 'index.html' : `${route.slice(1)}.html`);

async function writeFallbacks() {
    // Pristine SPA shell for routes that aren't prerendered (admin, inquiry forms,
    // listings added after the last deploy). Written first so it exists even if
    // prerendering fails; _redirects rewrites those routes to /spa.html.
    const shell = await fs.readFile(path.join(DIST, 'index.html'), 'utf8');
    await fs.writeFile(path.join(DIST, 'spa.html'), shell);
    // Without prerendering, the SPA shell still renders the NotFound route.
    await fs.writeFile(path.join(DIST, '404.html'), shell.replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, follow" />'));
}

async function writeSitemap(routes) {
    const today = new Date().toISOString().slice(0, 10);
    const urls = [...routes].sort().map((r) => {
        const pr = PRIORITY[r] || (r.startsWith('/service/') ? '0.9' : r.startsWith('/marketplace/') ? '0.6' : '0.7');
        return `  <url>\n    <loc>${SITE}${r}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${pr}</priority>\n  </url>`;
    });
    await fs.writeFile(path.join(DIST, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
    log(`sitemap.xml written with ${urls.length} URLs`);
}

async function main() {
    await writeFallbacks();
    if (process.env.SKIP_PRERENDER) { log('skipped (SKIP_PRERENDER set)'); return; }

    let puppeteer;
    try { puppeteer = (await import('puppeteer')).default; }
    catch { log('puppeteer not installed — shipping as SPA'); return; }

    const server = await preview({ preview: { port: 4179, strictPort: false, open: false }, logLevel: 'silent' });
    const origin = server.resolvedUrls.local[0].replace(/\/$/, '');

    const closeServer = () => new Promise((r) => server.httpServer.close(r));
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        });
    } catch (e) {
        // Never leave the preview server running: an open server keeps Node alive and hangs the build.
        await closeServer();
        log(`Chrome unavailable, shipping as SPA: ${e.message.split('\n')[0]}`);
        return;
    }

    const rendered = new Map();
    const queue = [...SEED_ROUTES, ...(await listingRoutes())].filter((r) => !isExcluded(r));
    const seen = new Set(queue);

    const render = async (route) => {
        const page = await browser.newPage();
        try {
            await page.goto(origin + route, { waitUntil: 'networkidle0', timeout: 45000 });
            // Let data-driven sections (FAQ, marketplace, team) settle.
            await page.waitForFunction(() => document.querySelector('#root')?.children.length > 0, { timeout: 15000 });
            // Listing pages show a loader until their data arrives; wait for the real content.
            await page.waitForFunction(() => !document.querySelector('.detail-loading-container'), { timeout: 20000 }).catch(() => {});
            await new Promise((r) => setTimeout(r, 800));
            const result = await page.evaluate(() => {
                const links = [...document.querySelectorAll('a[href^="/"]')]
                    .map((a) => a.getAttribute('href').split(/[?#]/)[0].replace(/\/+$/, '') || '/');
                document.querySelectorAll('[data-prerender-skip]').forEach((el) => el.remove());
                const missing = !!document.querySelector('.detail-error-container, .detail-loading-container');
                return { html: '<!doctype html>\n' + document.documentElement.outerHTML, links, missing, words: document.body.innerText.split(/\s+/).length };
            });
            return result;
        } finally { await page.close(); }
    };

    try {
        while (queue.length && rendered.size < MAX_PAGES) {
            const route = queue.shift();
            try {
                const { html, links, words, missing } = await render(route);
                if (missing) { log(`skip ${route} (listing not found or still loading)`); continue; }
                // Listing pages have no header/footer, so a short listing can be genuinely brief;
                // the "missing" check above already rules out loaders and not-found pages.
                const minWords = route.startsWith('/marketplace/') ? 10 : 30;
                if (words < minWords) { log(`skip ${route} (only ${words} words rendered)`); continue; }
                rendered.set(route, html);
                for (const l of links) {
                    if (!seen.has(l) && !isExcluded(l) && !l.includes('.')) { seen.add(l); queue.push(l); }
                }
                log(`ok   ${route} (${words} words)`);
            } catch (e) { log(`fail ${route}: ${e.message}`); }
        }

        // 404 page (rendered by the catch-all NotFound route).
        try {
            const { html } = await render('/__not-found__');
            await fs.writeFile(path.join(DIST, '404.html'), html);
        } catch (e) { log(`404 render failed, keeping fallback: ${e.message}`); }
    } finally {
        await browser.close();
        await closeServer();
    }

    for (const [route, html] of rendered) {
        const file = path.join(DIST, outFile(route));
        await fs.mkdir(path.dirname(file), { recursive: true });
        await fs.writeFile(file, html);
    }
    await writeSitemap(rendered.keys());
    log(`done: ${rendered.size} pages prerendered`);
}

// Always exit explicitly so a stray handle can never hang the CI build.
main()
    .catch((e) => { console.warn('[prerender] skipped after error:', e.message); })
    .finally(() => process.exit(0));
