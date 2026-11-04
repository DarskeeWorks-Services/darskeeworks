/* Pricing page: package cards, comparison table, notes and payment terms */
(function () {
  'use strict';
  var el = DW.el;
  var S = window.DW_SERVICES;

  function amount(p) {
    return p.price ? DW.formatMoney(p.price, S.currency) : 'Custom';
  }

  var cards = DW.$('#price-cards');
  S.packages.forEach(function (p) {
    cards.appendChild(el('article', { class: 'price-card' + (p.recommended ? ' is-recommended' : ''), id: 'package-' + p.id }, [
      p.recommended ? el('span', { class: 'badge rec-badge', text: 'Recommended' }) : null,
      el('h3', { text: p.name }),
      el('div', { class: 'price-amount' }, [
        amount(p),
        el('small', { text: p.price ? DW.approxMoney(p.price, S.currency) + ' · one-time' : 'Quotation-based' })
      ]),
      el('p', { class: 'price-for', text: p.bestFor }),
      el('ul', { class: 'price-specs' }, [
        ['Pages', p.pages], ['Revisions', p.revisions], ['Delivery', p.delivery], ['Support', p.support]
      ].map(function (r) { return el('li', {}, [el('span', { text: r[0] }), el('span', { text: r[1] })]); })),
      el('ul', { class: 'check-list' }, p.features.map(function (f) { return el('li', { text: f }); })),
      el('a', {
        class: 'btn ' + (p.recommended ? 'btn-primary' : 'btn-secondary'),
        href: 'contact.html?service=website-development&package=' + encodeURIComponent(p.id),
        'data-track': 'cta_quote', 'data-track-label': 'pricing-' + p.id,
        text: p.price ? 'Choose ' + p.name : 'Request a quotation'
      })
    ]));
  });

  DW.$('#rate-note').textContent = 'USD figures are approximate (1 USD ≈ ' + window.DW_CONFIG.currency.usdToPhp + ' PHP). ' + window.DW_CONFIG.currency.rateNote;

  // Comparison table
  var table = DW.$('#compare-table');
  var head = el('thead', {}, [el('tr', {}, [el('th', { scope: 'col', text: 'Package' })].concat(
    S.packages.map(function (p) { return el('th', { scope: 'col', text: p.name }); })
  ))]);
  var rows = [
    ['Price', function (p) { return amount(p); }],
    ['Pages', function (p) { return p.pages; }],
    ['Revisions', function (p) { return p.revisions; }],
    ['Delivery', function (p) { return p.delivery; }],
    ['Post-launch support', function (p) { return p.support; }],
    ['Best for', function (p) { return p.bestFor; }]
  ];
  var body = el('tbody', {}, rows.map(function (r) {
    return el('tr', {}, [el('th', { scope: 'row', text: r[0] })].concat(
      S.packages.map(function (p) { return el('td', { text: r[1](p) }); })
    ));
  }));
  table.appendChild(head);
  table.appendChild(body);

  // Notes and terms
  var notes = DW.$('#package-notes');
  S.packageNotes.forEach(function (n) {
    notes.appendChild(el('div', {}, [el('h3', { class: 'card-title', text: n.title }), el('p', { class: 'card-text', text: n.text })]));
  });
  var terms = DW.$('#payment-terms');
  S.paymentTerms.forEach(function (t) { terms.appendChild(el('li', { text: t })); });
})();
