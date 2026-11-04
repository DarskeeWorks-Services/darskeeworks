/*
 * Case study details, keyed by the exact project `name` in works.json.
 *
 * Only include facts that are verified (from the app listing, the project's own
 * privacy policy, or the owner). Leave `results` empty rather than guessing —
 * the page then shows "Results not yet published".
 *
 * Optional fields per project:
 *   slug, category ('mobile' | 'web' | 'software'), tech[], problem, solution,
 *   implementation[], screenshots[] (image paths), results[]
 */
window.DW_CASE_STUDIES = {
  'Solar PV Calc - Solar Designer': {
    slug: 'solar-pv-calc',
    category: 'mobile',
    problem: 'Sizing a solar PV system involves repetitive calculations that are slow and error-prone to do by hand.',
    solution: 'An Android calculator that works out solar system requirements and keeps saved results on the device.',
    implementation: ['Android app published on Google Play', 'Saved calculations stored locally on the device', 'No account or login required; no data sent to external servers'],
    results: ['Published and available on Google Play']
  },
  'Budget Tracker by Darskee': {
    slug: 'budget-tracker',
    category: 'mobile',
    problem: 'People tracking income, expenses, loans and savings in several currencies need one simple, private place to do it.',
    solution: 'A personal finance app for expenses, income, loans and savings goals with multi-currency support.',
    implementation: ['Android app published on Google Play', 'Multi-currency support', 'Financial data stored only on the device; export available in-app', 'No account required'],
    results: ['Published and available on Google Play']
  },
  'Darskee Pass Jlpt N4': {
    slug: 'darskee-pass-jlpt-n4',
    category: 'mobile',
    problem: 'JLPT N4 learners need vocabulary, grammar, kanji and practice tests in one study tool.',
    solution: 'A focused N4 study app with practice tests and progress history.',
    implementation: ['Android app published on Google Play', 'Quiz scores and progress stored locally on the device', 'No account required'],
    results: ['Published and available on Google Play']
  },
  'Darskee-Sales & Inventory App': {
    slug: 'sales-inventory-app',
    category: 'software',
    problem: 'Small retail shops need to track sales and stock reliably, often without dependable internet.',
    solution: 'An offline point-of-sale and inventory app with barcode support and profit tracking.',
    implementation: ['Android app published on Google Play', 'Works fully offline', 'Barcode scanning for faster checkout', 'Business data stored only on the device'],
    results: ['Published and available on Google Play']
  },
  'Moofy - Your Budget Buddy': {
    slug: 'moofy',
    category: 'mobile',
    problem: 'Budgeting apps often require accounts and upload personal financial data.',
    solution: 'A friendly iOS budgeting app that keeps every record on the user’s own phone.',
    implementation: ['iOS app published on the App Store', 'All data stored locally; nothing uploaded to servers', 'No account, no advertising identifiers'],
    results: ['Published and available on the App Store']
  },
  'Mochi Sensei – JLPT Study Master': {
    slug: 'mochi-sensei',
    category: 'mobile',
    problem: 'JLPT learners want structured study with spaced repetition and mock exams, without giving up their privacy.',
    solution: 'An iOS study companion with vocabulary, kanji, grammar, SRS flashcards, mock exams and an optional AI Sensei chat.',
    implementation: ['iOS app published on the App Store', 'Spaced-repetition flashcard system', 'Progress synced through the user’s own iCloud (CloudKit)', 'Optional AI features use the user’s own OpenAI or Anthropic API key, stored on-device', 'Free core features with optional Pro subscription or lifetime purchase'],
    results: ['Published and available on the App Store']
  },
  'DarsKaraoke - Sing Your Heart Out': {
    slug: 'darskaraoke',
    category: 'web',
    problem: 'Friends wanted a simple way to sing karaoke together from a browser.',
    solution: 'A karaoke web app that runs in the browser with no registration.',
    implementation: ['Web app hosted on Railway', 'No account required; session kept in browser storage'],
    results: ['Live web app']
  },
  'GuroAssist PH - Your Virtual Assistant': {
    slug: 'guroassist-ph',
    category: 'web',
    problem: 'Filipino teachers spend many hours preparing lesson documents such as DLL and DLP.',
    solution: 'A web-based virtual assistant that helps teachers generate DLL and DLP documents.',
    implementation: ['Web app live at guroassistph.site', 'AI services process queries to generate responses', 'Session-based conversation context'],
    results: ['Live web app']
  },
  'Daril Quervo Portfolio': {
    slug: 'daril-quervo-portfolio',
    category: 'web',
    problem: 'A developer needed a professional online presence to share work with clients and employers.',
    solution: 'A fast, static personal portfolio website.',
    implementation: ['Static website', 'No tracking scripts or analytics'],
    results: ['Live website']
  },
  'Darskee Automation': {
    slug: 'darskee-automation',
    category: 'software',
    problem: 'Creating short-form videos for Reels, TikTok and Shorts takes hours of scripting, image creation, voiceover and editing.',
    solution: 'Desktop software that generates scripts, AI images, voiceovers and captions and renders complete videos.',
    implementation: ['Desktop application', 'Connects to third-party AI services such as Fal AI using the user’s own API keys', 'API credentials and generated files stored locally'],
    results: ['Available for purchase on its official site']
  }
};
