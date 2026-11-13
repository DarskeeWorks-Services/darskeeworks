/*
 * Services, website packages and maintenance plans.
 *
 * All prices are PROPOSED and configurable. Change them here only —
 * every page (home, services, pricing, support, contact) reads from this file.
 * `price: null` means "quotation-based".
 * Portfolio examples reference project names exactly as they appear in works.json.
 */
window.DW_SERVICES = {
  currency: 'PHP',

  paymentTerms: [
    '50% down payment to start the project, 50% after your final approval and before launch.',
    'Accepted payment methods are confirmed in your written proposal.',
    'International clients can request a quotation in USD.',
    'Domain registration and any paid third-party services are billed at the provider’s price and are not included in package prices.'
  ],

  categories: [
    {
      id: 'website-development',
      title: 'Website Development',
      icon: 'web',
      summary: 'Fast, mobile-first websites for professionals, businesses, catalogs and schools.',
      description: 'Clean, responsive websites that load fast, explain what you offer, and make it easy for customers to contact you or order.',
      problems: [
        'Customers can’t find you online, or your current site looks outdated on phones.',
        'You rely on social media posts and lose inquiries in the comments.',
        'You don’t want to pay high monthly platform fees for a simple site.'
      ],
      solutions: [
        'A professional website with your services, prices and contact options on one clear path.',
        'Inquiry forms and chat links (Messenger, WhatsApp, LINE, email) that route straight to you.',
        'Static hosting where suitable, so there is no mandatory monthly platform fee.'
      ],
      features: ['Mobile-first responsive design', 'Basic on-page SEO', 'Contact and inquiry options', 'Fast loading and image optimization', 'Accessible, readable layouts'],
      deliverables: ['Live website on your domain', 'Source files', 'Short handover guide for simple text and image updates'],
      timeline: '5 days to 4 weeks, depending on package',
      price: 4999,
      pricePrefix: 'From',
      portfolio: ['DarskeeAI.com - AI Video Creation Studio', 'Carpentry Calculators', 'GuroAssist PH - Your Virtual Assistant', 'Daril Quervo Portfolio'],
      faqs: [
        { q: 'Do I need to buy hosting?', a: 'Most brochure and catalog sites can run on free static hosting such as GitHub Pages. If your site needs a server or database, hosting costs are explained before you commit.' },
        { q: 'Can I update the website myself?', a: 'Yes for simple text and images, using the handover guide. Larger changes can be covered by a maintenance plan or quoted separately.' },
        { q: 'Is the domain included?', a: 'No. The domain is registered in your name and paid directly to the registrar, so you always own it. Setup assistance is included.' }
      ]
    },
    {
      id: 'mobile-app-development',
      title: 'Mobile App Development',
      icon: 'mobile',
      summary: 'Android and iOS apps, from idea to published store listing.',
      description: 'Practical mobile apps built for real daily use, including store listing preparation for Google Play and the Apple App Store.',
      problems: [
        'Your process lives in notebooks or spreadsheets that are hard to use on the go.',
        'You have an app idea but don’t know how to get it published.',
        'Off-the-shelf apps don’t fit the way your business works.'
      ],
      solutions: [
        'A focused app that does the job you need, without unnecessary features.',
        'Offline-first, on-device storage where it suits your users’ privacy needs.',
        'Help with store listings, privacy policy pages and the submission process.'
      ],
      features: ['Android (Google Play) and iOS (App Store)', 'Offline and on-device data options', 'Clean, simple UI', 'In-app purchase setup where needed', 'Privacy policy and support pages'],
      deliverables: ['App build(s) submitted to the stores under your developer account', 'Source code', 'Store listing text and screenshots guidance', 'Privacy and support pages'],
      timeline: 'Typically 4–12 weeks, confirmed in your proposal',
      price: null,
      portfolio: ['Mochi Sensei – JLPT Study Master', 'Moofy - Your Budget Buddy', 'Budget Tracker by Darskee', 'Darskee Pass Jlpt N4', 'Solar PV Calc - Solar Designer'],
      faqs: [
        { q: 'Whose developer account is the app published under?', a: 'Yours, so you own the listing. Google Play and Apple charge their own developer account fees.' },
        { q: 'Can you build for both Android and iOS?', a: 'Yes. DarskeeWorks has apps published on both Google Play and the App Store.' },
        { q: 'How is a mobile app priced?', a: 'By scope. Send a short description of what the app should do and you’ll receive a written quotation.' }
      ]
    },
    {
      id: 'business-software',
      title: 'Business Software',
      icon: 'software',
      summary: 'Sales, inventory and management tools that fit how you work.',
      description: 'Custom tools for tracking sales, stock, records and daily operations — built around your actual workflow.',
      problems: [
        'Stock counts and sales totals never match.',
        'Records are scattered across paper, chats and spreadsheets.',
        'Generic software is too complicated or too expensive for a small team.'
      ],
      solutions: [
        'A simple system for the records you actually use every day.',
        'Offline-capable tools for shops with unreliable internet.',
        'Reports that show sales and profit at a glance.'
      ],
      features: ['Sales and inventory tracking', 'Barcode scanning where supported', 'Offline operation options', 'Simple reports', 'Data export'],
      deliverables: ['Working application', 'Source code', 'User guide', 'Training session'],
      timeline: 'Typically 3–10 weeks, confirmed in your proposal',
      price: null,
      portfolio: ['Darskee-Sales & Inventory App', 'Carpentry Calculators'],
      faqs: [
        { q: 'Can it work without internet?', a: 'Yes, offline operation is possible for many tools — the Darskee Sales & Inventory app works fully offline.' },
        { q: 'Will my data be shared?', a: 'No. How and where data is stored is agreed with you in the proposal.' }
      ]
    },
    {
      id: 'ai-automation',
      title: 'AI & Automation',
      icon: 'ai',
      summary: 'Automate repetitive work with AI-assisted tools and workflows.',
      description: 'Tools that use AI services to draft content, generate media, or remove repetitive manual steps from your work.',
      problems: [
        'Hours are spent every week on repetitive content or paperwork.',
        'You want to use AI but don’t know how to fit it into your workflow.'
      ],
      solutions: [
        'Purpose-built tools that connect to AI services you choose.',
        'Automated pipelines for content creation and document generation.',
        'Clear disclosure of which third-party AI services process your data.'
      ],
      features: ['AI-assisted content and document generation', 'Integration with third-party AI APIs', 'Batch processing and export', 'Your API keys stay under your control'],
      deliverables: ['Working tool or workflow', 'Setup guide', 'Documentation of connected services'],
      timeline: 'Typically 1–6 weeks, confirmed in your proposal',
      price: null,
      portfolio: ['DarskeeAI.com - AI Video Creation Studio', 'Darskee AI - Friendly AI Assistant', 'Darskee JLPT AI - Japanese Study Platform', 'GuroAssist PH - Your Virtual Assistant'],
      faqs: [
        { q: 'Do AI services cost extra?', a: 'Usually yes. Third-party AI providers bill usage directly to your account. Expected costs are explained before you commit.' },
        { q: 'Is my data used to train AI?', a: 'That depends on the provider you choose. Each provider’s policy is disclosed so you can decide.' }
      ]
    },
    {
      id: 'ui-ux-design',
      title: 'UI/UX Design',
      icon: 'design',
      summary: 'Clear, friendly interfaces for websites and apps.',
      description: 'Screen layouts and user flows that make your website or app easy to understand and pleasant to use.',
      problems: [
        'Users get lost or give up before contacting you or completing a task.',
        'Your product works but looks unprofessional.'
      ],
      solutions: [
        'Simple user flows with fewer steps.',
        'A consistent visual style across every screen.',
        'Designs prepared for real development, not just mockups.'
      ],
      features: ['User flow mapping', 'Wireframes', 'High-fidelity screens', 'Responsive layouts', 'Basic accessibility review'],
      deliverables: ['Design files or HTML prototype', 'Style guide (colors, fonts, components)'],
      timeline: 'Typically 1–3 weeks, confirmed in your proposal',
      price: null,
      portfolio: ['Moofy - Your Budget Buddy', 'Mochi Sensei – JLPT Study Master', 'GuroAssist PH - Your Virtual Assistant'],
      faqs: [
        { q: 'Can you redesign an existing app or site?', a: 'Yes. Share the current version and what isn’t working, and you’ll receive a scoped quotation.' }
      ]
    }
  ],

  packages: [
    {
      id: 'starter',
      name: 'Starter',
      price: 4999,
      bestFor: 'Individuals and freelancers who need a professional online presence',
      pages: '1-page website',
      features: ['Mobile-responsive design', 'Contact links (email, Messenger, WhatsApp or LINE)', 'Basic SEO setup (titles, descriptions)', 'Free static hosting setup where suitable'],
      revisions: '2 revision rounds',
      delivery: '5–7 working days',
      support: '30 days of post-launch fixes'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 9999,
      bestFor: 'Professionals and small businesses',
      pages: 'Up to 5 pages',
      features: ['Everything in Starter', 'Inquiry form integration', 'Google Maps and social links', 'Sitemap and search-engine setup', 'Image optimization'],
      revisions: '3 revision rounds',
      delivery: '10–14 working days',
      support: '30 days of post-launch fixes'
    },
    {
      id: 'business',
      name: 'Business',
      price: 14999,
      recommended: true,
      bestFor: 'Growing businesses that want inquiries from search',
      pages: 'Up to 8 pages',
      features: ['Everything in Professional', 'Services and pricing sections', 'Google Analytics 4 setup', 'Performance optimization', 'FAQ and structured data'],
      revisions: '3 revision rounds',
      delivery: '2–3 weeks',
      support: '30 days of post-launch fixes'
    },
    {
      id: 'business-catalog',
      name: 'Business Catalog',
      price: 24999,
      bestFor: 'Shops that sell through chat or want an online catalog',
      pages: 'Up to 10 pages + product catalog (up to 50 products)',
      features: ['Everything in Business', 'Product catalog with search and categories', 'Order via Messenger, WhatsApp or email', 'Catalog update guide'],
      revisions: '3 revision rounds',
      delivery: '3–4 weeks',
      support: '30 days of post-launch fixes'
    },
    {
      id: 'institutional',
      name: 'Institutional',
      price: null,
      bestFor: 'Schools, organizations and offices',
      pages: 'Scoped to your requirements',
      features: ['Announcements and document downloads', 'Transparency and policy pages', 'Built with Data Privacy Act (R.A. 10173) requirements in mind', 'Staff handover training'],
      revisions: 'Agreed in proposal',
      delivery: 'Agreed in proposal',
      support: 'Agreed in proposal'
    }
  ],

  packageNotes: [
    { title: 'Hosting', text: 'Static websites can be hosted for free on services such as GitHub Pages. Sites that need a server or database have hosting costs, which are explained before you commit.' },
    { title: 'Domain', text: 'Not included. Your domain is registered in your name and paid yearly to the registrar. Setup help is included.' },
    { title: 'Maintenance', text: 'Optional monthly plans are available after launch. See Support & Maintenance.' },
    { title: 'Revisions', text: 'A revision round is one consolidated list of changes. Extra rounds or new features are quoted separately.' }
  ],

  maintenancePlans: [
    {
      id: 'care-basic',
      name: 'Care Basic',
      price: 999,
      hours: 'Up to 1 hour of work per month',
      features: ['Small text and image updates', 'Monthly broken-link and form check', 'Email support'],
      response: 'Reply within 2 business days'
    },
    {
      id: 'care-plus',
      name: 'Care Plus',
      price: 2499,
      recommended: true,
      hours: 'Up to 3 hours of work per month',
      features: ['Everything in Care Basic', 'Content and section updates', 'Bug fixes', 'Quarterly performance check'],
      response: 'Reply within 1 business day'
    },
    {
      id: 'care-pro',
      name: 'Care Pro',
      price: 4999,
      hours: 'Up to 6 hours of work per month',
      features: ['Everything in Care Plus', 'Small feature enhancements', 'Monthly performance review', 'Technical assistance calls'],
      response: 'Reply within 1 business day'
    }
  ],

  maintenanceLimits: [
    'Unused hours do not roll over to the next month.',
    'New features or redesigns beyond the monthly hours are quoted separately.',
    'Hosting, domain and third-party service fees are not included.',
    'Response times are targets in business days (Japan time), not guarantees of resolution time.',
    'Outages caused by third-party services (hosting, app stores, AI providers) are outside DarskeeWorks’ control.',
    'Plans are billed monthly and can be cancelled with notice before the next billing cycle.'
  ],

  faqs: [
    { q: 'How do I start a project?', a: 'Send a project inquiry with what you need and your budget range. You’ll receive questions or a written proposal with scope, timeline and price.' },
    { q: 'Do you work with clients outside the Philippines?', a: 'Yes. DarskeeWorks is based in Fukuoka, Japan, and works with clients in the Philippines and internationally, in English.' },
    { q: 'How do payments work?', a: 'Projects use a 50% down payment and 50% before launch. Digital products are bought through a hosted checkout and charged in the currency shown there.' },
    { q: 'Who owns the website or app?', a: 'After full payment you own the delivered project. Domains and store developer accounts are registered in your name.' },
    { q: 'Which languages can we communicate in?', a: 'English, with Tagalog and Cebuano also available. Basic Japanese (JLPT N4).' }
  ]
};
