/**
 * Consent-gated analytics: LinkedIn Insight Tag + Google Analytics 4.
 *
 * - Does nothing until an ID is set in config.js (or the matching VITE_ env var).
 * - Loads no third-party script until the visitor accepts cookies (NDPA / GDPR).
 * - Never runs during the build-time prerender (navigator.webdriver) or on admin pages.
 * - Tracks SPA page views; conversions (GA4 + LinkedIn): Get Quotes / vessel enquiry clicks,
 *   WhatsApp, phone, email, form sent; GA4 only: vessel views and every other button/link click.
 */
import { config } from '../config';

const CONSENT_KEY = 'ra_cookie_consent'; // 'granted' | 'denied'
const LI_ID = String(config.linkedinPartnerId || '').trim();
const GA_ID = String(config.ga4MeasurementId || '').trim();
const CONV = config.linkedinConversions || {};

let started = false;

export const analyticsConfigured = () => Boolean(LI_ID || GA_ID);
const isBot = () => typeof navigator !== 'undefined' && navigator.webdriver;
const isAdminPath = (p = window.location.pathname) => /^\/(admin|login)/.test(p);

export const getConsent = () => {
    try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
};

export const setConsent = (value) => {
    try { localStorage.setItem(CONSENT_KEY, value); } catch { /* storage blocked: consent lasts this visit only */ }
    if (value === 'granted') startAnalytics();
};

const loadScript = (src) => {
    const s = document.createElement('script');
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
};

function startLinkedIn() {
    window._linkedin_partner_id = LI_ID;
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(LI_ID);
    if (!window.lintrk) {
        const q = [];
        window.lintrk = (a, b) => q.push([a, b]);
        window.lintrk.q = q;
    }
    loadScript('https://snap.licdn.com/li.lms-analytics/insight.min.js');
}

function startGA() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    // Page views are sent manually on every route change (SPA).
    window.gtag('config', GA_ID, { send_page_view: false });
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`);
}

export function startAnalytics() {
    if (started || !analyticsConfigured() || isBot() || getConsent() !== 'granted') return;
    started = true;
    if (LI_ID) startLinkedIn();
    if (GA_ID) startGA();
    document.addEventListener('click', onClick, true);
    trackPageView(window.location.pathname + window.location.search);
}

let lastPath = null;

export function trackPageView(path) {
    if (!started || isAdminPath(path.split('?')[0]) || path === lastPath) return;
    lastPath = path;
    if (GA_ID && window.gtag) {
        window.gtag('event', 'page_view', { page_path: path, page_location: window.location.href, page_title: document.title });
    }
    // LinkedIn's tag records the first page itself; record later SPA navigations.
    if (LI_ID && window.lintrk && trackPageView.seen) window.lintrk('track');
    trackPageView.seen = true;
}

/**
 * Records a conversion in GA4 and (if a conversion ID is set) in LinkedIn.
 * kind: 'lead' | 'quote' | 'whatsapp' | 'call' | 'email'
 */
export function trackConversion(kind, params = {}) {
    if (!started || isAdminPath()) return;
    if (GA_ID && window.gtag) {
        const gaName = kind === 'lead' ? 'generate_lead' : `click_${kind}`;
        window.gtag('event', gaName, { page_path: window.location.pathname, ...params });
    }
    if (LI_ID && window.lintrk && CONV[kind]) {
        window.lintrk('track', { conversion_id: Number(CONV[kind]) || CONV[kind] });
    }
}

/** GA4-only event (detail for reports; not sent to LinkedIn so ad conversions stay clean). */
export function trackEvent(name, params = {}) {
    if (!started || isAdminPath() || !GA_ID || !window.gtag) return;
    window.gtag('event', name, { page_path: window.location.pathname, ...params });
}

const labelOf = (el) => (el.getAttribute('data-track-label') || el.getAttribute('aria-label') || el.textContent || '')
    .replace(/\s+/g, ' ').trim().slice(0, 80);

// One delegated listener covers every WhatsApp / phone / email link and Get Quotes button,
// wherever they are (header, footer, contact page, marketplace), including ones added later.
function onClick(e) {
    // Prefer the element carrying tracking tags (e.g. a <Link data-item> wrapping a <button>).
    const el = e.target.closest?.('[data-track], [data-track-label]') || e.target.closest?.('a, button');
    if (!el) return;
    const href = (el.closest('a') || el).getAttribute('href') || '';
    if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)/i.test(href)) trackConversion('whatsapp', { link_url: href });
    else if (href.startsWith('tel:')) trackConversion('call', { link_url: href });
    else if (href.startsWith('mailto:')) trackConversion('email', { link_url: href });
    else if (el.matches('.btn-get-quotes, [data-track="quote"]')) trackConversion('quote', { link_text: labelOf(el), item_name: el.getAttribute('data-item') || undefined });
    // Every other button/link: GA4 only, with its label and destination.
    else trackEvent('cta_click', { link_text: labelOf(el), link_url: href || undefined, item_name: el.getAttribute('data-item') || undefined });
}
