/*
 * Project inquiry form.
 * Delivery: Web3Forms or Formspree (configured in js/config.js). When neither is configured,
 * the form validates and then offers a pre-filled email — it never pretends the message was sent.
 * Spam protection: honeypot field + minimum time-on-page.
 */
(function () {
  'use strict';
  var el = DW.el;
  var CFG = window.DW_CONFIG;
  var S = window.DW_SERVICES;
  var form = DW.$('#inquiry-form');
  var statusNode = DW.$('#form-status');
  var loadedAt = Date.now();
  var MIN_FILL_MS = 3000;

  // ── Options ──
  function option(value, label, selected) {
    return el('option', { value: value, text: label || value, selected: selected });
  }
  var qService = DW.param('service') || '';
  var qPackage = DW.param('package') || '';
  var qProduct = DW.param('product') || '';

  var serviceSel = DW.$('#f-service');
  serviceSel.appendChild(option('', 'Select a service'));
  S.categories.forEach(function (c) { serviceSel.appendChild(option(c.id, c.title, c.id === qService)); });
  [
    ['website-maintenance', 'Website maintenance / support'],
    ['custom-template', 'Custom template or digital product'],
    ['product-inquiry', 'Question about a shop product'],
    ['other', 'Something else']
  ].forEach(function (o) { serviceSel.appendChild(option(o[0], o[1], o[0] === qService)); });

  var pkgSel = DW.$('#f-package');
  pkgSel.appendChild(option('', 'Not sure yet'));
  S.packages.forEach(function (p) {
    pkgSel.appendChild(option(p.id, p.name + (p.price ? ' — ' + DW.formatMoney(p.price, S.currency) : ' — custom quotation'), p.id === qPackage));
  });
  function syncPackageField() { DW.$('#package-field').hidden = serviceSel.value !== 'website-development'; }
  serviceSel.addEventListener('change', syncPackageField);
  syncPackageField();

  var budgets = [[0, 5000], [5000, 10000], [10000, 25000], [25000, 50000], [50000, 0]];
  var budgetSel = DW.$('#f-budget');
  budgetSel.appendChild(option('', 'Select a range'));
  budgets.forEach(function (b) {
    var php = b[1] === 0 ? DW.formatMoney(b[0], 'PHP') + '+' : b[0] === 0 ? 'Under ' + DW.formatMoney(b[1], 'PHP') : DW.formatMoney(b[0], 'PHP') + '–' + DW.formatMoney(b[1], 'PHP');
    var rate = CFG.currency.usdToPhp;
    var usd = b[1] === 0 ? '$' + Math.round(b[0] / rate) + '+' : b[0] === 0 ? 'under $' + Math.round(b[1] / rate) : '$' + Math.round(b[0] / rate) + '–$' + Math.round(b[1] / rate);
    budgetSel.appendChild(option(php, php + ' (≈ ' + usd + ')'));
  });
  budgetSel.appendChild(option('Not sure yet'));

  var product = qProduct ? DW.productById(qProduct) : null;
  if (product) {
    DW.$('#f-message').value = 'Hi, I would like to know more about "' + product.title + '".\n\n';
  }

  // ── Delivery configuration ──
  var provider = (CFG.forms && CFG.forms.provider) || '';
  var configured =
    (provider === 'web3forms' && /^[0-9a-f-]{20,}$/i.test(CFG.forms.web3formsAccessKey || '')) ||
    (provider === 'formspree' && /^[a-z0-9]{6,}$/i.test(CFG.forms.formspreeFormId || ''));
  DW.$('#delivery-note').textContent = configured
    ? 'Your inquiry is sent securely to DarskeeWorks. We reply within ' + CFG.business.responseTime + '.'
    : 'Online form delivery is not set up yet. After you press the button, you can send your inquiry by email instead.';

  // ── Validation ──
  var rules = [
    { id: 'f-name', label: 'Name', test: function (v) { return v.trim().length >= 2; }, msg: 'Enter your name.' },
    { id: 'f-email', label: 'Email', test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }, msg: 'Enter a valid email address, like name@example.com.' },
    { id: 'f-country', label: 'Country', test: Boolean, msg: 'Select your country.' },
    { id: 'f-business', label: 'Business type', test: Boolean, msg: 'Select your business type.' },
    { id: 'f-service', label: 'Service required', test: Boolean, msg: 'Select the service you need.' },
    { id: 'f-budget', label: 'Budget range', test: Boolean, msg: 'Select a budget range.' },
    { id: 'f-timeline', label: 'Preferred timeline', test: Boolean, msg: 'Select a timeline.' },
    { id: 'f-message', label: 'Project description', test: function (v) { return v.trim().length >= 20; }, msg: 'Describe your project in at least 20 characters.' },
    { id: 'f-consent', label: 'Consent', test: function (v, n) { return n.checked; }, msg: 'Please agree so we can reply to you.' }
  ];

  function setError(rule, message) {
    var input = document.getElementById(rule.id);
    var err = document.getElementById(rule.id + '-err');
    if (message) { input.setAttribute('aria-invalid', 'true'); err.textContent = message; }
    else { input.removeAttribute('aria-invalid'); err.textContent = ''; }
  }

  function validate() {
    var failed = [];
    rules.forEach(function (r) {
      var n = document.getElementById(r.id);
      var ok = r.test(n.value, n);
      setError(r, ok ? '' : r.msg);
      if (!ok) failed.push(r);
    });
    return failed;
  }

  rules.forEach(function (r) {
    var n = document.getElementById(r.id);
    n.addEventListener(n.tagName === 'SELECT' || n.type === 'checkbox' ? 'change' : 'blur', function () {
      if (n.getAttribute('aria-invalid') === 'true' || n.value) {
        var ok = r.test(n.value, n);
        setError(r, ok ? '' : r.msg);
      }
    });
  });

  function showErrors(failed) {
    var summary = DW.$('#error-summary');
    var listNode = DW.clear(DW.$('#error-list'));
    failed.forEach(function (r) {
      listNode.appendChild(el('li', {}, [el('a', { href: '#' + r.id, text: r.msg })]));
    });
    summary.hidden = false;
    summary.focus();
  }

  function data() {
    var get = function (id) { return document.getElementById(id).value.trim(); };
    var svc = serviceSel.options[serviceSel.selectedIndex].text;
    var pkg = !DW.$('#package-field').hidden && pkgSel.value ? pkgSel.options[pkgSel.selectedIndex].text : '';
    return {
      name: get('f-name'), email: get('f-email'), country: get('f-country'),
      business_type: get('f-business'), service: svc, package: pkg,
      budget: get('f-budget'), timeline: get('f-timeline'), message: get('f-message'),
      product: product ? product.title : ''
    };
  }

  function summaryText(d) {
    return [
      'Name: ' + d.name, 'Email: ' + d.email, 'Country: ' + d.country,
      'Business type: ' + d.business_type, 'Service: ' + d.service,
      d.package ? 'Package: ' + d.package : null, d.product ? 'Product: ' + d.product : null,
      'Budget: ' + d.budget, 'Timeline: ' + d.timeline, '', d.message
    ].filter(function (l) { return l !== null; }).join('\n');
  }

  function send(d) {
    var subject = 'Project inquiry: ' + d.service + ' — ' + d.name;
    if (provider === 'web3forms') {
      return fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.assign({ access_key: CFG.forms.web3formsAccessKey, subject: subject, from_name: 'DarskeeWorks website', botcheck: '' }, d))
      }).then(function (r) { return r.json(); }).then(function (j) { if (!j.success) throw new Error(j.message || 'Submission failed'); });
    }
    return fetch('https://formspree.io/f/' + encodeURIComponent(CFG.forms.formspreeFormId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.assign({ _subject: subject, _replyto: d.email }, d))
    }).then(function (r) { if (!r.ok) throw new Error('Submission failed (' + r.status + ')'); });
  }

  function mailtoHref(d) {
    return 'mailto:' + CFG.business.email +
      '?subject=' + encodeURIComponent('Project inquiry: ' + d.service + ' — ' + d.name) +
      '&body=' + encodeURIComponent(summaryText(d));
  }

  function showStatus(kind, title, children) {
    DW.clear(statusNode).appendChild(el('div', { class: 'notice notice-' + kind, role: kind === 'error' ? 'alert' : 'status' }, [
      el('div', {}, [el('strong', { text: title })].concat(children))
    ]));
    statusNode.focus();
    statusNode.scrollIntoView({ block: 'start' });
  }

  function showFallback(d, reason) {
    var copyBtn = el('button', { type: 'button', class: 'btn btn-secondary btn-sm', text: 'Copy message' });
    copyBtn.addEventListener('click', function () {
      if (navigator.clipboard) navigator.clipboard.writeText(summaryText(d)).then(function () { copyBtn.textContent = 'Copied'; });
    });
    showStatus('warn', reason, [
      el('p', { text: 'Your inquiry has NOT been sent yet. Please send it by email using one of the options below.' }),
      el('div', { class: 'btn-row mt-3' }, [
        el('a', { class: 'btn btn-primary btn-sm', href: mailtoHref(d), 'data-track': 'contact_mailto', text: 'Open in my email app' }),
        copyBtn
      ]),
      el('p', { class: 'small mt-3' }, ['Or email ', el('a', { href: 'mailto:' + CFG.business.email, text: CFG.business.email }), ' / message us on ', el('a', { href: CFG.business.line, text: 'LINE' }), '.'])
    ]);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    DW.$('#error-summary').hidden = true;

    var failed = validate();
    if (failed.length) { showErrors(failed); return; }

    // Spam checks: silently "succeed" for bots so they don't retry
    var honeypot = DW.$('#f-website').value;
    if (honeypot || Date.now() - loadedAt < MIN_FILL_MS) {
      form.hidden = true;
      showStatus('success', 'Thank you.', [el('p', { text: 'Your message has been received.' })]);
      return;
    }

    var d = data();
    if (!configured) { showFallback(d, 'Almost done — one more step'); return; }

    var btn = DW.$('#submit-btn');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    send(d).then(function () {
      form.hidden = true;
      DW.track('generate_lead', { service: d.service, budget: d.budget, country: d.country });
      showStatus('success', 'Thank you, ' + d.name + '! Your inquiry was sent.', [
        el('p', { text: 'We will reply to ' + d.email + ' within ' + CFG.business.responseTime + '. Please check your spam folder if you don’t see our reply.' }),
        el('div', { class: 'btn-row mt-3' }, [
          el('a', { class: 'btn btn-secondary btn-sm', href: 'portfolio.html', text: 'View portfolio' }),
          el('a', { class: 'btn btn-secondary btn-sm', href: 'shop.html', text: 'Browse the shop' })
        ])
      ]);
    }).catch(function () {
      btn.disabled = false;
      btn.textContent = 'Send inquiry';
      showFallback(d, 'We couldn’t send your inquiry');
    });
  });
})();
