/*
 * DarskeeWorks digital product catalog.
 *
 * status:
 *   'draft'        — in preparation. Shown as "Coming soon" (if enabled in config), never purchasable,
 *                    product page is noindex.
 *   'published'    — live. Purchasable ONLY if checkoutUrl is a valid https URL.
 *   'unavailable'  — temporarily not for sale. Hidden from the shop; product page explains.
 *
 * kind:
 *   'download'  — digital file delivered by the hosted checkout provider (Payhip / Gumroad).
 *   'external'  — product sold or distributed on its own official site / app store.
 *
 * To publish a product: add real images, verify every text field, upload the file to your
 * checkout provider, paste the product link into checkoutUrl, then set status: 'published'.
 * See docs/DARSKEEWORKS_IMPLEMENTATION.md → "Publishing a product".
 */
window.DW_PRODUCT_CATEGORIES = [
  { id: 'teacher-resources', title: 'Teacher Resources', icon: 'teacher' },
  { id: 'business-templates', title: 'Business Templates', icon: 'business' },
  { id: 'canva-templates', title: 'Canva Templates', icon: 'canva' },
  { id: 'website-templates', title: 'Website Templates', icon: 'web' },
  { id: 'productivity-tools', title: 'Productivity Tools', icon: 'productivity' },
  { id: 'software-applications', title: 'Software & Applications', icon: 'software' }
];

(function () {
  var PERSONAL = {
    type: 'Personal use',
    summary: 'For one person. Use for your own classes, business or personal planning.',
    allowed: ['Print as many copies as you need for your own use', 'Use digitally on your own devices'],
    notAllowed: ['Resell, share or redistribute the files', 'Upload the files to shared drives or marketplaces']
  };
  var COMMERCIAL = {
    type: 'Single business use',
    summary: 'For one business or one end client. Customize freely for that business.',
    allowed: ['Edit and customize for one business or one client project', 'Use the finished designs commercially'],
    notAllowed: ['Resell or share the editable template itself', 'Use for more than one business without an extra license']
  };
  var SINGLE_SITE = {
    type: 'Single website',
    summary: 'Use the template to build one website, for yourself or one client.',
    allowed: ['Build and launch one website', 'Modify the code and design for that site'],
    notAllowed: ['Resell or redistribute the template', 'Use for multiple websites without additional licenses']
  };

  var PRINT_FORMATS = ['PDF (A4)', 'PDF (US Letter)'];
  var PRINT_COMPAT = ['Any PDF reader', 'Home or shop printers', 'Annotation apps that open PDF files'];
  var SHEET_COMPAT = ['Google Sheets', 'Microsoft Excel'];
  var CANVA_COMPAT = ['Canva (free account)'];

  window.DW_PRODUCTS = [
    {
      id: 'ultimate-teacher-planner',
      title: 'Ultimate Teacher Planner',
      category: 'teacher-resources',
      price: 19, currency: 'USD',
      status: 'draft', kind: 'download',
      featured: true,
      badges: ['Printable'],
      short: 'A complete school-year planner for lessons, schedules, records and goals.',
      description: 'An all-in-one printable planner that keeps your school year organized — yearly and monthly calendars, weekly lesson plans, class schedules, student records and reflection pages in one consistent layout.',
      benefits: ['Keep every class plan in one place', 'Spend less time re-creating the same forms', 'Print only the sections you need'],
      includes: ['Yearly and monthly calendars', 'Weekly lesson plan pages', 'Class schedule and seating templates', 'Student contact and record pages', 'Goal and reflection pages'],
      formats: PRINT_FORMATS, compatibility: PRINT_COMPAT,
      usage: ['Download the PDF after purchase.', 'Print the full planner or selected pages.', 'Or open it in a PDF annotation app to write digitally.'],
      license: PERSONAL,
      images: [], previews: [],
      checkoutUrl: '', delivery: 'hosted',
      faqs: [{ q: 'Is this dated?', a: 'Planned as undated so it can be used any school year.' }],
      related: ['daily-lesson-planner', 'teacher-assessment-tracker', 'classroom-management-kit']
    },
    {
      id: 'daily-lesson-planner',
      title: 'Daily Lesson Planner',
      category: 'teacher-resources',
      price: 5, currency: 'USD',
      status: 'draft', kind: 'download',
      badges: [],
      short: 'Simple one-page daily lesson plan templates.',
      description: 'Clean daily lesson plan pages with space for objectives, materials, activities, assessment and notes.',
      benefits: ['Plan each lesson in minutes', 'Consistent format for every subject'],
      includes: ['Daily lesson plan page', 'Weekly overview page', 'Notes page'],
      formats: PRINT_FORMATS, compatibility: PRINT_COMPAT,
      usage: ['Download and print as many copies as you need for your own classes.'],
      license: PERSONAL,
      images: [], previews: [],
      checkoutUrl: '', delivery: 'hosted',
      faqs: [],
      related: ['ultimate-teacher-planner', 'classroom-management-kit']
    },
    {
      id: 'classroom-management-kit',
      title: 'Classroom Management Kit',
      category: 'teacher-resources',
      price: 7, currency: 'USD',
      status: 'draft', kind: 'download',
      badges: [],
      short: 'Printable charts and trackers for routines and behavior.',
      description: 'Printable tools for classroom routines — behavior trackers, reward charts, class rules posters and attendance sheets.',
      benefits: ['Set clear routines from day one', 'Track behavior and attendance quickly'],
      includes: ['Behavior tracker', 'Reward chart', 'Class rules poster', 'Attendance sheet', 'Classroom jobs chart'],
      formats: PRINT_FORMATS, compatibility: PRINT_COMPAT,
      usage: ['Download, print and display or fill in by hand.'],
      license: PERSONAL,
      images: [], previews: [],
      checkoutUrl: '', delivery: 'hosted',
      faqs: [],
      related: ['ultimate-teacher-planner', 'teacher-assessment-tracker']
    },
    {
      id: 'teacher-assessment-tracker',
      title: 'Teacher Assessment Tracker',
      category: 'teacher-resources',
      price: 9, currency: 'USD',
      status: 'draft', kind: 'download',
      badges: ['Spreadsheet'],
      short: 'Spreadsheet gradebook with automatic averages.',
      description: 'A spreadsheet for recording quiz, exam and activity scores, with automatic averages and a per-student summary.',
      benefits: ['Automatic computation of averages', 'See struggling students at a glance'],
      includes: ['Class list sheet', 'Score entry sheets', 'Automatic summary sheet', 'How-to-use tab'],
      formats: ['Google Sheets (copy link)', 'Excel (.xlsx)'], compatibility: SHEET_COMPAT,
      usage: ['Make a copy in Google Sheets or open the .xlsx file.', 'Enter your class list, then scores.'],
      license: PERSONAL,
      images: [], previews: [],
      checkoutUrl: '', delivery: 'hosted',
      faqs: [{ q: 'Does it follow DepEd grading?', a: 'Weighting will be configurable. Exact grading rules will be stated in the final product description.' }],
      related: ['ultimate-teacher-planner', 'classroom-management-kit']
    },
    {
      id: 'teacher-canva-template-bundle',
      title: 'Teacher Canva Template Bundle',
      category: 'canva-templates',
      price: 12, currency: 'USD',
      status: 'draft', kind: 'download',
      featured: true,
      badges: ['Canva'],
      short: 'Editable Canva templates for classroom posters, slides and certificates.',
      description: 'Editable Canva designs for teachers — lesson slides, classroom posters, certificates and parent notices.',
      benefits: ['Professional-looking materials in minutes', 'Edit text, colors and images in Canva'],
      includes: ['Lesson slide templates', 'Classroom posters', 'Certificates', 'Parent notice templates'],
      formats: ['Canva template links (PDF with links)'], compatibility: CANVA_COMPAT,
      usage: ['Open the PDF after purchase and click each template link.', 'Canva will create your own editable copy.'],
      license: PERSONAL,
      images: [], previews: [],
      checkoutUrl: '', delivery: 'hosted',
      faqs: [{ q: 'Do I need Canva Pro?', a: 'Planned to work with a free Canva account. Any Pro-only elements will be listed in the final description.' }],
      related: ['ultimate-teacher-planner', 'social-media-canva-bundle']
    },
    {
      id: 'small-business-starter-kit',
      title: 'Small Business Starter Kit',
      category: 'business-templates',
      price: 9, currency: 'USD',
      status: 'draft', kind: 'download',
      featured: true,
      badges: [],
      short: 'Essential templates to organize a new small business.',
      description: 'A starter set of business documents — simple business plan, price list, expense log, customer list and quotation template.',
      benefits: ['Start organized from day one', 'Look professional with clients'],
      includes: ['One-page business plan', 'Price list template', 'Expense log', 'Customer list', 'Quotation template'],
      formats: ['Excel (.xlsx)', 'Google Sheets', 'Word (.docx)', 'PDF'], compatibility: SHEET_COMPAT.concat(['Microsoft Word', 'Google Docs']),
      usage: ['Download the files and edit them with your business details.'],
      license: COMMERCIAL,
      images: [], previews: [],
      checkoutUrl: '', delivery: 'hosted',
      faqs: [],
      related: ['sales-inventory-spreadsheet', 'business-invoice-templates']
    },
    {
      id: 'sales-inventory-spreadsheet',
      title: 'Sales & Inventory Spreadsheet',
      category: 'business-templates',
      price: 12, currency: 'USD',
      status: 'draft', kind: 'download',
      featured: true,
      badges: ['Spreadsheet'],
      short: 'Track stock, sales and profit in one spreadsheet.',
      description: 'A spreadsheet for small shops to record products, stock in and out, daily sales and profit, with a summary dashboard.',
      benefits: ['Know what is in stock', 'See daily and monthly sales totals', 'Spot low-stock items early'],
      includes: ['Product list', 'Stock in/out log', 'Sales log', 'Summary dashboard', 'How-to-use tab'],
      formats: ['Google Sheets (copy link)', 'Excel (.xlsx)'], compatibility: SHEET_COMPAT,
      usage: ['Make a copy in Google Sheets or open the .xlsx file.', 'Add your products, then record sales daily.'],
      license: COMMERCIAL,
      images: [], previews: [],
      checkoutUrl: '', delivery: 'hosted',
      faqs: [{ q: 'Is there an app version?', a: 'Yes — the Darskee Sales & Inventory app for Android is listed under Software & Applications.' }],
      related: ['darskee-sales-inventory-app', 'small-business-starter-kit', 'business-invoice-templates']
    },
    {
      id: 'business-invoice-templates',
      title: 'Business Invoice Templates',
      category: 'business-templates',
      price: 5, currency: 'USD',
      status: 'draft', kind: 'download',
      badges: [],
      short: 'Clean, editable invoice and receipt templates.',
      description: 'Editable invoice, receipt and quotation templates with automatic totals in the spreadsheet versions.',
      benefits: ['Send professional invoices', 'Automatic totals reduce mistakes'],
      includes: ['Invoice template', 'Receipt template', 'Quotation template'],
      formats: ['Excel (.xlsx)', 'Google Sheets', 'Word (.docx)'], compatibility: SHEET_COMPAT.concat(['Microsoft Word', 'Google Docs']),
      usage: ['Add your logo and business details once, then reuse.'],
      license: COMMERCIAL,
      images: [], previews: [],
      checkoutUrl: '', delivery: 'hosted',
      faqs: [{ q: 'Is this an official BIR receipt?', a: 'No. These are business documents only and are not a substitute for official receipts required by your tax authority.' }],
      related: ['small-business-starter-kit', 'sales-inventory-spreadsheet']
    },
    {
      id: 'social-media-canva-bundle',
      title: 'Social Media Canva Bundle',
      category: 'canva-templates',
      price: 9, currency: 'USD',
      status: 'draft', kind: 'download',
      badges: ['Canva'],
      short: 'Editable post and story templates for small businesses.',
      description: 'Editable Canva templates for Facebook and Instagram posts, stories and promo announcements.',
      benefits: ['Consistent, professional posts', 'Edit in minutes in Canva'],
      includes: ['Square post templates', 'Story templates', 'Promo and sale announcements', 'Quote and tip posts'],
      formats: ['Canva template links (PDF with links)'], compatibility: CANVA_COMPAT,
      usage: ['Open the PDF after purchase and click each template link to copy it to your Canva account.'],
      license: COMMERCIAL,
      images: [], previews: [],
      checkoutUrl: '', delivery: 'hosted',
      faqs: [],
      related: ['teacher-canva-template-bundle', 'small-business-starter-kit']
    },
    {
      id: 'personal-budget-planner',
      title: 'Personal Budget Planner',
      category: 'productivity-tools',
      price: 7, currency: 'USD',
      status: 'draft', kind: 'download',
      badges: [],
      short: 'Monthly budget, expense and savings tracker.',
      description: 'A printable and spreadsheet budget planner for monthly income, expenses, bills and savings goals.',
      benefits: ['See where your money goes', 'Track savings goals'],
      includes: ['Monthly budget sheet', 'Expense tracker', 'Bill checklist', 'Savings goal tracker'],
      formats: ['PDF (A4)', 'Google Sheets', 'Excel (.xlsx)'], compatibility: SHEET_COMPAT.concat(['Any PDF reader']),
      usage: ['Print the PDF or use the spreadsheet version.'],
      license: PERSONAL,
      images: [], previews: [],
      checkoutUrl: '', delivery: 'hosted',
      faqs: [{ q: 'Is there an app?', a: 'Yes — Moofy (iOS) and Budget Tracker by Darskee (Android) are DarskeeWorks budgeting apps.' }],
      related: ['small-business-starter-kit']
    },
    {
      id: 'portfolio-website-template',
      title: 'Portfolio Website Template',
      category: 'website-templates',
      price: 19, currency: 'USD',
      status: 'draft', kind: 'download',
      featured: true,
      badges: ['HTML/CSS'],
      short: 'A fast, responsive one-page portfolio in plain HTML and CSS.',
      description: 'A clean portfolio website template written in plain HTML, CSS and a little JavaScript — no build tools — ready for free static hosting.',
      benefits: ['Launch a portfolio without monthly fees', 'Easy to edit in any code editor'],
      includes: ['HTML, CSS and JavaScript source', 'Setup guide for GitHub Pages', 'Image placeholders'],
      formats: ['ZIP (HTML, CSS, JS)'], compatibility: ['Any modern browser', 'GitHub Pages, Netlify, Cloudflare Pages or any static host'],
      usage: ['Unzip, edit the text and images, then upload to a static host.'],
      license: SINGLE_SITE,
      images: [], previews: [],
      checkoutUrl: '', delivery: 'hosted',
      faqs: [{ q: 'Do I need to code?', a: 'Basic editing of text in HTML files. The guide explains each step.' }],
      related: ['business-website-template']
    },
    {
      id: 'business-website-template',
      title: 'Business Website Template',
      category: 'website-templates',
      price: 29, currency: 'USD',
      status: 'draft', kind: 'download',
      badges: ['HTML/CSS'],
      short: 'A multi-page small business website template.',
      description: 'A multi-page business website template with home, services, about, pricing and contact pages, in plain HTML and CSS.',
      benefits: ['Professional structure ready to fill in', 'No monthly platform fees'],
      includes: ['5 page templates', 'Responsive navigation', 'Contact page layout', 'Setup guide'],
      formats: ['ZIP (HTML, CSS, JS)'], compatibility: ['Any modern browser', 'Any static host'],
      usage: ['Unzip, edit the content, then upload to a static host.'],
      license: SINGLE_SITE,
      images: [], previews: [],
      checkoutUrl: '', delivery: 'hosted',
      faqs: [{ q: 'Can you set it up for me?', a: 'Yes — see the Starter and Professional website packages.' }],
      related: ['portfolio-website-template']
    },

    /* ── Real, existing software (sold or distributed on their official listings) ── */
    {
      id: 'darskee-automation',
      title: 'Darskee Automation',
      category: 'software-applications',
      price: 2499, currency: 'PHP',
      priceNote: 'One-time license. Check the official site for the current price before buying.',
      status: 'published', kind: 'external',
      featured: true,
      badges: ['Desktop software'],
      short: 'AI-powered tool that creates short-form videos for Reels, TikTok and Shorts.',
      description: 'Desktop software that generates scripts, AI images, voiceovers and captions, and renders complete short-form videos ready for Facebook Reels, TikTok and YouTube Shorts.',
      benefits: ['Turn an idea into a finished short video', 'Generate scripts, images, voiceovers and captions in one tool', 'Your API keys and output files stay on your computer'],
      includes: ['Darskee Automation desktop software'],
      formats: ['Desktop application'], compatibility: ['See the official site for system requirements'],
      usage: ['Purchase and download from the official Darskee Automation site.', 'Enter your own AI service API keys (for example Fal AI) in the app.'],
      license: { type: 'Software license', summary: 'Licensed under the terms shown on the official Darskee Automation site.', allowed: [], notAllowed: [] },
      images: ['assets/opt/darskee-automation-960.webp'], previews: [],
      checkoutUrl: 'https://darskee-automation-site-production.up.railway.app/',
      ctaLabel: 'View on official site',
      privacyUrl: 'privacy-darskee-automation.html',
      faqs: [{ q: 'Are AI generation costs included?', a: 'No. The software connects to third-party AI services using your own API keys, which those providers bill separately.' }],
      related: ['social-media-canva-bundle']
    },
    {
      id: 'mochi-sensei',
      title: 'Mochi Sensei – JLPT Study Master',
      category: 'software-applications',
      price: 0, currency: 'USD',
      priceLabel: 'Free · optional Pro',
      status: 'published', kind: 'external',
      badges: ['iOS app'],
      short: 'Japanese study companion for the JLPT with flashcards and mock exams.',
      description: 'An iPhone and iPad app for JLPT study with vocabulary, kanji, grammar, spaced-repetition flashcards and mock exams. Core features are free; Mochi Sensei Pro unlocks more.',
      benefits: ['Study offline without an account', 'Progress syncs through your own iCloud'],
      includes: ['Mochi Sensei iOS app'],
      formats: ['iOS app'], compatibility: ['iPhone and iPad (see App Store for requirements)'],
      usage: ['Download from the App Store.'],
      license: { type: 'App Store terms', summary: 'Distributed under Apple’s App Store terms.', allowed: [], notAllowed: [] },
      images: ['assets/opt/mochi-sensei-480.webp'], previews: [],
      checkoutUrl: 'https://apps.apple.com/jp/app/mochi-sensei-jlpt-study-master/id6787880229',
      ctaLabel: 'Get it on the App Store',
      privacyUrl: 'privacy-mochisensei.html',
      supportUrl: 'support-mochisensei.html',
      faqs: [],
      related: []
    },
    {
      id: 'darskee-sales-inventory-app',
      title: 'Darskee Sales & Inventory App',
      category: 'software-applications',
      price: null, currency: 'USD',
      priceLabel: 'See Google Play',
      status: 'published', kind: 'external',
      badges: ['Android app'],
      short: 'Offline POS for retail: sales, inventory, barcode and profit tracking.',
      description: 'An Android point-of-sale and inventory app for small retail shops. Track sales, stock, barcodes and profit — fully offline, with data stored on your device.',
      benefits: ['Works without internet', 'No account required', 'Business data stays on your device'],
      includes: ['Darskee Sales & Inventory Android app'],
      formats: ['Android app'], compatibility: ['Android (see Google Play for requirements)'],
      usage: ['Install from Google Play.'],
      license: { type: 'Google Play terms', summary: 'Distributed under Google Play terms.', allowed: [], notAllowed: [] },
      images: ['assets/opt/inventory-app-480.webp'], previews: [],
      checkoutUrl: 'https://play.google.com/store/apps/details?id=com.darskeeworks.darskee',
      ctaLabel: 'Get it on Google Play',
      privacyUrl: 'privacy-sales-inventory.html',
      faqs: [],
      related: ['sales-inventory-spreadsheet']
    }
  ];

  /* Bundles — shown only when status is 'published' and all items are published. */
  window.DW_BUNDLES = [
    {
      id: 'teacher-essentials-bundle',
      title: 'Teacher Essentials Bundle',
      items: ['ultimate-teacher-planner', 'daily-lesson-planner', 'classroom-management-kit', 'teacher-assessment-tracker'],
      price: 29, currency: 'USD',
      status: 'draft',
      checkoutUrl: ''
    }
  ];
})();
