/* Services page: one detailed block per service category */
(function () {
  'use strict';
  var el = DW.el;
  var S = window.DW_SERVICES;
  var CS = window.DW_CASE_STUDIES || {};

  function list(items, cls) {
    return el('ul', { class: cls || 'check-list' }, items.map(function (t) { return el('li', { text: t }); }));
  }
  function col(title, node) { return el('div', {}, [el('h4', { text: title }), node]); }

  function block(c) {
    var price = c.price ? (c.pricePrefix || 'From') + ' ' + DW.formatMoney(c.price, S.currency) + ' (' + DW.approxMoney(c.price, S.currency) + ')' : 'Custom quotation';
    var examples = el('div', { class: 'mini-projects' }, c.portfolio.map(function (name) {
      var slug = (CS[name] && CS[name].slug) || DW.slugify(name);
      return el('a', { href: 'case-study.html?p=' + encodeURIComponent(slug) }, [name.split(' - ')[0].split(' – ')[0]]);
    }));
    return el('article', { class: 'svc-block', id: c.id }, [
      el('div', { class: 'svc-block-head' }, [
        el('div', {}, [
          el('span', { class: 'icon-tile' }, [DW.icon(c.icon)]),
          el('div', {}, [el('h2', { text: c.title }), el('p', { text: c.description })])
        ]),
        el('a', {
          class: 'btn btn-primary', href: 'contact.html?service=' + encodeURIComponent(c.id),
          'data-track': 'cta_quote', 'data-track-label': 'service-' + c.id, text: 'Request a Quote'
        })
      ]),
      el('div', { class: 'svc-facts' }, [
        el('span', {}, [el('strong', { text: 'Starting price: ' }), price]),
        el('span', {}, [el('strong', { text: 'Timeline: ' }), c.timeline])
      ]),
      el('div', { class: 'svc-cols mt-5' }, [
        el('div', { class: 'panel' }, [col('Common problems', list(c.problems, 'x-list'))]),
        el('div', { class: 'panel' }, [col('How we solve them', list(c.solutions))]),
        el('div', {}, [col('Features', list(c.features))]),
        el('div', {}, [col('Deliverables', list(c.deliverables))])
      ]),
      el('div', { class: 'mt-5' }, [col('Related projects', examples)]),
      c.faqs && c.faqs.length ? el('div', { class: 'mt-5' }, [col('Questions', DW.faqList(c.faqs))]) : null
    ]);
  }

  var nav = DW.$('#svc-subnav');
  var listNode = DW.clear(DW.$('#svc-list'));
  var allFaqs = [];
  S.categories.forEach(function (c) {
    nav.appendChild(el('li', {}, [el('a', { href: '#' + c.id, text: c.title })]));
    listNode.appendChild(block(c));
    allFaqs = allFaqs.concat(c.faqs || []);
  });
  DW.faqJsonLd(allFaqs);

  // Re-apply hash scroll now that the blocks exist
  if (location.hash) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
  }
})();
