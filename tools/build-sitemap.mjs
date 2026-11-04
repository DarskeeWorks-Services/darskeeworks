// Regenerates sitemap.xml from the page list, works.json and the product catalog.
// Draft and unavailable products are excluded. Run: node tools/build-sitemap.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://darskeeworks.online';
const today = new Date().toISOString().slice(0, 10);

const pages = [
  ['', '1.0'], ['services.html', '0.9'], ['shop.html', '0.9'], ['pricing.html', '0.9'],
  ['portfolio.html', '0.8'], ['about.html', '0.7'], ['contact.html', '0.8'], ['support.html', '0.6'],
  ['privacy.html', '0.3'], ['terms.html', '0.3'], ['refund-policy.html', '0.3'],
  ['license.html', '0.3'], ['service-agreement.html', '0.3'], ['support-mochisensei.html', '0.4']
];

// Per-app privacy pages referenced by app store listings
const works = JSON.parse(readFileSync(join(root, 'works.json'), 'utf8')).projects;
for (const p of works) {
  const m = /^https:\/\/darskeeworks\.online\/([\w\-]+\.html)$/.exec(p.privacy || '');
  if (m && existsSync(join(root, m[1]))) pages.push([m[1], '0.3']);
}

// Load browser data files in a sandbox
const sandbox = { window: {} };
vm.createContext(sandbox);
for (const f of ['js/data/case-studies.js', 'js/data/products.js']) {
  vm.runInContext(readFileSync(join(root, f), 'utf8'), sandbox);
}
const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const cs = sandbox.window.DW_CASE_STUDIES || {};
for (const p of works) {
  const slug = (cs[p.name] && cs[p.name].slug) || slugify(p.name);
  pages.push([`case-study.html?p=${encodeURIComponent(slug)}`, '0.6']);
}
for (const p of sandbox.window.DW_PRODUCTS || []) {
  if (p.status === 'published') pages.push([`product.html?id=${encodeURIComponent(p.id)}`, '0.7']);
}

const seen = new Set();
const urls = pages.filter(([path]) => !seen.has(path) && seen.add(path)).map(([path, priority]) =>
  `  <url>\n    <loc>${SITE}/${path.replace(/&/g, '&amp;')}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`
);
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
writeFileSync(join(root, 'sitemap.xml'), xml);
console.log(`sitemap.xml: ${urls.length} URLs`);
