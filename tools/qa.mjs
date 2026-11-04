// Headless browser QA for the DarskeeWorks site (Chrome DevTools Protocol, no dependencies).
//
//   1. Serve the repo:   python -m http.server 8765 --bind 127.0.0.1
//   2. Run:              node tools/qa.mjs [--shots <dir>]
//
// Env: CHROME=<path to chrome/msedge>, BASE=http://127.0.0.1:8765
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE = process.env.BASE || 'http://127.0.0.1:8765';
const CHROME = process.env.CHROME || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
].find(existsSync);
const shotsIdx = process.argv.indexOf('--shots');
const SHOTS = shotsIdx > -1 ? process.argv[shotsIdx + 1] : '';
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

const PAGES = [
  'index.html', 'services.html', 'shop.html', 'product.html?id=ultimate-teacher-planner',
  'product.html?id=darskee-automation', 'product.html?id=does-not-exist', 'portfolio.html',
  'case-study.html?p=moofy', 'case-study.html?p=darskee-automation', 'pricing.html', 'about.html',
  'contact.html', 'contact.html?service=website-development&package=business', 'support.html',
  'privacy.html', 'privacy.html#moofy-your-budget-buddy', 'terms.html', 'refund-policy.html',
  'license.html', 'service-agreement.html', '404.html', 'admin.html',
  'privacy-moofy.html', 'support-mochisensei.html', 'privacy-mochisensei.html',
  'mochisensei-marketing.html', 'apps/moofy-your-budget-buddy/', 'apps/darskee-automation/'
];

const results = [];
const fail = (page, msg) => results.push({ page, ok: false, msg });
const pass = (page, msg) => results.push({ page, ok: true, msg });

// ── CDP plumbing ──
const port = 9300 + Math.floor(Math.random() * 500);
const profile = mkdtempSync(join(tmpdir(), 'dwqa-'));
const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
  '--no-first-run', '--no-default-browser-check', '--disable-gpu', 'about:blank'
], { stdio: 'ignore' });

async function wsUrl() {
  for (let i = 0; i < 50; i++) {
    try { return (await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()).webSocketDebuggerUrl; }
    catch { await new Promise((r) => setTimeout(r, 200)); }
  }
  throw new Error('Chrome did not start');
}

const ws = new WebSocket(await wsUrl());
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let nextId = 1;
const pending = new Map();
const listeners = new Set();
ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
  } else listeners.forEach((fn) => fn(msg));
});
const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
  const id = nextId++;
  pending.set(id, { resolve, reject });
  ws.send(JSON.stringify({ id, method, params, sessionId }));
});

async function openPage({ width = 1280, height = 900, mobile = false, intercept } = {}) {
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const s = (m, p) => send(m, p, sessionId);
  const log = { errors: [], failed: [] };
  const handler = async (msg) => {
    if (msg.sessionId !== sessionId) return;
    if (msg.method === 'Runtime.exceptionThrown') log.errors.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') log.errors.push(msg.params.args.map((a) => a.value ?? a.description).join(' '));
    if (msg.method === 'Network.responseReceived' && msg.params.response.status >= 400 && msg.params.response.url.startsWith(BASE)) log.failed.push(msg.params.response.status + ' ' + msg.params.response.url);
    if (msg.method === 'Network.loadingFailed' && !msg.params.canceled && msg.params.errorText !== 'net::ERR_ABORTED') log.failed.push(msg.params.errorText + ' ' + msg.params.requestId);
    if (msg.method === 'Fetch.requestPaused' && intercept) {
      const body = intercept(msg.params.request.url);
      if (body != null) {
        await s('Fetch.fulfillRequest', { requestId: msg.params.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: 'application/json' }], body: Buffer.from(body).toString('base64') });
      } else await s('Fetch.continueRequest', { requestId: msg.params.requestId });
    }
  };
  listeners.add(handler);
  await s('Runtime.enable'); await s('Network.enable'); await s('Page.enable');
  if (intercept) await s('Fetch.enable', { patterns: [{ urlPattern: '*works.json*' }] });
  await s('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
  const page = {
    log,
    async goto(path) {
      const loaded = new Promise((r) => { const h = (m) => { if (m.sessionId === sessionId && m.method === 'Page.loadEventFired') { listeners.delete(h); r(); } }; listeners.add(h); });
      await s('Page.navigate', { url: `${BASE}/${path}` });
      await loaded;
      await new Promise((r) => setTimeout(r, 700));
    },
    async eval(expr) {
      const r = await s('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || 'eval failed');
      return r.result.value;
    },
    async shot(file) {
      const { cssContentSize } = await s('Page.getLayoutMetrics');
      const { data } = await s('Page.captureScreenshot', { format: 'jpeg', quality: 70, captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: Math.min(cssContentSize.height, 6000), scale: 1 } });
      writeFileSync(join(SHOTS, file), Buffer.from(data, 'base64'));
    },
    wait: (ms) => new Promise((r) => setTimeout(r, ms)),
    async close() { listeners.delete(handler); await send('Target.closeTarget', { targetId }); }
  };
  return page;
}

// ── 1. Every page: errors, failed resources, images, overflow, basics ──
const internalLinks = new Set();
for (const [label, opts] of [['desktop', { width: 1280, height: 900 }], ['mobile', { width: 390, height: 844, mobile: true }]]) {
  for (const path of PAGES) {
    const p = await openPage(opts);
    await p.goto(path);
    const info = await p.eval(`(() => ({
      title: document.title,
      h1: document.querySelectorAll('h1').length,
      overflow: document.documentElement.scrollWidth - ${opts.width},
      brokenImgs: [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.src).map(i => i.src),
      noAlt: [...document.images].filter(i => !i.hasAttribute('alt')).length,
      jsLinks: [...document.querySelectorAll('a[href]')].filter(a => /^\\s*javascript:/i.test(a.getAttribute('href'))).length,
      links: [...document.querySelectorAll('a[href]')].map(a => a.href).filter(h => h.startsWith(location.origin))
    }))()`);
    const id = `${path} [${label}]`;
    p.log.errors.length ? fail(id, 'JS errors: ' + p.log.errors.join(' | ')) : pass(id, 'no JS errors');
    p.log.failed.length ? fail(id, 'failed requests: ' + p.log.failed.join(', ')) : null;
    info.brokenImgs.length ? fail(id, 'broken images: ' + info.brokenImgs.join(', ')) : null;
    info.noAlt ? fail(id, `${info.noAlt} image(s) without alt`) : null;
    info.jsLinks ? fail(id, 'javascript: links present') : null;
    // mochisensei-marketing.html is a bespoke page outside the design system (known 4px mobile overflow)
    if (info.overflow > 1 && !path.startsWith('mochisensei-marketing')) fail(id, `horizontal overflow ${info.overflow}px`);
    if (!path.startsWith('privacy-') && !path.startsWith('support-mochi') && !path.startsWith('admin') && !path.startsWith('apps/') && !path.startsWith('mochisensei') && info.h1 !== 1) fail(id, `expected 1 h1, found ${info.h1}`);
    info.links.forEach((l) => internalLinks.add(l.split('#')[0]));
    if (SHOTS && ['index.html', 'shop.html', 'product.html?id=ultimate-teacher-planner', 'services.html', 'pricing.html', 'contact.html', 'portfolio.html', 'case-study.html?p=moofy', 'about.html', 'support.html'].includes(path)) {
      await p.shot(`${label}-${path.replace(/[^a-z0-9]+/gi, '_')}.jpg`);
    }
    await p.close();
  }
}

// ── 2. Internal links resolve ──
for (const url of internalLinks) {
  const r = await fetch(url.split('?')[0]);
  if (!r.ok) fail('links', `${r.status} ${url}`);
}
pass('links', `${internalLinks.size} internal URLs checked`);

// ── 3. Interactions ──
async function check(name, fn) {
  try { const msg = await fn(); pass(name, msg || 'ok'); } catch (e) { fail(name, e.message); }
}
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

await check('lazy images load after scrolling', async () => {
  const bad = [];
  for (const path of ['index.html', 'portfolio.html', 'shop.html', 'about.html', 'case-study.html?p=moofy']) {
    const p = await openPage();
    await p.goto(path);
    await p.eval(`(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } })()`);
    await p.wait(1200);
    const r = await p.eval(`[...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.currentSrc || i.src)`);
    await p.close();
    if (r.length) bad.push(path + ': ' + r.join(', '));
  }
  assert(!bad.length, bad.join(' | '));
  return 'all images decoded';
});

await check('mobile nav toggle', async () => {
  const p = await openPage({ width: 390, height: 844, mobile: true });
  await p.goto('index.html');
  const before = await p.eval(`getComputedStyle(document.getElementById('nav-menu')).display`);
  await p.eval(`document.getElementById('nav-toggle').click()`);
  const after = await p.eval(`[getComputedStyle(document.getElementById('nav-menu')).display, document.getElementById('nav-toggle').getAttribute('aria-expanded')]`);
  await p.close();
  assert(before === 'none' && after[0] === 'flex' && after[1] === 'true', `before=${before} after=${after}`);
  return 'menu opens, aria-expanded=true';
});

await check('homepage content', async () => {
  const p = await openPage();
  await p.goto('index.html');
  const r = await p.eval(`({ svc: document.querySelectorAll('#home-services .card').length, prod: document.querySelectorAll('#home-products .card').length, proj: document.querySelectorAll('#home-projects .card').length, price: document.querySelectorAll('#home-pricing .price-card').length, faq: document.querySelectorAll('#home-faq details').length, stat: document.querySelector('[data-stat=storeApps]').textContent, anchors: ['about','services','work','contact'].every(id => document.getElementById(id)) })`);
  await p.close();
  assert(r.svc === 6 && r.prod > 0 && r.proj === 6 && r.price === 4 && r.faq > 0 && r.anchors, JSON.stringify(r));
  return JSON.stringify(r);
});

await check('shop filter/search/sort', async () => {
  const p = await openPage();
  await p.goto('shop.html');
  const all = await p.eval(`document.querySelectorAll('#shop-grid .card').length`);
  await p.eval(`document.querySelector('.chip[data-cat="teacher-resources"]').click()`);
  const teacher = await p.eval(`document.querySelectorAll('#shop-grid .card').length`);
  const url = await p.eval(`location.search`);
  await p.eval(`(() => { const i = document.getElementById('shop-search'); document.querySelector('.chip[data-cat="all"]').click(); i.value = 'inventory'; i.dispatchEvent(new Event('input')); })()`);
  const search = await p.eval(`[...document.querySelectorAll('#shop-grid .card-title')].map(n => n.textContent)`);
  await p.eval(`(() => { const i = document.getElementById('shop-search'); i.value = 'zzzz'; i.dispatchEvent(new Event('input')); })()`);
  const empty = await p.eval(`!document.getElementById('shop-empty').hidden`);
  await p.eval(`(() => { const i = document.getElementById('shop-search'); i.value = ''; i.dispatchEvent(new Event('input')); const s = document.getElementById('shop-sort'); s.value = 'price-asc'; s.dispatchEvent(new Event('change')); })()`);
  const first = await p.eval(`document.querySelector('#shop-grid .card-title').textContent`);
  await p.close();
  assert(all === 15 && teacher === 4 && url.includes('teacher-resources') && search.length === 2 && empty, JSON.stringify({ all, teacher, url, search, empty }));
  return `all=${all} teacher=${teacher} search=${search.join(', ')} cheapest="${first}"`;
});

await check('shop deep link ?category=', async () => {
  const p = await openPage();
  await p.goto('shop.html?category=website-templates');
  const n = await p.eval(`document.querySelectorAll('#shop-grid .card').length`);
  await p.close();
  assert(n === 2, `got ${n}`);
  return `${n} website templates`;
});

await check('draft product is not purchasable', async () => {
  const p = await openPage();
  await p.goto('product.html?id=ultimate-teacher-planner');
  const r = await p.eval(`({ disabled: !!document.querySelector('.buy-box button[disabled]'), buyLinks: [...document.querySelectorAll('.buy-box a')].filter(a => /checkout|payhip|gumroad/i.test(a.href)).length, robots: document.querySelector('meta[name=robots]')?.content, related: document.querySelectorAll('#related-grid .card').length })`);
  await p.close();
  assert(r.disabled && r.buyLinks === 0 && r.robots === 'noindex' && r.related > 0, JSON.stringify(r));
  return JSON.stringify(r);
});

await check('external product links to official listing', async () => {
  const p = await openPage();
  await p.goto('product.html?id=darskee-automation');
  const r = await p.eval(`(() => { const a = document.querySelector('.buy-box a[data-track=checkout_click]'); return { href: a && a.href, target: a && a.target, rel: a && a.rel, robots: document.querySelector('meta[name=robots]') ? 'noindex' : 'index' }; })()`);
  await p.close();
  assert(r.href === 'https://darskee-automation-site-production.up.railway.app/' && r.target === '_blank' && r.rel === 'noopener' && r.robots === 'index', JSON.stringify(r));
  return r.href;
});

await check('contact validation + honest fallback', async () => {
  const p = await openPage();
  await p.goto('contact.html?service=website-development&package=business');
  const pre = await p.eval(`({ svc: document.getElementById('f-service').value, pkg: document.getElementById('f-package').value, pkgVisible: !document.getElementById('package-field').hidden })`);
  await p.eval(`document.getElementById('submit-btn').click()`);
  const errs = await p.eval(`({ summary: !document.getElementById('error-summary').hidden, count: document.querySelectorAll('#error-list li').length, invalid: document.querySelectorAll('[aria-invalid=true]').length, focused: document.activeElement.id })`);
  await p.wait(3100);
  await p.eval(`(() => { const v = { 'f-name': 'Test User', 'f-email': 'test@example.com', 'f-country': 'Philippines', 'f-business': 'Small business / shop', 'f-budget': document.getElementById('f-budget').options[2].value, 'f-timeline': 'Within 1 month', 'f-message': 'I need a website for my bakery with a menu and contact form.' }; for (const k in v) document.getElementById(k).value = v[k]; document.getElementById('f-consent').checked = true; document.getElementById('submit-btn').click(); })()`);
  const after = await p.eval(`({ status: document.getElementById('form-status').textContent, mailto: !!document.querySelector('#form-status a[href^="mailto:"]') })`);
  await p.close();
  assert(pre.svc === 'website-development' && pre.pkg === 'business' && pre.pkgVisible, 'prefill ' + JSON.stringify(pre));
  assert(errs.summary && errs.count === 8 && errs.invalid === 8 && errs.focused === 'error-summary', 'errors ' + JSON.stringify(errs));
  assert(/NOT been sent/.test(after.status) && after.mailto, 'fallback ' + JSON.stringify(after));
  return `prefill ok · ${errs.count} errors announced · unconfigured provider shows "not sent" + mailto`;
});

await check('contact honeypot', async () => {
  const p = await openPage();
  await p.goto('contact.html');
  await p.wait(3100);
  await p.eval(`(() => { const v = { 'f-name': 'Bot', 'f-email': 'bot@example.com', 'f-country': 'Other', 'f-business': 'Other', 'f-service': 'other', 'f-budget': 'Not sure yet', 'f-timeline': 'Flexible', 'f-message': 'spam spam spam spam spam spam', 'f-website': 'http://spam' }; for (const k in v) document.getElementById(k).value = v[k]; document.getElementById('f-consent').checked = true; document.getElementById('submit-btn').click(); })()`);
  const r = await p.eval(`({ hidden: document.getElementById('inquiry-form').hidden, mailto: !!document.querySelector('#form-status a[href^="mailto:"]') })`);
  await p.close();
  assert(r.hidden && !r.mailto, JSON.stringify(r));
  return 'bot submission swallowed';
});

await check('portfolio filter', async () => {
  const p = await openPage();
  await p.goto('portfolio.html');
  const all = await p.eval(`document.querySelectorAll('#portfolio-grid .card:not([hidden])').length`);
  await p.eval(`document.querySelector('.chip[data-cat="web"]').click()`);
  const web = await p.eval(`document.querySelectorAll('#portfolio-grid .card:not([hidden])').length`);
  const summary = await p.eval(`document.getElementById('portfolio-summary').textContent`);
  await p.close();
  assert(all === 10 && web === 3, `all=${all} web=${web}`);
  return `${all} projects, ${web} web · "${summary}"`;
});

await check('legacy privacy anchors', async () => {
  const p = await openPage();
  await p.goto('privacy.html');
  const ids = await p.eval(`['solar-pv-calc-solar-designer','moofy-your-budget-buddy','darskee-automation','guroassist-ph-your-virtual-assistant'].map(id => !!document.getElementById(id))`);
  await p.close();
  assert(ids.every(Boolean), JSON.stringify(ids));
  return 'slug anchors present';
});

await check('XSS: hostile works.json is rendered inert', async () => {
  const evil = JSON.stringify({ projects: [{
    platform: '<img src=x onerror="window.__xss=1">', name: '<script>window.__xss=2</script>Evil',
    description: '<b onmouseover=window.__xss=3>x</b>', image: 'javascript:window.__xss=4',
    link: 'javascript:window.__xss=5', privacy: ' JaVaScRiPt:window.__xss=6', support: 'data:text/html,<script>alert(1)</script>', marketing: '//evil.example'
  }] });
  const results = [];
  for (const path of ['index.html', 'portfolio.html', 'privacy.html', 'support.html', 'about.html']) {
    const p = await openPage({ intercept: (u) => (u.includes('works.json') ? evil : null) });
    await p.goto(path);
    const r = await p.eval(`({ xss: window.__xss || 0, bad: [...document.querySelectorAll('[href],[src]')].filter(n => /^\\s*(javascript|data):|^\\/\\//i.test(n.getAttribute('href') || n.getAttribute('src') || '')).length, injected: document.querySelectorAll('main script:not([type]), main [onerror], main [onmouseover]').length })`);
    await p.close();
    results.push(path + ':' + JSON.stringify(r));
    assert(r.xss === 0 && r.bad === 0 && r.injected === 0, path + ' ' + JSON.stringify(r));
  }
  return 'no execution, no unsafe URLs';
});

await check('admin preserves marketing field', async () => {
  const p = await openPage();
  await p.goto('admin.html');
  const n = await p.eval(`document.querySelectorAll('.proj-item').length`);
  const r = await p.eval(`(() => { projects[0].marketing = 'https://example.com/promo'; projects[0].extra = 'keep-me'; openEdit(0); document.getElementById('btn-save').click(); return { marketing: projects[0].marketing, extra: projects[0].extra }; })()`);
  const blocked = await p.eval(`(() => { let msg = ''; window.alert = (m) => { msg = m; }; openEdit(1); document.getElementById('f-link').value = 'javascript:alert(1)'; document.getElementById('btn-save').click(); return msg; })()`);
  await p.close();
  assert(n === 10 && r.marketing === 'https://example.com/promo' && r.extra === 'keep-me' && /must start/.test(blocked), JSON.stringify({ n, r, blocked }));
  return `${n} projects listed; unknown fields kept; javascript: URL rejected`;
});

chrome.kill();

// ── Report ──
const failed = results.filter((r) => !r.ok);
for (const r of results) if (!r.ok || process.argv.includes('--verbose')) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.page}  —  ${r.msg}`);
const checks = results.filter((r) => r.ok && !/no JS errors/.test(r.msg));
checks.forEach((r) => console.log(`PASS  ${r.page}  —  ${r.msg}`));
console.log(`\n${results.length - failed.length} passed, ${failed.length} failed`);
process.exit(failed.length ? 1 : 0);
