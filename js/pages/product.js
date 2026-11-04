/* Product detail template: product.html?id=<product id> */
(function () {
  'use strict';
  var el = DW.el;
  var CFG = window.DW_CONFIG;
  var root = DW.$('#product-root');
  var p = DW.productById(DW.param('id') || '');

  function setMeta(name, content, attr) {
    attr = attr || 'name';
    var m = document.querySelector('meta[' + attr + '="' + name + '"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute(attr, name); document.head.appendChild(m); }
    m.setAttribute('content', content);
  }
  function list(items, cls) {
    return el('ul', { class: cls || 'check-list' }, (items || []).map(function (t) { return el('li', { text: t }); }));
  }
  function section(title, body) {
    return el('div', { class: 'stack' }, [el('h2', { class: 'h3', text: title }), body]);
  }

  if (!p) {
    setMeta('robots', 'noindex');
    document.title = 'Product not found — DarskeeWorks';
    DW.clear(root).appendChild(el('div', { class: 'empty-state' }, [
      el('h1', { class: 'h3', text: 'Product not found' }),
      el('p', { class: 'mt-3', text: 'This product may have been renamed or removed.' }),
      el('a', { class: 'btn btn-primary mt-4', href: 'shop.html', text: 'Back to the shop' })
    ]));
    return;
  }

  var cat = DW.categoryById(p.category);
  var buyable = DW.isPurchasable(p);
  var pageUrl = CFG.siteUrl + '/product.html?id=' + encodeURIComponent(p.id);

  // ── Meta ──
  document.title = p.title + ' — ' + cat.title + ' | DarskeeWorks Shop';
  setMeta('description', p.short + ' ' + (p.status === 'draft' ? 'Coming soon.' : ''));
  setMeta('og:title', p.title + ' — DarskeeWorks', 'property');
  setMeta('og:description', p.short, 'property');
  setMeta('og:url', pageUrl, 'property');
  document.querySelector('link[rel="canonical"]').setAttribute('href', pageUrl);
  if (p.status !== 'published') setMeta('robots', 'noindex');

  // Breadcrumb
  var crumbs = DW.$('#product-crumbs');
  crumbs.appendChild(el('li', {}, [el('a', { href: 'shop.html?category=' + encodeURIComponent(cat.id), text: cat.title })]));
  crumbs.appendChild(el('li', { 'aria-current': 'page', text: p.title }));

  // ── Buy box ──
  var approx = typeof p.price === 'number' && p.price > 0 ? DW.approxMoney(p.price, p.currency) : '';
  var currencyNote = typeof p.price === 'number' && p.price > 0
    ? 'Price in ' + p.currency + (approx ? ' (' + approx + ')' : '') + '. You are charged in the currency shown at checkout.'
    : '';

  var action;
  if (p.status === 'unavailable') {
    action = el('button', { class: 'btn btn-lg btn-block', type: 'button', disabled: true, text: 'Currently unavailable' });
  } else if (buyable) {
    action = el('a', {
      class: 'btn btn-primary btn-lg btn-block', href: p.checkoutUrl,
      'data-track': 'checkout_click', 'data-track-label': p.id,
      text: p.ctaLabel || ('Buy now — ' + DW.productPriceLabel(p))
    });
    action.addEventListener('click', function () {
      // A click to an external checkout — NOT a confirmed purchase.
      DW.track('begin_checkout', { currency: p.currency, value: p.price || 0, items: [{ item_id: p.id, item_name: p.title, item_category: cat.title }] });
    });
  } else {
    action = el('button', { class: 'btn btn-lg btn-block', type: 'button', disabled: true, 'aria-describedby': 'buy-status', text: 'Coming soon — not yet available' });
  }

  var statusNote = p.status === 'draft'
    ? el('div', { class: 'notice notice-warn', id: 'buy-status' }, [el('div', {}, [
        el('strong', { text: 'In preparation' }),
        'This product is not for sale yet. Details below describe the planned contents and may change before release.'
      ])])
    : null;

  var deliveryNote = p.kind === 'external'
    ? el('p', { class: 'small muted', text: 'You will be taken to the official ' + (/play\.google/.test(p.checkoutUrl) ? 'Google Play listing' : /apps\.apple/.test(p.checkoutUrl) ? 'App Store listing' : 'product website') + '. Purchase, delivery and pricing are handled there.' })
    : el('p', { class: 'small muted', text: 'Payment and download delivery are handled by our hosted checkout provider. Your download link is provided by the provider after payment is confirmed.' });

  var buyBox = el('aside', { class: 'panel buy-box sticky', 'aria-label': 'Purchase' }, [
    el('div', { class: 'prod-badges' }, [DW.statusBadge(p), el('span', { class: 'badge badge-outline', text: cat.title })]),
    el('h1', { class: 'h2', text: p.title }),
    el('p', { class: 'lead', text: p.short }),
    el('div', { class: 'buy-price' }, [DW.productPriceLabel(p), currencyNote ? el('small', { text: currencyNote }) : null]),
    p.priceNote ? el('p', { class: 'small muted', text: p.priceNote }) : null,
    statusNote,
    action,
    p.status === 'draft' ? el('a', {
      class: 'btn btn-secondary btn-block', href: 'contact.html?service=product-inquiry&product=' + encodeURIComponent(p.id),
      text: 'Ask about this product'
    }) : null,
    deliveryNote,
    el('ul', { class: 'spec-list' }, [
      ['Format', (p.formats || []).join(', ')],
      ['Works with', (p.compatibility || []).join(', ')],
      ['License', p.license ? p.license.type : '—']
    ].map(function (r) { return el('li', {}, [el('span', { text: r[0] }), el('span', { text: r[1] })]); })),
    el('p', { class: 'small' }, [
      el('a', { href: 'refund-policy.html', text: 'Refund policy' }), ' · ',
      el('a', { href: 'license.html', text: 'License terms' }),
      p.privacyUrl ? ' · ' : null, p.privacyUrl ? el('a', { href: p.privacyUrl, text: 'Privacy' }) : null,
      p.supportUrl ? ' · ' : null, p.supportUrl ? el('a', { href: p.supportUrl, text: 'Support' }) : null
    ])
  ]);

  // ── Media ──
  var media = el('div', { class: 'stack' }, [DW.productCover(p, true)]);
  if (!p.images || !p.images.length) {
    media.appendChild(el('p', { class: 'small muted', text: 'Illustrative cover. Product previews will be added before release.' }));
  }
  if (p.previews && p.previews.length) {
    media.appendChild(el('div', { class: 'preview-strip' }, p.previews.map(function (src, i) {
      return el('img', { src: src, alt: p.title + ' preview ' + (i + 1), loading: 'lazy', width: 280, height: 210 });
    })));
  }

  DW.clear(root).appendChild(el('div', { class: 'prod-detail' }, [media, buyBox]));

  // ── Details ──
  var lic = p.license || {};
  var details = DW.$('#product-details-inner');
  var mainCol = el('div', { class: 'stack-lg' }, [
    section('About this product', el('p', { text: p.description })),
    p.benefits && p.benefits.length ? section('Benefits', list(p.benefits)) : null,
    p.includes && p.includes.length ? section(p.status === 'draft' ? 'What’s included (planned)' : 'What’s included', list(p.includes)) : null,
    p.usage && p.usage.length ? section('How to use', el('ol', {}, p.usage.map(function (t) { return el('li', { text: t }); }))) : null,
    p.faqs && p.faqs.length ? section('Questions', DW.faqList(p.faqs)) : null
  ]);
  var sideCol = el('div', { class: 'stack-lg' }, [
    el('div', { class: 'panel stack' }, [
      el('h2', { class: 'h3', text: 'License: ' + (lic.type || '—') }),
      el('p', { class: 'card-text', text: lic.summary || '' }),
      lic.allowed && lic.allowed.length ? list(lic.allowed) : null,
      lic.notAllowed && lic.notAllowed.length ? list(lic.notAllowed, 'x-list') : null,
      el('a', { class: 'card-link', href: 'license.html' }, ['Full license terms ', DW.icon('arrow')])
    ]),
    el('div', { class: 'panel stack' }, [
      el('h2', { class: 'h3', text: 'File formats & compatibility' }),
      list((p.formats || []).concat(p.compatibility || []))
    ])
  ]);
  details.appendChild(mainCol);
  details.appendChild(sideCol);
  DW.$('#product-details').hidden = false;
  if (p.faqs && p.faqs.length && p.status === 'published') DW.faqJsonLd(p.faqs);

  // ── Related ──
  var related = (p.related || []).map(DW.productById).filter(function (r) { return r && DW.isListed(r); });
  if (related.length < 3) {
    DW.products().forEach(function (r) {
      if (related.length < 3 && r.id !== p.id && r.category === p.category && DW.isListed(r) && related.indexOf(r) === -1) related.push(r);
    });
  }
  if (related.length) {
    var rg = DW.$('#related-grid');
    related.slice(0, 4).forEach(function (r) { rg.appendChild(DW.productCard(r)); });
    DW.$('#related').hidden = false;
  }

  // ── Structured data: only for purchasable downloadable products ──
  if (buyable && p.kind === 'download' && typeof p.price === 'number') {
    var ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product',
      name: p.title, description: p.description, category: cat.title, sku: p.id,
      image: (p.images || []).map(function (i) { return CFG.siteUrl + '/' + i; }),
      brand: { '@type': 'Brand', name: 'DarskeeWorks' },
      offers: { '@type': 'Offer', price: String(p.price), priceCurrency: p.currency, availability: 'https://schema.org/InStock', url: pageUrl }
    });
    document.head.appendChild(ld);
  }

  DW.track('view_item', { currency: p.currency, value: p.price || 0, items: [{ item_id: p.id, item_name: p.title, item_category: cat.title }] });
})();
