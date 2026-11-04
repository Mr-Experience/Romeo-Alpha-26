/**
 * Store Puppeteer's Chrome inside node_modules so Netlify's dependency cache
 * keeps it between builds (the default ~/.cache path is not cached).
 * @type {import('puppeteer').Configuration}
 */
const { join } = require('path');
module.exports = { cacheDirectory: join(__dirname, 'node_modules', '.cache', 'puppeteer') };
