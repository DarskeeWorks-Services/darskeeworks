# DarskeeWorks — Deployment & Rollback

**Nothing has been deployed.** Every push to `main` deploys to https://darskeeworks.online through GitHub Actions, so merging is the deploy step. Only merge after you approve.

## 1. Pre-deployment checklist
- [ ] Review the decisions in `DARSKEEWORKS_IMPLEMENTATION.md` §1, especially prices.
- [ ] Optional but recommended: connect the form (Web3Forms or Formspree key in `js/config.js`).
- [ ] Optional: add your GA4 ID, and update the analytics paragraph in `privacy.html`.
- [ ] Have the legal pages reviewed (`terms`, `refund-policy`, `license`, `service-agreement`, `privacy`).
- [ ] Run the regeneration steps if you edited data, images or partials:
  ```bash
  node tools/sync-partials.mjs       # after editing partials/*
  python -I tools/optimize-images.py # after adding images
  node tools/build-sitemap.mjs       # after publishing products or adding projects
  ```
- [ ] Run QA locally: `python -m http.server 8765 --bind 127.0.0.1`, then `node tools/qa.mjs`. The expected result is 0 failed.

## 2. Deploy
```bash
git checkout feature/digital-studio
git add -A                     # review the list first; brand-kit PNGs are safe (never published) but optional
git commit -m "Transform site into DarskeeWorks digital studio & marketplace"
git push -u origin feature/digital-studio
```
Then open a pull request into `main` on GitHub and review the diff. Merging it triggers **Deploy to GitHub Pages**.

The workflow's **Assemble site** step prints every file it publishes. Confirm that `docs/`, `tools/`, `partials/` and `admin.html` are **not** in the list.

### GitHub Pages and domain checks
- `CNAME` contains `darskeeworks.online` and is copied into the published site.
- In repo **Settings → Pages**, the source must be "GitHub Actions" (it already is, because the existing workflow deploys this way). The custom domain stays `darskeeworks.online`, with **Enforce HTTPS** on.
- `404.html` uses root-absolute paths (`/css/site.css`), so it renders correctly at any missing URL on the custom domain.
- All other pages use relative paths and work from the domain root.

## 3. Post-deploy smoke test (5 minutes)
1. Open `/`, then `/services.html`, `/shop.html` and `/pricing.html` on a phone and a desktop.
2. Open the URLs that the app stores link to. They must still load:
   - `/privacy-moofy.html`, `/privacy-mochisensei.html`, `/support-mochisensei.html`
   - `/privacy-solar-pv-calc.html`, `/privacy-budget-tracker.html`, `/privacy-darskee-pass-n4.html`
   - `/privacy-sales-inventory.html`, `/privacy-darskaraoke.html`, `/privacy-guroassist-ph.html`
   - `/privacy-portfolio.html`, `/privacy-darskee-automation.html`
3. Open `/privacy.html#moofy-your-budget-buddy`. It should scroll to Moofy.
4. Open `/does-not-exist`. The custom 404 page should appear.
5. Submit the contact form. Without a provider, you should see the "NOT sent" notice; with a provider, you should get an email.
6. In Google Search Console, submit `https://darskeeworks.online/sitemap.xml`.

## 4. Rollback
The original site is preserved on branch **`backup/pre-transformation-2026-11-04`**, which points at commit `d1f327d`.

Push the backup branch to GitHub now, so the rollback point also exists off this machine:
```bash
git push origin backup/pre-transformation-2026-11-04
```

**Option A: revert the merge (recommended, keeps history)**
```bash
git checkout main && git pull
git revert -m 1 <merge-commit-sha>
git push origin main            # redeploys the previous site automatically
```

**Option B: emergency restore of the exact old site**
```bash
git checkout main && git pull
git checkout backup/pre-transformation-2026-11-04 -- .
git commit -m "Restore pre-transformation site"
git push origin main
```
Option B leaves the new files in place (they are simply not linked). The old workflow publishes the whole repo, so remove `docs/` first if you don't want it public:
`git rm -r --cached docs tools partials`.

**Option C: redeploy a previous build without code changes.** In GitHub, go to **Actions → Deploy to GitHub Pages**, open an earlier successful run, and choose **Re-run all jobs**. This rebuilds from that run's commit.

The rollback takes effect when the Pages deployment finishes (usually 1–2 minutes). Hard-refresh to bypass the cache.
