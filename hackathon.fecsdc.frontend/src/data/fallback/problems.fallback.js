/**
 * Problem Statements Data
 * Hidden behind countdown timer until siteConfig.problemRevealDate is reached.
 *
 * DB column mapping (questions table + details JSON):
 *   id           → questions.id (slug)
 *   title        → questions.question_text
 *   track        → questions.category   ("Problem Solving" | "Web Development")
 *   points       → questions.score
 *   difficulty   → questions.details.difficulty
 *   summary      → questions.details.summary       (list-page cards)
 *   statement    → questions.details.statement     (prose; blank-line paragraphs; `backtick` inline code)
 *   constraints  → questions.details.constraints   (string[])
 *   deliverables → questions.details.deliverables  (string[])
 *   judging      → questions.details.judging       ([{ label, weight }])
 *
 * Note: samples, input, output are no longer used for hackathon build challenges.
 *
 * ALTER TABLE questions ADD COLUMN details JSON NULL;
 */

export const problems = [
  // ─── Problem 01 ─────────────────────────────────────────────────────────────
    {
    id: "web-01",
    title: "GitHub Profile Analyzer",
    track: "Web Development",
    difficulty: "Beginner",
    points: 100,
    summary:
      "Build a web app that takes a GitHub username and shows repositories, top languages in a chart, and star counts using the GitHub API.",
    statement: `Developers often want a quick view of their GitHub activity without digging through every repository.

Your mission is to build a simple, responsive web app. The user enters a GitHub username, and the app fetches public data from the GitHub REST API and presents it clearly.

Given a username, call \`https://api.github.com/users/{username}\` and \`https://api.github.com/users/{username}/repos\`. Display the profile info, list the repositories, compute the total star count, and render a chart showing the top languages used across all repositories.`,
    constraints: [
      "Use the public GitHub REST API. No authentication required.",
      "Handle errors: user not found, empty repo list, API rate limit.",
      "Show a loading state while data is being fetched.",
      "Layout must be responsive on mobile and desktop.",
      "Any stack allowed: HTML/CSS/JS, React, or similar. Chart library optional.",
    ],
    deliverables: [
      "Working web app with username input and search button.",
      "Profile card: avatar, name, bio, followers, public repo count.",
      "Repo list with name, language, and star count, plus total stars.",
      "Top languages chart (bar or pie) built from repo language data.",
      "Public GitHub repo with README (setup steps, screenshots, live link).",
    ],
    judging: [
      { label: "Core functionality", weight: 35 },
      { label: "UI/UX & responsiveness", weight: 30 },
      { label: "Chart & data accuracy", weight: 20 },
      { label: "Code quality & README", weight: 15 },
    ],
  },

  // ─── Problem 02 ─────────────────────────────────────────────────────────────
  {
    id: "web-02",
    title: "Dictionary App",
    track: "API Data Apps",
    difficulty: "Beginner",
    points: 100,
    summary:
      "Build a web app that looks up English words and shows meanings, pronunciation audio, synonyms, and a saved-words list using the Free Dictionary API.",
    statement: `Students and readers often need a fast, clean way to look up unfamiliar words and keep track of ones worth remembering.

Your mission is to build a simple, responsive dictionary app. The user types a word, and the app fetches data from the Free Dictionary API and presents it clearly.

Given a word, call \`https://api.dictionaryapi.dev/api/v2/entries/en/{word}\`. Display the phonetic text, parts of speech, definitions, example sentences, and synonyms. Provide a button to play pronunciation audio when available. Let users save words to a list and remove them later.`,
    constraints: [
      "Use the Free Dictionary API. No authentication required.",
      "Handle errors: word not found, empty input, network failure.",
      "Show a loading state while data is being fetched.",
      "Hide or disable the audio button when no audio is available.",
      "Saved words must persist after page refresh (localStorage or similar).",
      "Layout must be responsive on mobile and desktop.",
    ],
    deliverables: [
      "Working web app with search input and search button.",
      "Result view: word, phonetic, part of speech, definitions, examples.",
      "Pronunciation audio playback button.",
      "Synonyms list, clickable to search that word.",
      "Saved-words list with add and remove actions.",
      "Public GitHub repo with README (setup steps, screenshots, live link).",
    ],
    judging: [
      { label: "Core functionality", weight: 35 },
      { label: "UI/UX & responsiveness", weight: 30 },
      { label: "Saved words & audio features", weight: 20 },
      { label: "Code quality & README", weight: 15 },
    ],
  },

  // ─── Problem 03 ─────────────────────────────────────────────────────────────
  {
    id: "prob-03",
    title: "Offline-First Peer-to-Peer Micro-Payment & Barter Mesh",
    track: "Web Development",
    difficulty: "Advanced",
    points: 350,
    summary:
      "Engineer a zero-trust cryptographic ledger capable of processing secure transactions between disconnected mobile nodes via Bluetooth Low Energy and QR payloads.",
    statement: `During natural disasters or network brownouts, conventional banking apps become completely useless.

Hackers are tasked with developing a cryptographic offline token exchange protocol. Nodes must be able to verify balances, sign cryptographic receipts via public-key pairs over BLE or sound-wave/visual QR, and reconcile transactions deterministically once connectivity is re-established without double-spending.

The final artefact must be a mobile-friendly progressive web application demonstrating a full two-device exchange, with an embedded transaction history explorer and a formal reconciliation algorithm.`,
    constraints: [
      "Must prevent double-spending without requiring active internet access during point-of-sale.",
      "Cryptographic signatures must verify in `< 150ms` on mobile devices.",
      "Reconciliation ledger must maintain mathematical integrity upon conflict merges.",
      "UI must make cryptographic handshakes understandable to non-technical users.",
    ],
    deliverables: [
      "Mobile-friendly web application or native prototype demonstrating 2-device exchange.",
      "Cryptographic ledger verification script and transaction history explorer.",
      "Simulation demonstrating double-spend rejection test cases.",
      "Formal mathematical specification of the reconciliation algorithm.",
    ],
    judging: [
      { label: "Cryptographic rigor", weight: 40 },
      { label: "Usability & UX clarity", weight: 30 },
      { label: "Edge-case handling", weight: 20 },
      { label: "Visual transaction feedback", weight: 10 },
    ],
  },

  // ─── Problem 04 ─────────────────────────────────────────────────────────────
  {
    id: "prob-04",
    title: "Multimodal Voice & Vision Medical Triage Assistant",
    track: "Web Development",
    difficulty: "Intermediate",
    points: 250,
    summary:
      "Develop a bilingual conversational triage application that listens to patient symptoms in Bengali/English and parses vital telemetry to prioritize emergency referrals.",
    statement: `Rural clinics often face acute shortages of medical triage officers, leading to severe delays for critical patients.

Build an edge-friendly multimodal application that accepts natural voice descriptions in Bengali or English, parses symptoms into clinical terminology, cross-references vital measurements (pulse, temperature, SpO₂), and renders structured triage prioritization scores with doctor notes.

Accessibility and latency are first-class requirements: the interface must remain operable on low-end Android devices over \`2G\` connections, and the full pipeline from audio input to a triage ticket must complete in under \`3.5 seconds\`.`,
    constraints: [
      "Must gracefully accept noisy voice inputs or localized accents.",
      "Must explicitly declare medical non-liability disclaimers and cite triage confidence.",
      "Latency from audio input to preliminary triage ticket must be under `3.5 seconds`.",
      "Completely accessible via high-contrast mobile interface with audio playback.",
    ],
    deliverables: [
      "Responsive voice-enabled web app tested on desktop and smartphone browsers.",
      "Audio transcription & clinical extraction pipeline with verifiable test cases.",
      "Physician dashboard displaying prioritized patient queue with triage urgency badges.",
      "README detailing ethics, prompt guards, and fail-safe human override mechanisms.",
    ],
    judging: [
      { label: "Transcription & triage accuracy", weight: 35 },
      { label: "UX accessibility & voice feedback", weight: 30 },
      { label: "Bilingual handling", weight: 20 },
      { label: "Clinical protocol alignment", weight: 15 },
    ],
  },
];
