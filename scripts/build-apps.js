#!/usr/bin/env node
// Generates apps/<slug>/index.html for every works.json project (unless it
// has a bespoke `marketing` page) and regenerates sitemap.xml.
// Zero dependencies — plain Node fs/path only. Run: node scripts/build-apps.js

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE_URL = 'https://darskeeworks.online';
const SUPPORT_EMAIL = 'darilquervo.dev@gmail.com';

function fail(message) {
  console.error('build-apps: ' + message);
  process.exit(1);
}

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function platformToCategory(platform) {
  platform = platform || '';
  if (platform.indexOf('Android') !== -1) return 'android';
  if (platform.indexOf('iOS') !== -1) return 'ios';
  if (platform.indexOf('Website') !== -1) return 'web';
  if (platform.indexOf('Desktop') !== -1) return 'desktop';
  return 'other';
}

function applicationCategory(bucket) {
  if (bucket === 'android' || bucket === 'ios') return 'MobileApplication';
  if (bucket === 'web') return 'WebApplication';
  return 'SoftwareApplication';
}

function operatingSystem(bucket) {
  if (bucket === 'android') return 'Android';
  if (bucket === 'ios') return 'iOS';
  if (bucket === 'web') return 'Web browser';
  if (bucket === 'desktop') return 'Windows, macOS';
  return undefined;
}

const STORE_LABELS = {
  playStore: 'Get it on Google Play',
  appStore: 'Download on the App Store',
  testflight: 'Join TestFlight',
  apkDownload: 'Download APK',
  website: 'Launch Web App',
  docs: 'Documentation',
  userGuide: 'User Guide',
  demoVideo: 'Watch Demo',
  github: 'View on GitHub'
};

const FALLBACK_LABEL_BY_BUCKET = {
  android: 'Get it on Google Play',
  ios: 'Download on the App Store',
  web: 'Visit Website',
  desktop: 'Download',
  other: 'Visit ↗'
};

function autoPrivacy(p, slug) {
  return p.privacy || (SITE_URL + '/privacy.html#' + slug);
}
function autoSupport(p) {
  return p.support || ('mailto:' + SUPPORT_EMAIL + '?subject=' + encodeURIComponent('Support: ' + p.name));
}
function autoTerms(p) {
  return p.terms || (SITE_URL + '/terms.html');
}

function storeButtonsHtml(p, bucket) {
  const links = p.storeLinks || {};
  const buttons = Object.keys(STORE_LABELS)
    .filter(function (key) { return links[key]; })
    .map(function (key) {
      return '<a class="store-btn" href="' + esc(links[key]) + '" target="_blank" rel="noopener">' + STORE_LABELS[key] + '</a>';
    });

  if (buttons.length) return buttons.join('\n      ');

  if (p.link) {
    const label = FALLBACK_LABEL_BY_BUCKET[bucket] || FALLBACK_LABEL_BY_BUCKET.other;
    return '<a class="store-btn" href="' + esc(p.link) + '" target="_blank" rel="noopener">' + label + '</a>';
  }

  return '<span class="status-badge">Coming soon</span>';
}

function statusBadgeHtml(p) {
  if (p.status === 'coming-soon') return '<span class="status-badge">Coming Soon</span>';
  if (p.status === 'beta') return '<span class="status-badge">Beta</span>';
  return '';
}

function featuresListHtml(features) {
  return '<section class="app-section"><div class="wrap"><h2>Features</h2><ul class="feature-list">'
    + features.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('')
    + '</ul></div></section>';
}

function screenshotsGridHtml(screenshots, name) {
  return '<section class="app-section"><div class="wrap"><h2>Screenshots</h2><div class="shot-grid">'
    + screenshots.map(function (src) { return '<img src="../../' + esc(src) + '" alt="' + esc(name) + ' screenshot" loading="lazy" />'; }).join('')
    + '</div></div></section>';
}

function changelogHtml(changelog) {
  return '<section class="app-section"><div class="wrap"><h2>Changelog</h2><div class="changelog-list">'
    + changelog.map(function (c) {
        return '<div class="changelog-entry"><span class="cv">v' + esc(c.version) + '</span><span class="cd">' + esc(c.date) + '</span><p>' + esc(c.notes) + '</p></div>';
      }).join('')
    + '</div></div></section>';
}

function comingSoonSectionHtml(name) {
  return '<section class="app-section"><div class="wrap"><h2>About this app</h2>'
    + '<p class="app-empty-note">Full feature details, screenshots, and changelog for ' + esc(name) + ' are coming soon. In the meantime, use the links above to try it or get in touch with questions.</p>'
    + '</div></section>';
}

function buildJsonLd(p, slug, canonicalUrl, ogImage, bucket) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: p.name,
    description: p.description,
    applicationCategory: applicationCategory(bucket),
    url: canonicalUrl
  };
  const os = operatingSystem(bucket);
  if (os) ld.operatingSystem = os;
  if (p.image) ld.image = ogImage;
  return JSON.stringify(ld, null, 2);
}

function main() {
  const worksPath = path.join(ROOT, 'works.json');
  const templatePath = path.join(ROOT, 'templates', 'app.template.html');

  let raw;
  try {
    raw = fs.readFileSync(worksPath, 'utf8');
  } catch (e) {
    fail('could not read works.json (' + e.message + ')');
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    fail('works.json is not valid JSON — ' + e.message);
  }

  const projects = data.projects;
  if (!Array.isArray(projects) || !projects.length) {
    fail('works.json has no "projects" array');
  }

  const errors = [];
  projects.forEach(function (p, i) {
    ['name', 'platform', 'description'].forEach(function (field) {
      if (!p[field] || !String(p[field]).trim()) {
        errors.push('project #' + i + ' is missing required field "' + field + '"');
      }
    });
  });
  if (errors.length) fail('invalid works.json:\n  - ' + errors.join('\n  - '));

  const template = fs.readFileSync(templatePath, 'utf8');

  const seenSlugs = new Map();
  let generatedCount = 0;
  const sitemapUrls = [
    SITE_URL + '/',
    SITE_URL + '/privacy.html',
    SITE_URL + '/terms.html'
  ];

  projects.forEach(function (p) {
    const slug = p.slug || slugify(p.name);
    if (seenSlugs.has(slug)) {
      fail('duplicate slug "' + slug + '" for "' + p.name + '" and "' + seenSlugs.get(slug) + '" — set an explicit "slug" field to disambiguate');
    }
    seenSlugs.set(slug, p.name);

    if (p.marketing) {
      const marketingUrl = /^https?:\/\//.test(p.marketing) ? p.marketing : (SITE_URL + '/' + p.marketing);
      sitemapUrls.push(marketingUrl);
      return; // bespoke page stays authoritative, no generated app page
    }

    const bucket = platformToCategory(p.platform);
    const canonicalUrl = SITE_URL + '/apps/' + slug + '/';
    const ogImage = p.image ? SITE_URL + '/' + p.image : SITE_URL + '/icon.png';
    const icon = p.image ? ('../../' + p.image) : '../../icon.png';

    const features = Array.isArray(p.features) ? p.features.filter(Boolean) : [];
    const screenshots = Array.isArray(p.screenshots) ? p.screenshots.filter(Boolean) : [];
    const changelog = Array.isArray(p.changelog) ? p.changelog.filter(Boolean) : [];
    const hasAnyDetail = features.length || screenshots.length || changelog.length;

    const featuresSection = hasAnyDetail ? (features.length ? featuresListHtml(features) : '') : comingSoonSectionHtml(p.name);
    const screenshotsSection = hasAnyDetail && screenshots.length ? screenshotsGridHtml(screenshots, p.name) : '';
    const changelogSection = hasAnyDetail && changelog.length ? changelogHtml(changelog) : '';

    const html = template
      .split('{{NAME}}').join(esc(p.name))
      .split('{{DESCRIPTION}}').join(esc(p.description))
      .split('{{PLATFORM}}').join(esc(p.platform))
      .split('{{CANONICAL_URL}}').join(canonicalUrl)
      .split('{{OG_IMAGE}}').join(ogImage)
      .split('{{ICON}}').join(icon)
      .split('{{STATUS_BADGE}}').join(statusBadgeHtml(p))
      .split('{{STORE_BUTTONS_HTML}}').join(storeButtonsHtml(p, bucket))
      .split('{{FEATURES_SECTION}}').join(featuresSection)
      .split('{{SCREENSHOTS_SECTION}}').join(screenshotsSection)
      .split('{{CHANGELOG_SECTION}}').join(changelogSection)
      .split('{{PRIVACY_URL}}').join(autoPrivacy(p, slug))
      .split('{{SUPPORT_URL}}').join(autoSupport(p))
      .split('{{TERMS_URL}}').join(autoTerms(p))
      .split('{{JSON_LD}}').join(buildJsonLd(p, slug, canonicalUrl, ogImage, bucket));

    const outDir = path.join(ROOT, 'apps', slug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');

    sitemapUrls.push(canonicalUrl);
    generatedCount++;
  });

  const today = new Date().toISOString().slice(0, 10);
  const sitemapXml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + sitemapUrls.map(function (url) {
        return '  <url><loc>' + esc(url) + '</loc><lastmod>' + today + '</lastmod></url>';
      }).join('\n')
    + '\n</urlset>\n';
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemapXml, 'utf8');

  console.log('build-apps: generated ' + generatedCount + ' app pages, sitemap.xml with ' + sitemapUrls.length + ' urls.');
}

main();
