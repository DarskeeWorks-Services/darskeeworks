/* Homepage: services, featured products, featured projects, pricing preview, FAQ */
(function () {
  'use strict';
  var el = DW.el;
  var S = window.DW_SERVICES;
  var CFG = window.DW_CONFIG;

  function serviceCard(c) {
    var price = c.price ? (c.pricePrefix || 'From') + ' ' + DW.formatMoney(c.price, S.currency) : 'Custom quotation';
    return el('article', { class: 'card svc-card' }, [
      el('div', { class: 'card-body' }, [
        el('span', { class: 'icon-tile' }, [DW.icon(c.icon)]),
        el('h3', { class: 'card-title' }, [el('a', { href: 'services.html#' + c.id, text: c.title })]),
        el('p', { class: 'card-text', text: c.summary }),
        el('div', { class: 'svc-price', text: price }),
        el('a', { class: 'card-link', href: 'services.html#' + c.id }, ['Learn more ', DW.icon('arrow')])
      ])
    ]);
  }

  function shopCard() {
    return el('article', { class: 'card svc-card card-dark' }, [
      el('div', { class: 'card-body' }, [
        el('span', { class: 'icon-tile' }, [DW.icon('store')]),
        el('h3', { class: 'card-title', text: 'Digital Marketplace' }),
        el('p', { class: 'card-text', text: 'Teacher planners, business templates, Canva and website templates, and software.' }),
        el('a', { class: 'btn btn-light btn-sm card-cta', href: 'shop.html', 'data-track': 'cta_shop', 'data-track-label': 'home-services', text: 'Shop now' })
      ])
    ]);
  }

  function priceCard(p) {
    var card = el('article', { class: 'price-card' + (p.recommended ? ' is-recommended' : '') }, [
      p.recommended ? el('span', { class: 'badge rec-badge', text: 'Recommended' }) : null,
      el('h3', { text: p.name }),
      el('div', { class: 'price-amount' }, [
        p.price ? DW.formatMoney(p.price, S.currency) : 'Custom',
        el('small', { text: p.price ? DW.approxMoney(p.price, S.currency) + ' · one-time' : 'Quotation-based' })
      ]),
      el('p', { class: 'price-for', text: p.bestFor }),
      el('ul', { class: 'check-list small' }, [p.pages, p.delivery, p.revisions].map(function (t) { return el('li', { text: t }); })),
      el('a', {
        class: 'btn ' + (p.recommended ? 'btn-primary' : 'btn-secondary'),
        href: 'contact.html?service=website-development&package=' + encodeURIComponent(p.id),
        'data-track': 'cta_quote', 'data-track-label': 'home-pricing-' + p.id,
        text: 'Get started'
      })
    ]);
    return card;
  }

  // Services
  var svc = DW.$('#home-services');
  DW.clear(svc);
  S.categories.forEach(function (c) { svc.appendChild(serviceCard(c)); });
  svc.appendChild(shopCard());

  // Pricing preview — first four packages
  var pricing = DW.$('#home-pricing');
  S.packages.slice(0, 4).forEach(function (p) { pricing.appendChild(priceCard(p)); });

  // Lowest package price in hero bullet
  var min = Math.min.apply(null, S.packages.filter(function (p) { return p.price; }).map(function (p) { return p.price; }));
  DW.$$('.hero-points li').forEach(function (li) {
    if (/Website packages from/.test(li.textContent)) {
      li.lastChild.textContent = ' Website packages from ' + DW.formatMoney(min, S.currency);
    }
  });

  // Featured products: published first, then drafts, max 4
  var featured = DW.products().filter(function (p) { return p.featured && DW.isListed(p); })
    .sort(function (a, b) { return (a.status === 'published' ? 0 : 1) - (b.status === 'published' ? 0 : 1); })
    .slice(0, 4);
  var prodGrid = DW.$('#home-products');
  featured.forEach(function (p) { prodGrid.appendChild(DW.productCard(p)); });

  // FAQ
  DW.$('#home-faq').appendChild(DW.faqList(S.faqs));
  DW.faqJsonLd(S.faqs);

  // Projects + verified stats
  var projGrid = DW.$('#home-projects');
  DW.loadWorks().then(function (projects) {
    var stats = DW.projectStats(projects);
    DW.$$('[data-stat]').forEach(function (n) {
      var v = stats[n.getAttribute('data-stat')];
      if (typeof v === 'number') n.textContent = String(v);
    });
    var order = CFG.featuredProjects || [];
    var picked = order.map(function (name) {
      return projects.filter(function (p) { return p.name === name; })[0];
    }).filter(Boolean);
    if (!picked.length) picked = projects.slice(0, 6);
    picked.slice(0, 6).forEach(function (p) { projGrid.appendChild(DW.projectCard(p)); });
  }).catch(function () {
    projGrid.appendChild(el('p', { class: 'muted' }, ['Projects could not be loaded. ', el('a', { href: 'portfolio.html', text: 'Open the portfolio' })]));
  });
})();
