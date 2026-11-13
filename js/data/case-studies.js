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
  'DarskeeAI.com - AI Video Creation Studio': {
    slug: 'darskeeai',
    category: 'web',
    problem: 'Making short-form videos for TikTok, Reels and Shorts takes hours of scripting, visuals, voiceover and editing.',
    solution: 'An all-in-one AI creation studio: pick an idea, get a script and storyboard, add your own images or AI visuals, captions and voice, then download the MP4.',
    implementation: ['Web app live at darskeeai.com', 'AI video, images, scenes, scripts, voiceovers and face swap in one place', 'No account needed to write scripts; free MP4 export', 'Credits used only for optional AI generation'],
    results: ['Live web app']
  },
  'Darskee AI - Friendly AI Assistant': {
    slug: 'darskee-ai-chat',
    category: 'web',
    problem: 'People want a helpful AI assistant for everyday writing, learning and coding without depending on a paid AI cloud.',
    solution: 'A friendly AI chat assistant running on a self-hosted open model.',
    implementation: ['Web app live at chat.darskeeai.com', 'Self-hosted open language model', 'Free plan available; no card needed to start'],
    results: ['Live web app']
  },
  'Darskee JLPT AI - Japanese Study Platform': {
    slug: 'darskee-jlpt-ai',
    category: 'web',
    problem: 'JLPT learners juggle separate tools for lessons, flashcards and exam practice across levels N5 to N1.',
    solution: 'One structured study platform covering N5 to N1 with lessons, flashcards, optional AI explanations and exam preparation.',
    implementation: ['Web app live at jlpt.darskeeai.com', 'Vocabulary, kanji, grammar, reading and listening for every level', 'Spaced-repetition flashcards and timed mock exams', 'Progress tracking; free plan included'],
    results: ['Live web app']
  },
  'Carpentry Calculators': {
    slug: 'carpentry-calculators',
    category: 'web',
    problem: 'Carpenters and DIY builders need quick, reliable measurements for stairs, framing, materials and more.',
    solution: 'A free collection of practical carpentry, woodworking and construction calculators with worked examples and guides.',
    implementation: ['Website with 16 calculators', 'Imperial, metric and Japanese units', 'Free, no sign-up required'],
    results: ['Live website']
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
  }
};
