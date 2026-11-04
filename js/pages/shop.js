/* Shop: search, category filter, sorting. State is mirrored in the URL (?category=&q=&sort=). */
(function () {
  'use strict';
  var el = DW.el;
  var RATE = window.DW_CONFIG.currency.usdToPhp;

  var state = {
    category: DW.param('category') || 'all',
    q: DW.param('q') || '',
    sort: DW.param('sort') || 'featured'
  };

  var grid = DW.$('#shop-grid');
  var count = DW.$('#shop-count');
  var empty = DW.$('#shop-empty');
  var search = DW.$('#shop-search');
  var sort = DW.$('#shop-sort');
  var chipsNode = DW.$('#shop-categories');

  var listed = DW.products().filter(DW.isListed);

  // Only show categories that have listed products
  var cats = [{ id: 'all', title: 'All' }].concat(DW.categories().filter(function (c) {
    return listed.some(function (p) { return p.category === c.id; });
  }));
  if (!cats.some(function (c) { return c.id === state.category; })) state.category = 'all';

  cats.forEach(function (c) {
    chipsNode.appendChild(el('button', {
      type: 'button', class: 'chip', 'data-cat': c.id,
      'aria-pressed': String(c.id === state.category), text: c.title,
      onclick: function () { state.category = c.id; render(); }
    }));
  });

  search.value = state.q;
  sort.value = state.sort;
  search.addEventListener('input', function () { state.q = search.value; render(); });
  sort.addEventListener('change', function () { state.sort = sort.value; render(); });
  DW.$('#shop-reset').addEventListener('click', function () {
    state = { category: 'all', q: '', sort: 'featured' };
    search.value = ''; sort.value = 'featured'; render();
  });

  /** Comparable price in USD; unknown prices sort last. */
  function usd(p) {
    if (typeof p.price !== 'number') return Infinity;
    return p.currency === 'PHP' ? p.price / RATE : p.price;
  }
  function rank(p) {
    // featured first, then published, then the rest
    return (p.featured ? 0 : 2) + (p.status === 'published' ? 0 : 1);
  }

  function matches(p, q) {
    if (!q) return true;
    var hay = [p.title, p.short, p.description, DW.categoryById(p.category).title].concat(p.badges || []).join(' ').toLowerCase();
    return q.toLowerCase().split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function syncUrl() {
    var params = new URLSearchParams();
    if (state.category !== 'all') params.set('category', state.category);
    if (state.q) params.set('q', state.q);
    if (state.sort !== 'featured') params.set('sort', state.sort);
    var qs = params.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  function render() {
    DW.$$('.chip', chipsNode).forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-cat') === state.category));
    });
    var items = listed.filter(function (p) {
      return (state.category === 'all' || p.category === state.category) && matches(p, state.q.trim());
    });
    items.sort(function (a, b) {
      if (state.sort === 'price-asc') return usd(a) - usd(b);
      if (state.sort === 'price-desc') {
        var ua = usd(a) === Infinity ? -1 : usd(a), ub = usd(b) === Infinity ? -1 : usd(b);
        return ub - ua;
      }
      if (state.sort === 'name') return a.title.localeCompare(b.title);
      return rank(a) - rank(b);
    });
    DW.clear(grid);
    items.forEach(function (p) { grid.appendChild(DW.productCard(p)); });
    var drafts = items.filter(function (p) { return p.status === 'draft'; }).length;
    count.textContent = items.length + ' product' + (items.length === 1 ? '' : 's') + (drafts ? ' · ' + drafts + ' coming soon' : '');
    empty.hidden = items.length > 0;
    syncUrl();
  }

  render();
})();
