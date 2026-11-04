/* Portfolio: all works.json projects with category filter */
(function () {
  'use strict';
  var el = DW.el;
  var grid = DW.$('#portfolio-grid');
  var filters = DW.$('#portfolio-filters');
  var count = DW.$('#portfolio-count');
  var current = DW.param('category') || 'all';

  DW.loadWorks().then(function (projects) {
    var s = DW.projectStats(projects);
    DW.$('#portfolio-summary').textContent =
      s.android + ' Android and ' + s.ios + ' iOS apps published, ' + s.web + ' live websites and web apps, and ' +
      s.desktop + ' desktop software product' + (s.desktop === 1 ? '' : 's') + '.';

    var cats = [{ id: 'all', title: 'All projects' }].concat(Object.keys(DW.PROJECT_CATEGORIES).filter(function (k) {
      return projects.some(function (p) { return DW.projectCategory(p) === k; });
    }).map(function (k) { return { id: k, title: DW.PROJECT_CATEGORIES_PLURAL[k] }; }));

    cats.forEach(function (c) {
      filters.appendChild(el('button', {
        type: 'button', class: 'chip', 'data-cat': c.id, 'aria-pressed': String(c.id === current), text: c.title,
        onclick: function () { current = c.id; render(); }
      }));
    });

    var cards = projects.map(function (p) { return { p: p, node: DW.projectCard(p) }; });
    cards.forEach(function (c) { grid.appendChild(c.node); });

    function render() {
      var shown = 0;
      cards.forEach(function (c) {
        var on = current === 'all' || DW.projectCategory(c.p) === current;
        c.node.hidden = !on;
        if (on) shown++;
      });
      DW.$$('.chip', filters).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-cat') === current)); });
      count.textContent = shown + ' project' + (shown === 1 ? '' : 's');
    }
    render();
  }).catch(function () {
    grid.appendChild(el('p', { class: 'muted', text: 'Projects could not be loaded. Please refresh the page.' }));
  });
})();
