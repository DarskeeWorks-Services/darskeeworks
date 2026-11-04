/*
 * Privacy: lists every works.json project with a link to its official policy.
 * Each entry keeps the legacy anchor id (slugified project name) so old links
 * like privacy.html#moofy-your-budget-buddy still land on the right app.
 */
(function () {
  'use strict';
  var el = DW.el;
  var root = DW.$('#app-policies');

  DW.loadWorks().then(function (projects) {
    DW.clear(root);
    projects.forEach(function (p) {
      var policy = DW.safeUrl(p.privacy);
      root.appendChild(el('div', { class: 'panel', id: DW.slugify(p.name) }, [
        el('span', { class: 'badge badge-outline', text: p.platform || '' }),
        el('h3', { class: 'mt-3', text: p.name }),
        el('p', { class: 'small muted', text: p.description || '' }),
        el('p', { class: 'mt-3' }, policy
          ? [el('a', { class: 'btn btn-secondary btn-sm', href: policy, text: 'Read the ' + p.name.split(' - ')[0].split(' – ')[0] + ' privacy policy' })]
          : ['Contact us for this app’s privacy details.'])
      ]));
    });
    if (location.hash) {
      var target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView({ block: 'start' });
    }
  }).catch(function () {
    DW.clear(root).appendChild(el('p', { class: 'muted', text: 'App list could not be loaded. Please refresh the page.' }));
  });
})();
