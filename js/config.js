/*
 * DarskeeWorks site configuration.
 *
 * Everything in this file is PUBLIC (it ships to every visitor's browser).
 * Never put passwords, secret API keys, or payment credentials here.
 *
 * Values that are safe to be public by design:
 *   - Web3Forms access key / Formspree form ID (they only allow submitting a form)
 *   - Google Analytics 4 measurement ID
 *   - Hosted checkout URLs (Payhip / Gumroad product links)
 */
window.DW_CONFIG = {
  siteUrl: 'https://darskeeworks.online',

  business: {
    name: 'DarskeeWorks',
    tagline: 'Build smarter. Work better. Grow digitally.',
    email: 'darilquervo.dev@gmail.com',
    line: 'https://line.me/ti/p/YMigpeLlZr',
    github: 'https://github.com/darilquervodev-spec',
    location: 'Fukuoka, Japan',
    responseTime: '1–2 business days'
  },

  /*
   * Project inquiry form delivery.
   *   provider: 'web3forms' | 'formspree' | '' (not configured)
   *   web3forms: get a free access key at https://web3forms.com (sent to your email)
   *   formspree: create a form at https://formspree.io and paste the form ID (e.g. 'xayzabcd')
   * While provider is '', the form validates input and then offers a pre-filled
   * email instead — it never claims a message was sent.
   */
  forms: {
    provider: '',
    web3formsAccessKey: '',
    formspreeFormId: ''
  },

  /*
   * Google Analytics 4. Leave empty to load no analytics at all.
   * Format: 'G-XXXXXXXXXX'
   */
  ga4MeasurementId: '',

  /*
   * Currency display. Prices are charged in each item's own currency;
   * the converted figure is shown as an approximation only.
   * Update the rate periodically.
   */
  currency: {
    usdToPhp: 58,
    rateNote: 'Approximate conversion for reference only. You are charged in the currency shown at checkout.'
  },

  /* Shop behaviour */
  shop: {
    showDraftsAsComingSoon: true,
    refundWindowDays: 14
  },

  /* Portfolio: works.json project names to feature on the homepage, in order. */
  featuredProjects: [
    'DarskeeAI.com - AI Video Creation Studio',
    'Darskee JLPT AI - Japanese Study Platform',
    'GuroAssist PH - Your Virtual Assistant',
    'Mochi Sensei – JLPT Study Master',
    'Darskee-Sales & Inventory App',
    'Moofy - Your Budget Buddy'
  ]
};
