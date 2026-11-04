/* About: verified project counts and project table from works.json */
(function () {
  'use strict';
  var el = DW.el;
  DW.loadWorks().then(function (projects) {
    var s = DW.projectStats(projects);
    DW.$('#fact-apps').textContent = s.android + ' Android · ' + s.ios + ' iOS';
    DW.$('#fact-web').textContent = String(s.web);
    var tbody = DW.$('#about-projects');
    projects.forEach(function (p) {
      tbody.appendChild(el('tr', {}, [
        el('th', { scope: 'row' }, [el('a', { href: DW.caseStudyUrl(p), text: p.name })]),
        el('td', { text: p.platform || '' }),
        el('td', { text: p.description || '' })
      ]));
    });
  });
})();
