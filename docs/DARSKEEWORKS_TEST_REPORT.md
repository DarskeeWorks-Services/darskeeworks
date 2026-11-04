# DarskeeWorks — Test Report

- **Date:** 2026-11-04
- **Branch:** `feature/digital-studio` (working tree, uncommitted)
- **Result:** **64 automated checks passed, 0 failed.** Manual screenshot review was done at 1280px and 390px.

## How to re-run
```bash
python -m http.server 8765 --bind 127.0.0.1     # terminal 1, from the repo root
node tools/qa.mjs --verbose                     # terminal 2  (add --shots <dir> for screenshots)
```
`tools/qa.mjs` drives headless Chrome or Edge over the DevTools protocol, with no npm packages. Override the browser with the `CHROME` environment variable.

---

## 1. Every route, desktop (1280px) and mobile (390px)
Each of these 25 URLs is loaded at both widths, 50 page loads in total:

- `index`, `services`, `shop`
- `product?id=ultimate-teacher-planner` (draft), `product?id=darskee-automation` (external), `product?id=does-not-exist`
- `portfolio`, `case-study?p=moofy`, `case-study?p=darskee-automation`
- `pricing`, `about`, `contact`, `contact?service=…&package=…`, `support`
- `privacy`, `privacy#moofy-your-budget-buddy`
- `terms`, `refund-policy`, `license`, `service-agreement`, `404`, `admin`
- The preserved pages `privacy-moofy`, `support-mochisensei` and `privacy-mochisensei`

**Checks on each load, all passing:**
- No JS exceptions or `console.error` output.
- No failed same-origin requests (status ≥ 400).
- No broken images, and every image has `alt`.
- No `javascript:` links.
- No horizontal overflow beyond the target width.
- Exactly one `<h1>` on every new page.

## 2. Links
- **59 unique internal URLs** found across all pages resolve with HTTP 200. ✅

## 3. Functional checks
| Check | Result |
|---|---|
| Mobile nav opens, `aria-expanded="true"` | ✅ |
| Homepage renders 5 services + shop card, 4 featured products, 6 featured projects, 4 price cards and the FAQ. Legacy anchors `#about`, `#services`, `#work` and `#contact` exist. Store-app count = 6, computed from `works.json` | ✅ |
| Shop: 15 listed products; Teacher Resources filter = 4; URL updates to `?category=`; search "inventory" = 2 results; nonsense search shows the empty state; price sort works | ✅ |
| Shop deep link `?category=website-templates` = 2 | ✅ |
| Draft product: Buy button **disabled**, no checkout link, `noindex`, related products shown | ✅ |
| External product: button links to the official site with `target=_blank rel=noopener`; page indexable | ✅ |
| Contact: query-string prefill works; empty submit shows 8 field errors plus a focused summary; valid submit with **no provider configured** shows "has NOT been sent" with a mailto fallback (no false success) | ✅ |
| Contact honeypot: bot submission swallowed, nothing offered or sent | ✅ |
| Portfolio: 10 projects; "Websites & web apps" filter = 3; summary text computed from `works.json` | ✅ |
| Legacy `privacy.html#<slug>` anchors present | ✅ |
| **XSS:** a hostile `works.json` (script/`onerror` markup in names and descriptions; `javascript:`, ` JaVaScRiPt:`, `data:` and `//host` URLs) served to index, portfolio, privacy, support and about → no script ran, no unsafe `href`/`src`, no injected handlers | ✅ |
| Admin: lists 10 projects; saving keeps `marketing` and unknown fields; a `javascript:` URL is rejected | ✅ |
| Lazy images: after scrolling, every image on index, portfolio, shop, about and a case study decodes | ✅ |

## 4. Static checks
- `node --check` on every JS file under `js/` and `tools/`: no syntax errors. ✅
- HTML structure scan (Python `html.parser`) on all 26 `.html` files: no stray or unclosed elements, no duplicate IDs. ✅

## 5. Issues found during QA and fixed
| Issue | Fix |
|---|---|
| Product page grid columns overflowed by 29px on mobile. The earlier overflow check missed it because mobile emulation widens the viewport. | Added `min-width: 0` to grid children, and the QA check now compares against the intended width. |
| Privacy page overflowed by 71px on mobile (long button labels couldn't wrap). | Buttons inside legal text can now wrap. |
| `/favicon.ico` 404 on `support-mochisensei.html` and `admin.html` (pre-existing) | Added a root `favicon.ico` and an admin favicon link. |
| Square app icons looked like flat tiles | App-icon treatment (centered, rounded corners). |
| Product card footer wrapped awkwardly | Simplified the footer. |

## 6. Not tested (needs you or real services)
- **Real form delivery:** no Web3Forms or Formspree key is configured. Once one is, send a test inquiry and confirm it reaches the inbox.
- **Real checkout:** no product has a checkout URL. Test with a 100%-off coupon once published.
- **GA4 events:** no measurement ID. Use GA4 DebugView once one is added.
- **Real devices and browsers:** only Chromium was automated. Spot-check Safari on iOS and Firefox.
- **Screen reader pass:** semantics were checked in code (labels, `aria-invalid`, error summary, `aria-current`, skip link, `<details>` FAQs), but not with NVDA or VoiceOver.
- **W3C validator and Lighthouse:** not run, as there was no network validator in this environment. Recommended: run Lighthouse in Chrome DevTools on the deployed preview.
- **Live third-party links** (App Store, Play, Railway sites): not fetched. They are unchanged from `works.json`.
