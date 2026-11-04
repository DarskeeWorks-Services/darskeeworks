/*
 * DarskeeWorks shared site script.
 * - Safe DOM building (no innerHTML with data) and URL allowlisting
 * - Navigation, footer year, active link
 * - Price formatting (PHP / USD), purchase eligibility
 * - works.json loading, project + product cards
 * - Analytics wrapper (GA4 loads only when a measurement ID is configured)
 */
(function () {
  'use strict';

  var CFG = window.DW_CONFIG || {};
  var DW = window.DW = {};

  /* ── Safe URL handling ─────────────────────────────────────────────────── */
  var SAFE_SCHEMES = /^(https?:|mailto:|tel:)/i;

  /** Returns the URL if it is relative or uses an allowed scheme, otherwise ''. */
  DW.safeUrl = function (url) {
    if (typeof url !== 'string') return '';
    var u = url.trim();
    if (!u) return '';
    // Strip control characters/whitespace browsers ignore when parsing schemes (e.g. "java\nscript:")
    var probe = u.replace(/[\u0000- ]/g, '');
    if (/^[a-z][a-z0-9+.\-]*:/i.test(probe)) return SAFE_SCHEMES.test(probe) ? u : '';
    if (probe.indexOf('//') === 0) return '';
    return u;
  };

  DW.isHttps = function (url) {
    return typeof url === 'string' && /^https:\/\/[^\s/$.?#].[^\s]*$/i.test(url.trim());
  };

  DW.isExternal = function (url) {
    return /^https?:\/\//i.test(url) && url.indexOf(CFG.siteUrl || '\u0000') !== 0;
  };

  /* ── DOM builder ───────────────────────────────────────────────────────── */
  /**
   * DW.el('a', { class: 'x', href: url, text: 'Hi' }, [children...])
   * href/src are passed through safeUrl. Strings in children become text nodes.
   * External links automatically get target=_blank rel=noopener.
   */
  DW.el = function (tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (key) {
      var val = attrs[key];
      if (val === null || val === undefined || val === false) return;
      if (key === 'text') { node.textContent = String(val); return; }
      if (key === 'class') { node.className = val; return; }
      if (key === 'dataset') { Object.keys(val).forEach(function (k) { node.dataset[k] = val[k]; }); return; }
      if (key.indexOf('on') === 0 && typeof val === 'function') { node.addEventListener(key.slice(2), val); return; }
      if (key === 'href' || key === 'src' || key === 'action') {
        var safe = DW.safeUrl(val);
        if (!safe) return;
        node.setAttribute(key, safe);
        if (key === 'href' && DW.isExternal(safe) && !attrs.target) {
          node.setAttribute('target', '_blank');
          node.setAttribute('rel', 'noopener');
        }
        return;
      }
      node.setAttribute(key, val === true ? '' : String(val));
    });
    (children || []).forEach(function (child) {
      if (child === null || child === undefined || child === false) return;
      node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    });
    return node;
  };

  DW.clear = function (node) { while (node && node.firstChild) node.removeChild(node.firstChild); return node; };
  DW.$ = function (sel, root) { return (root || document).querySelector(sel); };
  DW.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  DW.param = function (name) { return new URLSearchParams(window.location.search).get(name); };

  /* ── Icons (static SVG markup only — never data) ───────────────────────── */
  var ICONS = {
    web: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 8h18M8 21h8M12 18v3"/>',
    mobile: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    software: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 9l-2 3 2 3M16 9l2 3-2 3M13 8l-2 8"/>',
    ai: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 10h4v4h-4z"/>',
    design: '<path d="M12 20l7-7-3-3-7 7v3h3z"/><path d="M14 8l3 3M4 4l6 2-4 4-2-6z"/>',
    teacher: '<path d="M2 9l10-5 10 5-10 5L2 9z"/><path d="M6 11v5c2 2 10 2 12 0v-5"/>',
    business: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M3 13h18"/>',
    canva: '<circle cx="12" cy="12" r="9"/><path d="M15 9.5a3.5 3.5 0 100 5"/>',
    productivity: '<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h9"/>',
    check: '<path d="M5 12l5 5L20 7"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/>',
    chat: '<path d="M4 5h16v11H8l-4 4V5z"/>',
    tools: '<path d="M14 7l3-3 3 3-3 3M17 4l-9 9M4 20l4-1 9-9-3-3-9 9-1 4z"/>',
    store: '<path d="M4 9l1-5h14l1 5M4 9v11h16V9M4 9h16M9 20v-6h6v6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'
  };
  DW.icon = function (name, cls) {
    var span = document.createElement('span');
    span.className = 'icon' + (cls ? ' ' + cls : '');
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || ICONS.software) + '</svg>';
    return span;
  };
  // Upgrade static <span data-icon="name"></span> placeholders in page markup
  function hydrateIcons() {
    DW.$$('[data-icon]').forEach(function (n) {
      if (n.firstChild) return;
      var built = DW.icon(n.getAttribute('data-icon'));
      n.className = (n.className ? n.className + ' ' : '') + 'icon';
      n.setAttribute('aria-hidden', 'true');
      n.appendChild(built.firstChild);
    });
  }

  /* ── Money ─────────────────────────────────────────────────────────────── */
  var RATE = (CFG.currency && CFG.currency.usdToPhp) || 58;

  DW.formatMoney = function (amount, currency) {
    var locale = currency === 'PHP' ? 'en-PH' : 'en-US';
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency', currency: currency,
        minimumFractionDigits: amount % 1 ? 2 : 0, maximumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      return (currency === 'PHP' ? '₱' : '$') + amount;
    }
  };

  /** "approx. $86" for PHP amounts, "approx. ₱1,102" for USD amounts. */
  DW.approxMoney = function (amount, currency) {
    if (!amount) return '';
    if (currency === 'PHP') return 'approx. ' + DW.formatMoney(Math.round(amount / RATE), 'USD');
    if (currency === 'USD') return 'approx. ' + DW.formatMoney(Math.round(amount * RATE / 10) * 10, 'PHP');
    return '';
  };

  DW.productPriceLabel = function (p) {
    if (p.priceLabel) return p.priceLabel;
    if (typeof p.price !== 'number') return 'See listing';
    if (p.price === 0) return 'Free';
    return DW.formatMoney(p.price, p.currency || 'USD');
  };

  /* ── Product rules ─────────────────────────────────────────────────────── */
  DW.products = function () { return window.DW_PRODUCTS || []; };
  DW.categories = function () { return window.DW_PRODUCT_CATEGORIES || []; };
  DW.categoryById = function (id) {
    return DW.categories().filter(function (c) { return c.id === id; })[0] || { id: id, title: id, icon: 'software' };
  };
  DW.productById = function (id) {
    return DW.products().filter(function (p) { return p.id === id; })[0] || null;
  };

  /** Only published products with a valid https checkout URL can be bought. */
  DW.isPurchasable = function (p) {
    return !!p && p.status === 'published' && DW.isHttps(p.checkoutUrl);
  };

  /** Products visible in the shop listing. */
  DW.isListed = function (p) {
    if (p.status === 'published') return true;
    if (p.status === 'draft') return !!(CFG.shop && CFG.shop.showDraftsAsComingSoon);
    return false;
  };

  DW.productUrl = function (p) { return 'product.html?id=' + encodeURIComponent(p.id); };

  /* ── Projects (works.json) ─────────────────────────────────────────────── */
  var worksPromise = null;
  DW.loadWorks = function () {
    if (!worksPromise) {
      worksPromise = fetch('works.json', { cache: 'no-cache' })
        .then(function (r) { if (!r.ok) throw new Error('works.json ' + r.status); return r.json(); })
        .then(function (data) { return Array.isArray(data.projects) ? data.projects : []; });
    }
    return worksPromise;
  };

  DW.slugify = function (str) {
    return String(str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  DW.caseStudy = function (p) { return (window.DW_CASE_STUDIES || {})[p.name] || {}; };
  DW.projectSlug = function (p) { return DW.caseStudy(p).slug || DW.slugify(p.name); };
  DW.caseStudyUrl = function (p) { return 'case-study.html?p=' + encodeURIComponent(DW.projectSlug(p)); };

  DW.projectCategory = function (p) {
    var cs = DW.caseStudy(p);
    if (cs.category) return cs.category;
    var plat = String(p.platform || '');
    if (/google play|app store|ios|android/i.test(plat)) return 'mobile';
    if (/website|web/i.test(plat)) return 'web';
    return 'software';
  };
  DW.PROJECT_CATEGORIES = { mobile: 'Mobile app', web: 'Website / web app', software: 'Software' };
  DW.PROJECT_CATEGORIES_PLURAL = { mobile: 'Mobile apps', web: 'Websites & web apps', software: 'Software' };

  /** Verified counts derived from works.json — never hard-coded. */
  DW.projectStats = function (projects) {
    var s = { android: 0, ios: 0, web: 0, desktop: 0, total: projects.length };
    projects.forEach(function (p) {
      var plat = String(p.platform || '');
      if (/google play|android/i.test(plat)) s.android++;
      else if (/app store|ios/i.test(plat)) s.ios++;
      else if (/website/i.test(plat)) s.web++;
      else s.desktop++;
    });
    s.storeApps = s.android + s.ios;
    return s;
  };

  DW.privacyUrl = function (p) { return p.privacy || ('privacy.html#' + DW.slugify(p.name)); };
  DW.supportUrl = function (p) {
    return p.support || ('mailto:' + CFG.business.email + '?subject=' + encodeURIComponent('Support: ' + p.name));
  };

  /** assets/foo.png → responsive optimized WebP (generated by tools/optimize-images.py). */
  DW.picture = function (src, alt, opts) {
    opts = opts || {};
    var safe = DW.safeUrl(src);
    var img = DW.el('img', {
      src: safe, alt: alt || '', loading: opts.eager ? 'eager' : 'lazy', decoding: 'async',
      width: opts.width || 480, height: opts.height || 300
    });
    var m = /^assets\/([a-z0-9\-]+)\.png$/i.exec(safe);
    if (!m) return img;
    var base = 'assets/opt/' + m[1];
    return DW.el('picture', {}, [
      DW.el('source', { type: 'image/webp', srcset: base + '-480.webp 480w, ' + base + '-960.webp 960w', sizes: opts.sizes || '(max-width: 640px) 100vw, 400px' }),
      img
    ]);
  };

  /** Square app icons get "contain" styling; wide screenshots fill the frame. */
  function markShape(container) {
    var img = container.querySelector('img');
    if (!img) return;
    function apply() {
      if (!img.naturalWidth) return;
      var ratio = img.naturalWidth / img.naturalHeight;
      container.classList.add(ratio > 0.85 && ratio < 1.18 ? 'is-icon' : 'is-shot');
    }
    if (img.complete) apply(); else img.addEventListener('load', apply);
  }

  DW.projectCard = function (p) {
    var link = DW.safeUrl(p.link);
    var thumb = DW.el('div', { class: 'proj-thumb' }, [
      p.image ? DW.picture(p.image, p.name + ' — ' + (p.platform || 'project') + ' by DarskeeWorks') : DW.el('span', { class: 'proj-thumb-empty', text: p.name })
    ]);
    markShape(thumb);
    var links = DW.el('div', { class: 'proj-links' }, [
      DW.el('a', { class: 'btn btn-sm btn-primary', href: DW.caseStudyUrl(p), text: 'Case study' }),
      link ? DW.el('a', { class: 'btn btn-sm btn-outline', href: link, text: liveLabel(p) }) : null
    ]);
    var meta = DW.el('div', { class: 'proj-meta' }, [
      DW.el('a', { href: DW.privacyUrl(p), text: 'Privacy' }),
      DW.el('a', { href: DW.supportUrl(p), text: 'Support' }),
      DW.safeUrl(p.marketing) ? DW.el('a', { href: p.marketing, text: 'Marketing' }) : null
    ]);
    return DW.el('article', { class: 'card proj-card', dataset: { category: DW.projectCategory(p) } }, [
      thumb,
      DW.el('div', { class: 'card-body' }, [
        DW.el('div', { class: 'proj-tags' }, [
          DW.el('span', { class: 'badge', text: DW.PROJECT_CATEGORIES[DW.projectCategory(p)] }),
          DW.el('span', { class: 'proj-platform', text: p.platform || '' })
        ]),
        DW.el('h3', { class: 'card-title', text: p.name }),
        DW.el('p', { class: 'card-text', text: p.description || '' }),
        links, meta
      ])
    ]);
  };

  function liveLabel(p) {
    var plat = String(p.platform || '');
    if (/google play/i.test(plat)) return 'Google Play';
    if (/app store/i.test(plat)) return 'App Store';
    return 'Visit site';
  }
  DW.liveLabel = liveLabel;

  /* ── Product card ──────────────────────────────────────────────────────── */
  DW.productCover = function (p, large) {
    var cat = DW.categoryById(p.category);
    if (p.images && p.images[0]) {
      return DW.el('div', { class: 'prod-cover has-image' + (large ? ' is-large' : '') }, [
        DW.el('img', { src: p.images[0], alt: p.title + ' preview', loading: large ? 'eager' : 'lazy', decoding: 'async', width: 480, height: 360 })
      ]);
    }
    // Illustrative cover until real mockups are added
    return DW.el('div', { class: 'prod-cover cover-' + cat.id + (large ? ' is-large' : ''), role: 'img', 'aria-label': p.title + ' — illustrative cover' }, [
      DW.icon(cat.icon, 'cover-icon'),
      DW.el('span', { class: 'cover-title', text: p.title }),
      DW.el('span', { class: 'cover-cat', text: cat.title })
    ]);
  };

  DW.statusBadge = function (p) {
    if (p.status === 'draft') return DW.el('span', { class: 'badge badge-soon', text: 'Coming soon' });
    if (p.status === 'unavailable') return DW.el('span', { class: 'badge badge-muted', text: 'Unavailable' });
    if (p.kind === 'external') return DW.el('span', { class: 'badge badge-live', text: 'Available' });
    return null;
  };

  DW.productCard = function (p) {
    var price = DW.productPriceLabel(p);
    var approx = typeof p.price === 'number' && p.price > 0 ? DW.approxMoney(p.price, p.currency) : '';
    return DW.el('article', { class: 'card prod-card' + (p.status === 'draft' ? ' is-draft' : '') }, [
      DW.el('a', { class: 'prod-cover-link', href: DW.productUrl(p), tabindex: '-1', 'aria-hidden': 'true' }, [DW.productCover(p)]),
      DW.el('div', { class: 'card-body' }, [
        DW.el('div', { class: 'prod-badges' }, [DW.statusBadge(p)].concat((p.badges || []).map(function (b) {
          return DW.el('span', { class: 'badge badge-outline', text: b });
        }))),
        DW.el('h3', { class: 'card-title' }, [DW.el('a', { href: DW.productUrl(p), text: p.title })]),
        DW.el('p', { class: 'card-text', text: p.short || '' }),
        DW.el('div', { class: 'prod-foot' }, [
          DW.el('div', { class: 'prod-price' }, [
            DW.el('strong', { text: price }),
            approx ? DW.el('small', { text: approx }) : null
          ]),
          DW.el('span', { class: 'card-link', text: p.status === 'draft' ? 'Preview' : 'View' })
        ])
      ])
    ]);
  };

  /* ── FAQ ───────────────────────────────────────────────────────────────── */
  DW.faqList = function (faqs) {
    return DW.el('div', { class: 'faq' }, faqs.map(function (f) {
      return DW.el('details', { class: 'faq-item' }, [
        DW.el('summary', { text: f.q }),
        DW.el('p', { text: f.a })
      ]);
    }));
  };

  /** FAQPage structured data for visible FAQs. */
  DW.faqJsonLd = function (faqs) {
    if (!faqs || !faqs.length) return;
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faqs.map(function (f) {
        return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } };
      })
    });
    document.head.appendChild(s);
  };

  /* ── Analytics ─────────────────────────────────────────────────────────── */
  var GA_ID = /^G-[A-Z0-9]{4,}$/.test(CFG.ga4MeasurementId || '') ? CFG.ga4MeasurementId : '';
  if (GA_ID) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
    var gs = document.createElement('script');
    gs.async = true;
    gs.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(gs);
  }
  /**
   * DW.track('checkout_click', {...}). No-op without GA4.
   * NOTE: checkout_click is a click on an external checkout link — it is NOT a sale.
   */
  DW.track = function (event, params) {
    if (GA_ID && typeof window.gtag === 'function') window.gtag('event', event, params || {});
  };

  /* ── Page chrome ───────────────────────────────────────────────────────── */
  function initNav() {
    var toggle = DW.$('#nav-toggle');
    var menu = DW.$('#nav-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      });
      menu.addEventListener('click', function (e) {
        if (e.target.closest('a')) { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('open')) {
          menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus();
        }
      });
    }
    var page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';
    var aliases = { product: 'shop', 'case-study': 'portfolio' };
    page = aliases[page] || page;
    DW.$$('.site-nav a[data-page]').forEach(function (a) {
      if (a.getAttribute('data-page') === page) a.setAttribute('aria-current', 'page');
    });
    DW.$$('[data-year]').forEach(function (n) { n.textContent = String(new Date().getFullYear()); });
  }

  /* Track clicks on any element marked data-track="event_name" */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-track]');
    if (t) DW.track(t.getAttribute('data-track'), { label: t.getAttribute('data-track-label') || t.textContent.trim().slice(0, 80) });
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initNav(); hydrateIcons(); });
  } else { initNav(); hydrateIcons(); }
})();
