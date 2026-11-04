/* Support: maintenance plans + per-app support links from works.json */
(function () {
  'use strict';
  var el = DW.el;
  var S = window.DW_SERVICES;

  var cards = DW.$('#plan-cards');
  S.maintenancePlans.forEach(function (p) {
    cards.appendChild(el('article', { class: 'price-card' + (p.recommended ? ' is-recommended' : '') }, [
      p.recommended ? el('span', { class: 'badge rec-badge', text: 'Recommended' }) : null,
      el('h3', { text: p.name }),
      el('div', { class: 'price-amount' }, [DW.formatMoney(p.price, S.currency), el('small', { text: 'per month · ' + DW.approxMoney(p.price, S.currency) })]),
      el('p', { class: 'price-for', text: p.hours }),
      el('ul', { class: 'check-list' }, p.features.concat([p.response]).map(function (f) { return el('li', { text: f }); })),
      el('a', {
        class: 'btn ' + (p.recommended ? 'btn-primary' : 'btn-secondary'),
        href: 'contact.html?service=website-maintenance', 'data-track': 'cta_quote', 'data-track-label': 'plan-' + p.id,
        text: 'Choose ' + p.name
      })
    ]));
  });

  var limits = DW.$('#plan-limits');
  S.maintenanceLimits.forEach(function (t) { limits.appendChild(el('li', { text: t })); });

  var rows = DW.$('#app-support-rows');
  DW.loadWorks().then(function (projects) {
    projects.forEach(function (p) {
      rows.appendChild(el('tr', {}, [
        el('th', { scope: 'row', text: p.name }),
        el('td', { text: p.platform || '' }),
        el('td', {}, [el('a', { href: DW.supportUrl(p), text: /^mailto:/i.test(DW.supportUrl(p)) ? 'Email support' : 'Support page' })]),
        el('td', {}, [el('a', { href: DW.privacyUrl(p), text: 'Privacy policy' })])
      ]));
    });
  });
})();
