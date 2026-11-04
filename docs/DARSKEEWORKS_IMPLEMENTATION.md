# DarskeeWorks — Implementation Guide

- **Branch:** `feature/digital-studio` (not committed, not deployed)
- **Backup of the original site:** branch `backup/pre-transformation-2026-11-04`
- **Date:** 2026-11-04

This guide explains what was built, where every setting lives, and how to do the common jobs: publishing a product, connecting checkout and the form, and changing prices.

---

## 1. Decisions made on your behalf (please review)

You said "proceed all" without answering the open questions. These are the defaults I used. Every one of them can be changed in one place.

| Decision | Default chosen | Where to change |
|---|---|---|
| Website package prices | Your proposed ₱4,999 / ₱9,999 / ₱14,999 / ₱24,999 / Custom (these replace the old ₱15k / ₱35k / ₱85k) | `js/data/services.js` → `packages` |
| Old "International CV portfolio" service | Folded into **Starter** (1-page site) | `js/data/services.js` |
| Maintenance plan prices | **Proposed:** ₱999 / ₱2,499 / ₱4,999 per month | `js/data/services.js` → `maintenancePlans` |
| Mobile app, software, AI and UI/UX pricing | Quotation-based (`price: null`) | `js/data/services.js` → `categories` |
| Form provider | Supports Web3Forms **and** Formspree; **neither configured yet** | `js/config.js` → `forms` |
| Checkout provider | Provider-neutral `checkoutUrl` per product (works with Payhip or Gumroad); **none configured** | `js/data/products.js` |
| GA4 | Built in, **off** until an ID is added | `js/config.js` → `ga4MeasurementId` |
| Logo | DW monogram cut from `icon.png` plus the "Darskee**Works**" wordmark | `tools/optimize-images.py` |
| Admin page | Login removed (it was never secure). **Not published**; runs locally only | `.github/workflows/deploy.yml` |
| "Darskee AI" / "Darskee App Studio" | **Omitted**: no real records exist | Add them to `works.json` when ready |
| Filipino language | **Deferred** (see §9) | — |
| USD↔PHP display rate | 1 USD ≈ 58 PHP, labelled "approx." everywhere | `js/config.js` → `currency.usdToPhp` |
| Refund window | 14 days | `refund-policy.html` **and** `js/config.js` → `shop.refundWindowDays` |
| Darskee Automation price | ₱2,499 one-time, taken from your own promo image. **Verify it is current.** | `js/data/products.js` |

---

## 1b. Merged with main's July 13 work (app pages, terms, marketing page)

Remote `main` had commits (July 13, 2026) that were not in the local copy used for the audit. They were merged in, not overwritten:

- **App pages kept.** `scripts/build-apps.js` still generates `apps/<slug>/` during deploy (the folder is git-ignored and built in CI). `tools/build-sitemap.mjs` runs after it, so the sitemap includes the app pages. Case studies link to each app page.
- **`mochisensei-marketing.html` and `AppStoreScreenshots/` kept and published.** Mochi Sensei's `marketing` field links to the marketing page, and no generated app page is made for it (same rule as before).
- **Your Terms of Service (July 13)** were moved into `service-agreement.html`, keeping your wording: 50% deposit, balance before handoff, milestones, late payment, 2 revision rounds by default, 30-day bug fixes, IP and third-party licenses, liability, cancellation and governing law. `terms.html` is now the general site, shop and services terms and points to the Service Agreement. Package support periods were aligned to your 30 days. The refund policy was aligned to your cancellation clause.
- **Admin:** main's version (Advanced fields: status, slug, version, tags, features, screenshots, changelog, store links) was kept. These fixes were reapplied on top: login and hash removed, local-only notice, Desktop Software platform, unknown fields preserved on save, URL validation (including screenshots and store links).
- **Superseded by the redesign:** main's homepage additions (process steps, FAQ, platform filters, live stats), which the new homepage covers, and main's 404 page. `assets/js/site.js` stays in the repo for the generated app pages' history, but the new pages don't use it.
- `works.json` optional fields from main (`slug`, `status`, `storeLinks`, `features`, …) are respected. `slug` sets case-study and privacy anchors when present.

## 2. Architecture

The site is still plain static HTML, CSS and vanilla JS. There is no framework, no npm dependency and no build step on the server, so it remains fully GitHub Pages compatible.

```
index.html, services.html, shop.html, product.html, portfolio.html, case-study.html,
pricing.html, about.html, contact.html, support.html, privacy.html, terms.html,
refund-policy.html, license.html, service-agreement.html, 404.html
  ├─ css/site.css              design system (tokens, components, layouts)
  ├─ js/config.js              ALL site settings (form, GA4, currency, featured projects)
  ├─ js/site.js                shared: safe DOM builder, URL allowlist, cards, prices, analytics, nav
  ├─ js/data/services.js       services, packages, maintenance plans, FAQs, payment terms
  ├─ js/data/products.js       product catalog + categories + bundles
  ├─ js/data/case-studies.js   case-study narratives keyed by works.json project name
  ├─ js/pages/*.js             one small script per page
  ├─ works.json                UNCHANGED: still the single source for portfolio projects
  ├─ partials/                 shared <head>, header and footer (copied into pages by a script)
  ├─ assets/opt/               optimized WebP project images (generated)
  ├─ assets/brand/             logo mark, favicons, Open Graph image (generated)
  └─ tools/                    optimize-images.py, sync-partials.mjs, build-sitemap.mjs, qa.mjs
```

**Kept as-is:**
- `privacy-*.html` (10 pages) and `privacy-mochisensei.html`, plus `styles.css`, which those pages still use.
- `support-mochisensei.html`, with one fix: its two "Privacy Policy" links now point to `privacy-mochisensei.html` instead of the generic page.
- `CNAME`, `.nojekyll`, `icon.png`, `daril.jpg` and every original image in `assets/`.

### Old URLs
| Old | Now |
|---|---|
| `/` with `#about`, `#services`, `#work`, `#contact` | Still `/`. All four anchors still exist on the new homepage. |
| `privacy.html#<app-slug>` | Every anchor kept. Each one now links to that app's official policy. |
| `privacy-*.html`, `support-mochisensei.html` | Unchanged URLs |
| `admin.html` | No longer published (404 on the live site). Use it locally; see §7. |
| `cv.pdf` button | Removed (the file never existed, and the site is now a studio, not a CV). The workflow still publishes `cv.pdf` if you add one. |

---

## 3. Design system (`css/site.css`)

- **Colors (from your brand kit):** navy `#0A0F19` / `#0D182A`, electric blue `#146EF5`, slate `#A0AEC0`, white. Light neutral backgrounds are used for reading sections.
- **Type:** Poppins 600/700 for headings and Inter 400/500/600 for body text. Five font files, down from ten.
- **Components:**
  - Buttons: `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-light`, `.btn-ghost-light`, plus `-sm` / `-lg` sizes.
  - Badges: `.badge`, with `-soon`, `-live`, `-outline` and `-muted` variants.
  - Cards, price cards, comparison table, FAQ (`<details>`), notices, filter chips, form fields.
  - Header, footer, page hero, CTA band and steps.
- **Breakpoints:** 1000px, 960px (nav becomes a menu), 900px, 760px, 640px and 560px. Layouts are mobile-first and tested at 390px.
- **Motion:** one subtle fade-in on the hero, disabled for users who prefer reduced motion.

### Editing the header or footer
1. Edit `partials/header.html`, `partials/footer.html` or `partials/head.html`.
2. Run `node tools/sync-partials.mjs`. It updates every page that has the `<!-- partial:… -->` markers.

---

## 4. Products and checkout

### Product statuses
| Status | Shop | Product page | Buy button |
|---|---|---|---|
| `draft` | Shown as **Coming soon** (turn this off with `shop.showDraftsAsComingSoon: false`) | `noindex`, with an "In preparation" notice | **Disabled** |
| `published` | Shown | Indexed, with Product structured data | Enabled **only if `checkoutUrl` is a valid `https://` URL** |
| `unavailable` | Hidden | Shows "Currently unavailable" | Disabled |

The rule is enforced in `DW.isPurchasable()` in `js/site.js`. A product cannot be bought by accident.

**Current catalog:**
- **12 concept products, all `draft`:** the planners, kits, templates and bundles from your brief.
- **3 real items, `published`, `kind: 'external'`:**
  - **Darskee Automation** links to its official site.
  - **Mochi Sensei** links to the App Store.
  - **Darskee Sales & Inventory** links to Google Play.

### Publishing a product (step by step)
1. Finish the actual file (PDF, XLSX, ZIP, or a PDF of Canva links).
2. Create the product in **Payhip** or **Gumroad**:
   - Upload the file, set the price and currency.
   - Turn on the provider's automatic file delivery.
   - Copy the product's public link, e.g. `https://payhip.com/b/AbC1` or `https://yourname.gumroad.com/l/planner`.
3. Make mockup images, ideally 1200×900. Save them under `assets/products/<id>/` and run them through the image script, or export WebP directly.
4. In `js/data/products.js`, update the product:
   ```js
   status: 'published',
   checkoutUrl: 'https://payhip.com/b/AbC1',
   images: ['assets/products/ultimate-teacher-planner/cover.webp'],
   previews: ['assets/products/ultimate-teacher-planner/p1.webp', '…'],
   ```
   - Re-read `description`, `includes`, `formats`, `compatibility` and `faqs`. Drafts describe *planned* contents, so make them match the real file.
   - Remove "(planned)" wording if you added any.
   - Make sure `currency` matches what the provider charges.
5. Run `node tools/build-sitemap.mjs`. Published products are added to the sitemap.
6. Test: open the product page, click Buy, and confirm the provider's checkout opens. Do a real test purchase with a 100%-off coupon so you can check delivery.

### Bundles
`window.DW_BUNDLES` holds one draft: "Teacher Essentials Bundle". Bundles are not rendered yet. To sell one, create it in the checkout provider and add it as a normal product entry with `category` set and the bundle contents in `includes`.

### What the site does **not** do (by design)
- It stores no payment credentials and runs no custom checkout.
- It does not verify payments; the provider confirms payment and delivers the file.
- It does not count purchases. `checkout_click` / `begin_checkout` events only mean a click.
- It does not change currency automatically. Prices are shown in the product's currency with an approximate conversion.

---

## 5. Contact / inquiry form

**Fields:**
- Name, email, country, business type and service.
- Package (shown for website projects).
- Budget range (PHP, with approximate USD), preferred timeline, project description.
- Consent checkbox.

**Validation and accessibility:**
- Each field shows its own error message.
- An error summary appears that receives focus and links to each broken field.
- Invalid fields get `aria-invalid`.

**Spam protection:**
- A hidden honeypot field.
- A minimum time-on-page of 3 seconds.
- Bots are shown a fake "thanks" and nothing is sent.

**Deep links:** `contact.html?service=website-development&package=business` or `?service=product-inquiry&product=<id>`.

### Connecting delivery (choose one)
- **Web3Forms** (recommended; free tier, no account dashboard needed):
  1. Go to https://web3forms.com, enter `darilquervo.dev@gmail.com`, and get an access key by email.
  2. In `js/config.js`: `forms: { provider: 'web3forms', web3formsAccessKey: '<key>', formspreeFormId: '' }`
- **Formspree:**
  1. Create a form at https://formspree.io.
  2. In `js/config.js`: `provider: 'formspree', formspreeFormId: '<id>'`

These keys are **designed to be public**. They only allow sending a message to your inbox. Your email address and account stay private on the provider. Restrict the form to the `darskeeworks.online` domain in the provider dashboard.

**Until a provider is configured**, the form validates the input, then clearly says the inquiry has **NOT been sent**. It offers "Open in my email app" (pre-filled) and "Copy message" instead. It never shows a false success message.

After connecting a provider, update the "How it is delivered" paragraph in `privacy.html` to name the provider.

---

## 6. SEO and analytics

**Done:**
- Unique `<title>`, meta description and canonical URL on every page.
- Open Graph and Twitter tags, using a 1200×630 OG image.
- JSON-LD with `Organization`, `ProfessionalService`, `Person` and `WebSite` on the homepage. These now use **darskeeworks.online**, which fixes the old darilquervo.com references. Your portfolio site is kept as the founder's `sameAs`.
- `FAQPage` JSON-LD on the home and services pages, plus `Product` JSON-LD for purchasable products.
- `sitemap.xml` with 37 URLs, generated by `tools/build-sitemap.mjs`, and `robots.txt`, which points to it.
- Descriptive `alt` text on all images.

### GA4
- Paste your ID into `js/config.js` → `ga4MeasurementId: 'G-XXXXXXXXXX'`. Then update the analytics paragraph in `privacy.html`; the replacement text is in an HTML comment there.
- **Events tracked:**
  - `page_view` (automatic)
  - `view_item` (product pages)
  - `begin_checkout` and `checkout_click` (Buy clicks; these are **not sales**)
  - `generate_lead` (successful inquiry submission)
  - `cta_quote`, `cta_shop`, `cta_services`, `cta_portfolio`, `contact_click`, `contact_mailto`
- **Confirmed purchases:** Payhip and Gumroad can report sales to GA4 or Google Ads through their own integration settings. That is the only reliable source of purchase data. The website cannot see completed payments.

**Limitation:** product and case-study pages are rendered with JavaScript from query-string URLs (`product.html?id=…`). Google renders JS and these URLs are in the sitemap, but static per-product pages would rank better. When products are published, consider a small generator that writes `shop/<id>.html` files.

---

## 7. Security changes

| Issue (from the audit) | Fix |
|---|---|
| S1 Unescaped `innerHTML` and unvalidated URLs | Everything is rendered through `DW.el()` (text nodes only). URLs pass through `DW.safeUrl()`, which allows only `https:`, `http:`, `mailto:`, `tel:` and relative paths. `javascript:`, `data:` and `//host` are dropped. Verified with a hostile `works.json` test (see the test report). |
| S2 Client-side admin password | Login and password hash removed. The page is clearly labelled as a local tool, excluded from deployment, and validates URLs before saving. **Treat the old password as public and don't reuse it.** |
| S3 `robots.txt` advertising `/admin.html` | Removed, since the page is no longer published. |
| S4 Whole repo published | The workflow now copies a whitelist into `_site/`. `docs/`, `tools/`, `partials/`, `admin.html` and the brand-kit PNGs are never published. |
| F2 Admin dropped `marketing` | Saving now merges into the existing record. A Marketing URL field was added. Verified by test. |
| F3 Admin platform list | "Desktop Software" added. |
| External links | Automatically get `target="_blank" rel="noopener"`. |

**Using the admin editor locally:**
1. Run `python -m http.server 8000` in the repo.
2. Open http://localhost:8000/admin.html.
3. Edit the projects and click **Download works.json**.
4. Replace the file in the repo, then commit and push.

**If you later want real online editing**, it needs a backend that holds credentials, for example:
- a GitHub OAuth app plus a serverless function that commits `works.json`, or
- a headless CMS such as Decap CMS with GitHub auth.

That adds hosting and setup, so it needs your approval first.

---

## 8. Performance
- Project images are now served as WebP at 480w and 960w with `srcset`, lazy loading and explicit dimensions. The work grid dropped from about **9 MB to about 0.3 MB**.
- Favicon: 32px PNG plus `favicon.ico` (the old one was a 1.46 MB PNG).
- Fonts: two families, five weights, `display=swap`.
- JS: about 60 KB of site JS in total (unminified) and no libraries. GA4 loads only when configured.
- Regenerate the images after adding new ones: `python -I tools/optimize-images.py`.

---

## 9. Not done / follow-ups
1. **Filipino language:** deferred. A proper version needs translated copies of the key pages (`/fil/…` with `hreflang`). A part-translated toggle would mix languages and confuse visitors. Recommended once the English copy is final.
2. **Real testimonials:** the section is intentionally absent. Add it only with real, permission-granted quotes. The brand kit's "John Smith" and "Michael Brown" are placeholders and must not be used.
3. **Product files, mockups and checkout links:** you need to create these; see §4.
4. **Legal review:** the Terms, Refund Policy, License, Service Agreement and updated Privacy Policy are plain-language drafts, not legal advice. They deliberately name **no governing law or jurisdiction** (you are based in Japan and sell to the Philippines and worldwide). Have them reviewed, especially before taking international payments.
5. **Darskee AI / Darskee App Studio:** add `works.json` records, images and links if these exist.
6. **Static product pages** for SEO; see §6.
7. **Brand kit sources:** `ChatGPT Image Jun 21….png` and `Facebook Branding kit.png` are still untracked in the repo root. They are not published even if committed, but consider moving them into a `brand/` folder.
