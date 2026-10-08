# Yousuf's Changes Summary

## Security and Backend Dependencies

- Added client-side validation to reject HTML and script-like characters in the registration name.
- Added matching backend validation so unsafe names are rejected before database insertion.
- Added regression tests covering malicious input and valid names.

## Registration: HackerRank Username

- Added a required `hackerrank_username` field to the registration form.
- Client and backend validation accepts 3-30 characters using letters, numbers, underscores, and hyphens.
- The backend stores the value in `users.hackerrank_username` alongside the participant's other information.
- HackerRank username is informational only: it is not a login key, is not unique, and does not determine whether a participant exists. Email remains unique.
- The registration form places Batch beside HackerRank username and uses the full row for Email.
- The database schema declares `hackerrank_username VARCHAR(30) NOT NULL`.

### Existing Database Note

`CREATE TABLE IF NOT EXISTS` does not add columns to a table that already exists. Before deploying against an existing database, apply a migration to add `hackerrank_username` and populate or otherwise handle existing user rows before enforcing `NOT NULL`.

## Schedule and Registration Dates

- The schedule's two entries are labeled Phase 1 and Phase 2; the evaluation entry is labeled Evaluation Phase.
- The default registration deadline is October 10, 2026.

## Challenge Navigation and Submission

- The Challenges navigation remains the primary entry point to the challenge tracks and problem statements.
- The Submit your project link from a problem detail page passes that problem's key in the URL.
- The submission form uses the key to select the matching challenge after question options load. It matches by question ID or by the problem title.

## Home Prize Teaser

- Added animated directional arrows beside each prize designation on desktop, pointing toward its corresponding prize image.
- The arrows are hidden on mobile and stay still when reduced motion is preferred; the existing mobile layout is unchanged.

## Local Testing Data (Not Pushed)

These edits remain uncommitted and are intended for local testing:

- `src/data/fallback/problems.fallback.js` contains three clearly labeled demo problems for testing the list, detail, and submission question selector.
- `src/data/siteConfig.js` sets the default problem reveal date to October 4, 2026 at 10:00 (+06:00), so the local problem pages are unlocked on the current test date.

Remove or replace the demo problems and restore the intended reveal date before production. The fallback demo statements are used only when the real local problem data module is unavailable.

## Git Changes and Verification

- Frontend production build passed with `npm run build` after the navigation and prize teaser updates.
- Demo problem exports were checked for the fields required by the list and detail pages.
- Pushed commit `ec486ad`: `[add] add HackerRank registration field and update schedule`.
- Pushed commit `83b2e8a`: `[add] add questions navigation and challenge preselection`.
- The two local testing-data edits above are not included in those commits.


# Shuvo's Changes Summary

- Fixed the registration flow so already-registered users are not shown the registration form (commit `994aba3`).
- Added an interactive schedule timeline with scroll-based milestone tracking.
- Refined mobile layouts and content across the schedule, challenge, results, FAQ, and home-page track and prize sections.
- Updated challenge and results messaging, registration copy, prize and rules data, and the FAQ Discord helpdesk link.
- Improved the submission-page flow and fixed challenge problem links.
- Removed `localhost` from the backend CORS allowed origins (commit `76d07e5`).

## Problem Statements Server Reveal Gate & Dynamic Data Fetching

### Server Gate & Protection
- Added `PROBLEMS_REVEAL_AT` environment variable (ISO 8601 with offset) documented in `hackathon.fecsdc.backend/.env.example`.
- Implemented boot-time validation in `controller/controller.js`: if missing or invalid, logs a warning and fails closed (keeps questions locked).
- Guarded `GET /questions` and `GET /question/:pk` before any database queries: responds with `403 { error: "locked", revealAt }` and `Cache-Control: no-store` until server clock reaches the reveal time.
- After reveal: responds with `200` and `Cache-Control: public, max-age=60`, returning mapped questions (`title`, `track`, `points`, `difficulty`, `summary`, `statement`, `constraints`, `deliverables`, `judging`, `id`, `category`, `question_text`, `score`).
- Validated `:pk` as a positive integer in `getQuestion`, returning `404` for invalid IDs and missing rows.

### Frontend Endpoints & Configuration
- Added `questionEndpoint` and updated `questionsEndpoint` in `src/data/siteConfig.js` falling back to `/api/question` and `/api/questions`.
- Documented `VITE_QUESTIONS_ENDPOINT` and `VITE_QUESTION_ENDPOINT` in `hackathon.fecsdc.frontend/.env.example`.

### Frontend Hook (`src/hooks/useProblems.js`)
- Created `useProblems.js` exposing `useProblemList()` and `useProblem(id)` built on `useQuery`.
- Passes `url = null` while `isLocked` is true: zero requests leave the browser and nothing is persisted before the reveal.
- Fetches immediately once unlocked and normalizes array or `{ questions: [...] }` / `{ question: {...} }` payloads.
- Handles clock skew: treats server 403 as "still locked", suppresses error flashes, and retries with backoff (5s, 10s, 20s, max 5 tries).
- Persists to `sessionStorage` only on 200 responses with data; never caches 403 or locked responses.

### Problem Statements List Page (`ProblemStatementsPage.jsx`)
- Removed static `problems` and `problemTracks` imports from `loadData.js`.
- Renders fetched problems with dynamic track filter chips (`["All", ...uniqueTracks]`).
- Added layout-stable pulse skeleton cards while loading after unlock.
- Formatted numeric challenge identifiers to `PROB-${String(id).padStart(2, "0")}`.
- Updated active count badge to use fetched problem count and added empty/error states with retry.

### Problem Detail Page (`ProblemDetailPage.jsx`)
- Removed static `problems` import from `loadData.js`.
- Validates `:id` as a positive integer; renders `NotFoundPage` on invalid IDs or server 404 responses.
- Renders a pulse skeleton block matching the single-card width while loading after unlock.
- Computes Prev/Next navigation dynamically in numeric ID order from the cached problem list (hides navigation when list is unavailable).
- Restricted the Developer Preview button (`overrideUnlock`) to `import.meta.env.DEV`, making it only unmask already-fetched data without triggering network requests.
- Preserved dynamic section numbering, single-card layout, and `?problem=<id>` submit links.