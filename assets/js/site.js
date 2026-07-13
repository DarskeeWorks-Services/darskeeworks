// Shared helpers used by index.html and privacy.html.
window.DW = (function () {
  function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function autoPrivacy(p) {
    if (p.privacy) return p.privacy;
    return 'privacy.html#' + slugify(p.name);
  }

  function autoSupport(p) {
    if (p.support) return p.support;
    return 'mailto:darilquervo.dev@gmail.com?subject=' + encodeURIComponent('Support: ' + p.name);
  }

  // Single source of truth for the platform -> filter-bucket mapping,
  // shared conceptually with scripts/build-apps.js (kept in sync by hand
  // since the build script runs standalone under plain Node).
  function platformToCategory(platform) {
    platform = platform || '';
    if (platform.indexOf('Android') !== -1) return 'android';
    if (platform.indexOf('iOS') !== -1) return 'ios';
    if (platform.indexOf('Website') !== -1) return 'web';
    if (platform.indexOf('Desktop') !== -1) return 'desktop';
    return 'other';
  }

  function loadWorks() {
    return fetch('works.json').then(function (r) { return r.json(); });
  }

  // Expects elements to already carry class="reveal" in the markup (so
  // they're invisible from first paint, no flash-then-hide). This just
  // observes and adds "in-view" once each one scrolls into frame.
  function initScrollReveal(selector) {
    var els = document.querySelectorAll(selector);
    if (!els.length) return;

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    els.forEach(function (el) { observer.observe(el); });
  }

  function initCounters(root) {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var counters = (root || document).querySelectorAll('[data-counter]');
    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-counter'), 10);
      if (isNaN(target)) return;
      if (reduceMotion) { el.textContent = String(target); return; }

      var start = 0;
      var duration = 900;
      var startTime = null;

      function step(ts) {
        if (startTime === null) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        el.textContent = String(Math.floor(start + (target - start) * progress));
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = String(target);
      }
      requestAnimationFrame(step);
    });
  }

  return {
    slugify: slugify,
    autoPrivacy: autoPrivacy,
    autoSupport: autoSupport,
    platformToCategory: platformToCategory,
    loadWorks: loadWorks,
    initScrollReveal: initScrollReveal,
    initCounters: initCounters
  };
})();
