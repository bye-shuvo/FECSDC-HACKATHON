# FEC SDC Hackathon 2026 Developer & Architecture Guide

A high-performance collegiate hackathon platform built with React, Vite, Tailwind CSS v4, Motion, and Anime.js. Featuring a custom dual-layer reactive cursor system, multi-layered background parallax, 3D perspective tilt cards, and token-constrained monochrome/brand styling.

## Configuration

Copy `.env.example` to `.env` and update the values before starting the app. `VITE_*` values are public and baked into the browser bundle; never put credentials, tokens, problem or result data, publication flags, or security gating in them. Restart the dev server after editing `.env`, and rebuild/redeploy for changes to reach production.

| Variable | Purpose |
| --- | --- |
| `VITE_EVENT_NAME`, `VITE_SHORT_NAME`, `VITE_ORGANIZER` | Event and organizer names |
| `VITE_TAGLINE`, `VITE_DESCRIPTION` | Public event copy |
| `VITE_EVENT_DATE`, `VITE_EVENT_END_DATE`, `VITE_PROBLEM_REVEAL_DATE`, `VITE_REGISTRATION_DEADLINE` | Public dates for display; reveal/eligibility rules must be enforced server-side |
| `VITE_REGISTRATION_OPEN`, `VITE_CLUB_MEMBERS_ONLY` | Registration display controls (`true` or `false`) |
| `VITE_REGISTRATION_FORM_URL` | Optional external registration form |
| `VITE_REGISTRATION_ENDPOINT`, `VITE_QUESTIONS_ENDPOINT`, `VITE_SUBMISSION_ENDPOINT`, `VITE_PROBLEMS_ENDPOINT`, `VITE_RESULTS_ENDPOINT` | Client-facing API paths |
| `VITE_CONTACT_EMAIL`, `VITE_VENUE`, `VITE_DISCORD_INVITE` | Public contact and venue details |
| `VITE_SOCIAL_GITHUB`, `VITE_SOCIAL_DISCORD`, `VITE_SOCIAL_FACEBOOK`, `VITE_SOCIAL_LINKEDIN` | Public social links |
| `VITE_STATS` | JSON array for the homepage stats strip |

---

## 1. Adding a New Route
1. **Create Page Component**: Add a `.jsx` component under `src/pages/` (or `src/pages/hackathon/`). Include `useDocumentTitle("Page Title", "Meta description")` and wrap main content in `<PageHeader>` + `<Section>`.
2. **Register in Router**: Open `src/app/router.jsx`, lazy-import your page:
   ```jsx
   const NewPage = lazy(() => import("../pages/NewPage.jsx"));
   ```
   Add the route object into the `createBrowserRouter` route table:
   ```jsx
   { path: "your-route", element: <NewPage /> }
   ```
3. **Add Navigation Link**: Add a link to `src/components/layout/Navbar.jsx` (desktop links and mobile drawer) or `src/layouts/HackathonLayout.jsx` (subnav tabs).

---

## 2. Editing Content & Data
All copy, schedules, challenges, sponsors, rules, and jury data are modularized in `src/data/`:
- **`src/data/siteConfig.js`**: Core dates (event date, problem reveal date), registration URL, Discord links, metadata.
- **`src/data/schedule.js`**: Chronological milestone events across Day 1, 2, and 3.
- **`src/data/rules.js`**: Competition conduct, eligibility, and submission constraints.
- **`src/data/problems.js`**: 4 track specifications (IoT, DevOps, Fintech, AI) with constraints and deliverables.
- **`src/data/prizes.js`**: Championship podium awards and special category bounties.
- **`src/data/results.js`**: Tournament leaderboard, scores, and publishing flags (`published: true/false`).
- **`src/data/faq.js`**: Categorized FAQ questions and answers.
- **`src/data/sponsors.js`**: Tiered partner listings, perk breakdowns, and sponsorship deck details.

---

## 3. Custom Cursor System (`<CustomCursor />`)
Mounted once in `src/layouts/RootLayout.jsx`. Operates only on fine-pointer devices (`(pointer: fine)`) and automatically disables on touch devices and `prefers-reduced-motion`.

Interactive elements declare cursor behaviors via the `data-cursor` HTML attribute:
- **`data-cursor="link"`**: Ring expands to 1.6x scale and fills with 15% primary brand tint.
- **`data-cursor="button"`**: Ring morphs into a compact pill shape.
- **`data-cursor="card"`**: Ring contracts to a focus dot with a subtle spotlight effect.
- **`data-cursor="text"`**: Ring transforms into a 2px vertical caret for inputs and text areas.
- **`data-cursor="drag"`**: Ring shows a grab/drag indicator for scroll rails (e.g. Tracks rail).
- **`data-cursor="locked"`**: Ring shows a lock icon indicator over sealed problem areas.
- **`data-cursor="view"`**: Ring expands with a view inspection badge.

Example:
```jsx
<button data-cursor="button" onClick={handleClick}>Submit</button>
<Link to="/problem-statements" data-cursor="link">Inspect Spec</Link>
<div data-cursor="card"><TiltCard>...</TiltCard></div>
```

---

## 4. Layered Background System (`<BackgroundScene />`)
Mounted fixed in `src/layouts/RootLayout.jsx` behind content (`z-0`, `pointer-events-none`).

Background variants:
- **`landing`**: All 5 layers active (SVG noise grain, 1px dot grid with scroll parallax, drifting pill-bar field, mouse spotlight radial gradient `--mx/--my`, and 2 slow aurora blobs).
- **`content`**: Quiet mode for readable long-form content (faint grid + subtle pill drift).
- **`locked`**: Content layers + full-viewport CRT scanline overlay (`.scanline-overlay`).
- **`results`**: Content layers + confetti-lite pill particles on podium enter.

Changing variants per route:
Open `src/layouts/RootLayout.jsx` and adjust the route matcher in the `getBackgroundVariant(pathname)` helper:
```jsx
const getBackgroundVariant = (pathname) => {
  if (pathname === "/") return "landing";
  if (pathname.includes("problem-statements")) return "locked";
  if (pathname.includes("results")) return "results";
  return "content";
};
```

---

## 5. Design Tokens & Motion
- Defined in `src/index.css` under `:root` and `[data-theme="fec"]`.
- Spacing is based on a strict 4px grid (`--space-1` = 4px, `--space-2` = 8px, `--space-4` = 16px, etc.).
- Mixed radius set: sm `1px`, md `3px`, pill `9999px`.
- Typography: Display in **JetBrains Mono**, Body/code in **Fira Code**.
