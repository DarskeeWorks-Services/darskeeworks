/* Case study template: case-study.html?p=<slug>. Problem → Solution → Implementation → Screenshots → Results */
(function () {
  'use strict';
  var el = DW.el;
  var CFG = window.DW_CONFIG;
  var slug = DW.param('p') || '';
  var body = DW.$('#cs-body');

  function step(title, content) {
    return el('section', { class: 'cs-step' }, [el('h2', { text: title }), el('div', { class: 'stack' }, content)]);
  }
  function list(items) {
    return el('ul', { class: 'check-list' }, items.map(function (t) { return el('li', { text: t }); }));
  }

  DW.loadWorks().then(function (projects) {
    var p = projects.filter(function (x) { return DW.projectSlug(x) === slug; })[0];
    if (!p) {
      var robots = document.createElement('meta');
      robots.name = 'robots'; robots.content = 'noindex';
      document.head.appendChild(robots);
      DW.$('#cs-title').textContent = 'Case study not found';
      DW.$('#cs-desc').textContent = 'This project may have been renamed.';
      DW.$('#cs-actions').appendChild(el('a', { class: 'btn btn-primary', href: 'portfolio.html', text: 'View all projects' }));
      return;
    }

    var cs = DW.caseStudy(p);
    var catLabel = DW.PROJECT_CATEGORIES[DW.projectCategory(p)];
    var url = CFG.siteUrl + '/case-study.html?p=' + encodeURIComponent(slug);

    document.title = p.name + ' — Case Study | DarskeeWorks';
    var desc = document.querySelector('meta[name="description"]');
    desc.setAttribute('content', (cs.problem ? cs.problem + ' ' : '') + (p.description || ''));
    document.querySelector('link[rel="canonical"]').setAttribute('href', url);
    document.querySelector('meta[property="og:title"]').setAttribute('content', p.name + ' — DarskeeWorks case study');

    DW.$('#cs-crumbs').appendChild(el('li', { 'aria-current': 'page', text: p.name }));
    DW.$('#cs-eyebrow').textContent = catLabel + ' · ' + (p.platform || '');
    DW.$('#cs-title').textContent = p.name;
    DW.$('#cs-desc').textContent = p.description || '';

    var actions = DW.$('#cs-actions');
    if (DW.safeUrl(p.link)) actions.appendChild(el('a', { class: 'btn btn-primary', href: p.link, text: DW.liveLabel(p) === 'Visit site' ? 'Visit live project' : 'View on ' + DW.liveLabel(p) }));
    actions.appendChild(el('a', { class: 'btn btn-ghost-light', href: DW.privacyUrl(p), text: 'Privacy policy' }));

    if (p.image) {
      var frame = el('div', { class: 'cs-hero-img' }, [DW.picture(p.image, p.name + ' — ' + (p.platform || ''), { eager: true, width: 960, height: 600, sizes: '(max-width: 900px) 100vw, 560px' })]);
      DW.$('#cs-image').appendChild(frame);
      var img = frame.querySelector('img');
      img.addEventListener('load', function () {
        var r = img.naturalWidth / img.naturalHeight;
        if (r > 0.85 && r < 1.18) frame.classList.add('is-icon');
      });
    }

    var none = el('p', { class: 'muted', text: 'Details for this section have not been published yet.' });
    body.appendChild(step('Problem', [cs.problem ? el('p', { text: cs.problem }) : none.cloneNode(true)]));
    body.appendChild(step('Solution', [el('p', { text: cs.solution || p.description || '' })]));
    body.appendChild(step('Implementation', [
      cs.implementation && cs.implementation.length ? list(cs.implementation) : none.cloneNode(true),
      cs.tech && cs.tech.length ? el('div', { class: 'prod-badges' }, cs.tech.map(function (t) { return el('span', { class: 'badge badge-outline', text: t }); })) : null
    ]));

    var shots = (cs.screenshots || []).filter(DW.safeUrl);
    if (!shots.length && p.image) shots = [p.image];
    body.appendChild(step('Screenshots', [
      shots.length ? el('div', { class: 'preview-strip' }, shots.map(function (s, i) {
        return el('img', { src: s, alt: p.name + ' screenshot ' + (i + 1), loading: 'lazy', width: 280, height: 210 });
      })) : none.cloneNode(true)
    ]));
    body.appendChild(step('Results', [
      cs.results && cs.results.length ? list(cs.results) : el('p', { class: 'muted', text: 'Results not yet published.' })
    ]));
  }).catch(function () {
    DW.$('#cs-title').textContent = 'Could not load this case study';
  });
})();
