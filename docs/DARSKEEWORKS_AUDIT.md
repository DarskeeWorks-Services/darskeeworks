# DarskeeWorks Website — Phase 1 Audit

> **Status (2026-11-04):** All issues below have been addressed on `feature/digital-studio`. See `DARSKEEWORKS_IMPLEMENTATION.md` §7 for the fixes and `DARSKEEWORKS_TEST_REPORT.md` for the verification.

- **Date:** 2026-11-04
- **Audited commit:** `d1f327d` (main): "Add optional Marketing button to project cards"
- **Backup branch:** `backup/pre-transformation-2026-11-04` (local; not yet pushed)
- **Working branch:** `feature/digital-studio`
- **Live domain:** https://darskeeworks.online (via `CNAME`)

---

## 1. Architecture

| Aspect | Current state |
|---|---|
| Stack | Static HTML + one shared CSS file + inline vanilla JS. No framework, no build step, no npm dependencies. |
| Hosting | GitHub Pages, custom domain `darskeeworks.online`. |
| Deployment | `.github/workflows/deploy.yml` runs on **every push to `main`** and uploads the **entire repository root** (`path: '.'`) as the Pages artifact. |
| Jekyll | Disabled (`.nojekyll`). |
| Data | `works.json` holds `{ projects: [...] }` and is fetched at runtime by `index.html`, `privacy.html` and `admin.html`. |
| Fonts | Google Fonts: Archivo, Inter, Space Mono. |
| Third-party scripts | None. No analytics, no form service, no payments. |
| Routing | Flat `.html` files. GitHub Pages also serves them extensionless (`/privacy` → `privacy.html`). |

### Consequences
- **Merging to `main` deploys to production.** All redesign work must stay on a branch until approved.
- **Everything in the repo gets published**, including `docs/`, `admin.html` and any untracked image that is later committed. These docs (including this security section) would be publicly readable at `darskeeworks.online/docs/...` unless the workflow is changed to publish only site files.

---

## 2. Pages and features

| File | Purpose | Notes |
|---|---|---|
| `index.html` | Single-page site: nav, hero, About, Services (5 priced cards), Tech, Credentials, Work (from `works.json`), Contact form, footer | All JS inline. |
| `styles.css` | Shared dark theme (438 lines) | Variables are mislabeled (`--amber` is actually sky blue `#38bdf8`). Used by index and most privacy pages. |
| `admin.html` | Client-side `works.json` editor. Password-gated, add/edit/delete projects, download JSON for manual commit | `noindex`. Self-contained styles. |
| `privacy.html` | Combined privacy page that **auto-generates** a policy per project from `works.json`, using keyword matching on descriptions | Anchor per project slug. |
| `privacy-*.html` (10 files) | Hand-written policies per app: Solar PV Calc, Budget Tracker, Pass N4, Sales & Inventory, Moofy, Mochi Sensei, DarsKaraoke, GuroAssist PH, Portfolio, Darskee Automation | **Linked from App Store and Google Play listings; URLs must not change.** |
| `support-mochisensei.html` | Mochi Sensei support and FAQ (App Store support URL) | Self-contained Apple-style design. **URL must not change.** |
| `robots.txt` | `Disallow: /admin.html` | No sitemap reference. |
| `CNAME` | `darskeeworks.online` | Must be preserved. |
| `404.html` | **Missing** | GitHub Pages shows its default 404 page. |
| `cv.pdf` | **Missing** | The hero "Download CV" button has a HEAD-check fallback that changes it to "CV on request →". |

### JavaScript behavior in `index.html`
1. **Mobile nav toggle** with `aria-expanded`; the menu closes when a link is clicked.
2. **Project rendering** from `works.json`, building cards through `innerHTML` string concatenation. Privacy and support links are auto-derived when empty. The optional `marketing` link is supported.
3. **Fallback placeholder cards** if `works.json` fails to load.
4. **Contact form**: builds a `mailto:` URL and redirects. Nothing is sent unless the visitor has a configured mail app.
5. **CV fallback** (HEAD request).

### `works.json` schema (preserve)
```json
{ "platform": "", "name": "", "description": "", "image": "", "link": "",
  "privacy": "", "support": "", "marketing": "" }
```
`marketing` is optional. The Mochi Sensei record omits it.

### Verified project records (10)
| # | Name | Platform | Live link |
|---|---|---|---|
| 1 | Solar PV Calc - Solar Designer | Android · Google Play | play.google.com (com.darskee.solarcalc) |
| 2 | Budget Tracker by Darskee | Android · Google Play | com.darskee.personalbudgettracker |
| 3 | Darskee Pass Jlpt N4 | Android · Google Play | com.darskeeworks.passjlptn4 |
| 4 | Darskee-Sales & Inventory App | Android · Google Play | com.darskeeworks.darskee |
| 5 | Moofy - Your Budget Buddy | iOS · App Store | id6764759098 |
| 6 | Mochi Sensei – JLPT Study Master | iOS · App Store | id6787880229 |
| 7 | DarsKaraoke - Sing Your Heart Out | Website | darskaraoke.up.railway.app |
| 8 | GuroAssist PH - Your Virtual Assistant | Website | guroassistph.site |
| 9 | Daril Quervo Portfolio | Website | darilquervo.com |
| 10 | Darskee Automation | Desktop Software | darskee-automation-site-production.up.railway.app |

**Verified counts:** 4 Android, 2 iOS, 3 websites, 1 desktop app.

**Not found in the repo:** "Darskee AI" and "Darskee App Studio" (named in the brief). No data, images or links exist for them, so they will not be shown until real records are supplied. The brief's "Moofy: Your Personal Budget Buddy" matches the App Store slug (`moofy-personal-budget-buddy`), but `works.json` says "Moofy - Your Budget Buddy".

---

## 3. Integrations

| Integration | Status |
|---|---|
| Email | `mailto:darilquervo.dev@gmail.com` (form, channels, support links) |
| LINE | `https://line.me/ti/p/YMigpeLlZr` |
| GitHub | `github.com/darilquervodev-spec` |
| App stores | Google Play ×4, App Store ×2 (outbound links only) |
| Form backend | **None** |
| Payments / checkout | **None** (no Payhip, Gumroad, Stripe or PayPal found) |
| Analytics | **None** |
| Structured data | JSON-LD `Organization` + `Person`, using the **wrong domain** (`darilquervo.com`) |

---

## 4. Assets

| File | Size | Use |
|---|---|---|
| `icon.png` | **1.46 MB** | Favicon and apple-touch-icon. This is the DW circular logo. Far too large for a favicon. |
| `daril.jpg` | 35 KB | Founder photo (About) |
| `assets/darskee-automation.png` | 1.72 MB | Project screenshot |
| `assets/solar-app.png` | 1.45 MB | Project screenshot |
| `assets/moofy-app.png` | 1.42 MB | Project screenshot |
| `assets/budget-tracker-app.png` | 1.14 MB | Project screenshot |
| `assets/n4-app.png` | 1.03 MB | Project screenshot |
| `assets/inventory-app.png` | 826 KB | Project screenshot |
| `assets/darskaraoke.png` | 622 KB | Project screenshot |
| `assets/website.png` | 596 KB | Portfolio screenshot |
| `assets/guroassistph.png` | 334 KB | Project screenshot |
| `assets/website.jpg` | 285 KB | **Unused** |
| `assets/mochi-sensei.png` | 17 KB | App icon (used as screenshot) |

The work grid alone loads about **9 MB** of PNGs, with no lazy loading, no `width`/`height` attributes and no WebP.

### Untracked brand files in the working tree
- `Facebook Branding kit.png`: a cover banner ("WE DESIGN. WE BUILD. WE GROW.").
- `ChatGPT Image Jun 21, 2026, 11_51_56 AM.png`: a full brand kit sheet. It defines:
  - **Logo:** "DW" monogram plus "DARSKEE WORKS" wordmark (primary, secondary and icon variants; `icon.png` is the icon variant).
  - **Colors:** `#0A0F19`, `#0D182A`, `#146EF5` (electric blue), `#A0AEC0`, `#FFFFFF`.
  - **Font:** Poppins (Bold, SemiBold, Medium, Regular).
  - ⚠ The sheet contains **placeholder testimonials** ("John Smith, CEO", "Michael Brown, Founder, Bright Tech") and an example "@darskeeworks" handle. **These must not be used on the site.**

The site currently shows the brand as a text wordmark ("Darskee**Works**"). The kit's colors and font differ from the live CSS (Archivo/Inter, `#38bdf8`).

---

## 5. Critical problems

### Security
| # | Issue | Location | Severity |
|---|---|---|---|
| S1 | **Unescaped `innerHTML` rendering** of every `works.json` field, and URLs are not validated (`javascript:` would execute). | `index.html` `renderProjects`; `privacy.html` `renderPolicies` | Medium. The data is self-authored today, but a bad paste via admin could inject script. Fix with DOM APIs, `textContent`, and an `https:`/`mailto:`/relative URL allowlist. |
| S2 | **Admin "auth" is cosmetic.** An unsalted SHA-256 hash of the password sits in public source and can be brute-forced offline. Setting `sessionStorage.dw_auth='1'` bypasses it. The page and `works.json` are public anyway. | `admin.html` | Low actual impact, because admin cannot write to the server; it only downloads a file. It must be **described as a convenience editor, not security**. The hash should be removed or treated as compromised: **don't reuse that password anywhere.** |
| S3 | `robots.txt` advertises `/admin.html`. | `robots.txt` | Informational. `noindex` on the page already covers indexing. |
| S4 | The Pages artifact publishes the whole repo, including `docs/`. | `deploy.yml` | Medium once docs exist. Fix by publishing a whitelisted `_site/` folder. |

### Functional
| # | Issue | Location |
|---|---|---|
| F1 | Contact form only opens a `mailto:` link. Visitors on webmail or without a mail app get nothing, and the note "Your message goes directly to my inbox" is inaccurate. | `index.html` |
| F2 | **Admin silently drops the `marketing` field** whenever a project is saved, because `openEdit`/save don't include it. Editing then downloading loses data. | `admin.html` |
| F3 | Admin's platform list lacks "Desktop Software", so Darskee Automation opens as "Other (custom)". | `admin.html` |
| F4 | `cv.pdf` is missing. It also no longer fits the "company" positioning. | `index.html` |
| F5 | No `404.html`. | — |
| F6 | `support-mochisensei.html` links "Privacy Policy" to `/privacy` (the generic auto-generated page) instead of `privacy-mochisensei.html`. | `support-mochisensei.html` |
| F7 | `privacy.html` auto-generates legal text from keyword matches. The result can be inaccurate (for example, GuroAssist's description contains "support", which triggers a rule). The hand-written per-app pages are authoritative. | `privacy.html` |

### Content accuracy (must fix; "no false claims")
| # | Claim on site | Reality |
|---|---|---|
| C1 | Hero spec "Shipped: 4 Android · 1 iOS" | `works.json` lists **4 Android + 2 iOS** |
| C2 | Credentials "5 apps live in the stores" | **6** |
| C3 | Institutional service: "Highly secure, **R.A. 10173 (Data Privacy Act) compliant**" | A compliance guarantee. Wording should become "built with Data Privacy Act requirements in mind", or proof should be provided. |
| C4 | Form note: "goes directly to my inbox" | False (it uses `mailto:`) |
| C5 | Founder title is "licensed Master Electrician" in About but "Registered Master Electrician" in Credentials | Pick one and verify |

### SEO
- JSON-LD `@id`/`url` point to `darilquervo.com` (5 places).
- No canonical, Open Graph or Twitter tags.
- No `sitemap.xml`.
- One H1 only, and all content sits on one URL, so there is nothing to rank for "website development Philippines" or "teacher planner".
- `img alt` is just the project name.

### Performance
- About 11 MB of images, with a 1.46 MB favicon.
- Three Google Font families with 10 weights loaded.
- No lazy loading.

### Business / positioning
- **Pricing conflict.** Current prices are ₱15,000 (portfolio), ₱35,000 (catalog), ₱85,000 (institutional) and ₱15,000 (CV). The brief proposes ₱4,999 / ₱9,999 / ₱14,999 / ₱24,999 / custom, which is **67–70 % lower**. This needs explicit owner sign-off before publishing.
- The site reads as a personal developer CV ("I build things", "Download CV", "developer roles"), not a studio.
- Nothing is for sale online today: there is no marketplace and no checkout.

---

## 6. Preservation requirements

**Must remain untouched (same URL and content, except for agreed fixes):**
- `CNAME`, `.nojekyll`
- All 10 `privacy-*.html` files (store-listed URLs)
- `support-mochisensei.html` (store-listed URL; F6 link fix only, with approval)
- `works.json` records: content unchanged; only additive, optional fields
- `assets/*` originals (optimized copies are added alongside; originals are not deleted until approved)
- `daril.jpg`, `icon.png` (optimized favicon derivatives are added; the original is kept)
- Founder facts: Daril Quervo; Fukuoka, JP; OFW background; Master Electrician / carpenter; languages English, Japanese (N4), Tagalog, Cebuano; email; LINE; GitHub
- The `works.json` → `privacy.html#slug` anchor behavior (existing links may rely on it)

**Must keep working:**
- The admin editor's load/edit/download flow
- `index.html` at `/` (with redirects or anchors for old `#about`, `#services`, `#work`, `#contact`)

---

## 7. Files to modify or create

| File | Change |
|---|---|
| `index.html` | Rebuilt as a conversion homepage. Old section anchors are kept. Safe rendering. JSON-LD fixed. |
| `styles.css` | Replaced by a design-system stylesheet. The old file is kept as `styles-legacy.css` so un-migrated privacy pages render the same. |
| `admin.html` | Fix F2/F3. Add a clear "not secure; convenience editor" notice. Remove the reusable hash. Add fields for new optional project data. |
| `privacy.html` | Safe rendering. It becomes an index linking to the per-app policies plus a website/marketplace privacy policy. |
| `robots.txt` | Add sitemap. Admin handling to be decided. |
| `.github/workflows/deploy.yml` | Publish a whitelisted `_site/` (exclude `docs/`, brand-kit sources). |
| `works.json` | Additive optional fields only (`slug`, `category`, `tech`, `caseStudy`, `featured`). |
| **New pages** | `services.html`, `shop.html`, `product.html`, `portfolio.html`, `case-study.html`, `pricing.html`, `about.html`, `contact.html`, `support.html`, `terms.html`, `refund-policy.html`, `license.html`, `service-agreement.html`, `404.html` |
| **New JS** | `js/site.js` (nav, footer, safe DOM helpers), `js/config.js` (form endpoint, GA ID, currency rate, prices), `js/products.js` (catalog), `js/shop.js`, `js/portfolio.js`, `js/contact.js`, `js/analytics.js` |
| **New data** | `data/products.json` or `js/products.js` (12 products, all `status: "draft"`), `data/services.json` (packages and prices) |
| **New** | `sitemap.xml`, optimized `assets/img/*.webp`, favicon set, OG image |
| **Docs** | `docs/DARSKEEWORKS_IMPLEMENTATION.md`, `_TEST_REPORT.md`, `_DEPLOYMENT.md` |

---

## 8. Recommended implementation sequence

1. **Deploy safety first.** Change the workflow to publish a whitelisted `_site/` so docs aren't public. Keep all work on `feature/digital-studio`.
2. **Security and correctness fixes on the existing site** (small, low-risk, independently shippable): S1 safe rendering, F2/F3 admin fixes, JSON-LD domain, C1–C5 wording.
3. **Design system**, built from the brand kit: Poppins, `#0A0F19`/`#0D182A`/`#146EF5`/`#A0AEC0`/`#FFF`, light content surfaces, DW logo. Plus shared header and footer.
4. **Homepage**, then **Services and Pricing** (prices in one config file).
5. **Portfolio and case studies** from `works.json`. Case-study fields stay empty or hidden until real content is written.
6. **Marketplace**: product config, shop, product template. Every product is a `draft`, and the Buy button is disabled until it is `published` and has a checkout URL.
7. **Contact**: form service integration plus honeypot and validation. The mailto fallback is kept until a provider is configured.
8. **Legal pages**, drafted for owner review. Not legal advice.
9. **SEO** (meta, OG, sitemap, JSON-LD) and **GA4**, loaded only when an ID is configured.
10. **Image optimization**, 404 page, QA, test report, deployment and rollback docs.
11. **Filipino language**: deferred to a later phase (recommended). See the decisions below.

---

## 9. Decisions needed from the owner

1. **Pricing:** confirm the new ₱4,999–₱24,999 packages replace the current ₱15k/₱35k/₱85k prices. Also decide whether the "International CV portfolio" service is kept or dropped.
2. **Form provider:** Web3Forms or Formspree (both have free tiers and work on GitHub Pages). On a static site the form's access key/endpoint ID is **necessarily public**. These services are designed for that, and the destination email stays private in the provider dashboard. A Cloudflare Worker could hide it fully, but that adds a backend.
3. **Checkout provider:** Payhip or Gumroad. An account is needed before any product can go live.
4. **GA4 measurement ID**, if analytics is wanted now.
5. **Logo usage:** use the DW monogram from the brand kit (a transparent PNG or SVG export is needed; `icon.png` has a baked-in background), or keep the text wordmark.
6. **Admin page:** keep it public (as now), or remove it from the published site and run it locally only (recommended).
7. **Darskee AI / Darskee App Studio:** provide real details, or omit them.
8. **Filipino translation:** defer (recommended) or include in v1.
