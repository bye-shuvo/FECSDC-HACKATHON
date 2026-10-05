/**
 * Site Configuration & Global Constants
 * Public display details and client-facing integration endpoints.
 */

const str = (value, fallback) =>
  typeof value === "string" && value.trim() !== "" ? value : fallback;

const bool = (value, fallback) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
};

const isoDate = (value, fallback) => {
  const candidate = str(value, fallback);
  if (!Number.isNaN(Date.parse(candidate))) return candidate;
  if (import.meta.env.DEV && value?.trim()) {
    console.warn("Invalid ISO date in VITE_* config; using fallback.");
  }
  return fallback;
};

const json = (value, fallback) => {
  if (!value?.trim()) return fallback;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Fall through to the development warning and fallback.
  }
  if (import.meta.env.DEV) {
    console.warn("Invalid JSON array in VITE_* config; using fallback.");
  }
  return fallback;
};

export const siteConfig = {
  eventName: str(import.meta.env.VITE_EVENT_NAME, "FEC SDC HACKATHON 2026"),
  shortName: str(import.meta.env.VITE_SHORT_NAME, "FEC SDC HACK '26"),
  organizer: str(import.meta.env.VITE_ORGANIZER, "Faridpur Engineering College Software Development Club (FEC SDC)"),
  tagline: str(import.meta.env.VITE_TAGLINE, "6 hours of intense brainstorming, collaborative intelligence, and rapid prototyping."),
  description: str(import.meta.env.VITE_DESCRIPTION, "Join the premier hackathon hosted by FEC SDC. Compete in 2 tracks, build innovative solutions, and showcase your skills."),

  // Public dates are display-only; enforce eligibility and reveal rules on the server.
  eventDate: isoDate(import.meta.env.VITE_EVENT_DATE, "2026-10-04T09:00:00+06:00"),
  eventEndDate: isoDate(import.meta.env.VITE_EVENT_END_DATE, "2026-10-04T09:00:00+06:00"),
  problemRevealDate: isoDate(import.meta.env.VITE_PROBLEM_REVEAL_DATE, "2026-10-05T10:00:00+06:00"),
  registrationDeadline: isoDate(import.meta.env.VITE_REGISTRATION_DEADLINE, "2026-10-10T23:59:59+06:00"),

  // Registration controls
  registrationOpen: bool(import.meta.env.VITE_REGISTRATION_OPEN, true),
  clubMembersOnly: bool(import.meta.env.VITE_CLUB_MEMBERS_ONLY, true),
  // TODO: Set external Google Form or Tally URL if using external form, else leave empty for in-app form
  registrationFormUrl: str(import.meta.env.VITE_REGISTRATION_FORM_URL, ""),
  // Registration & Submission API endpoints (aligned with users, questions, submissions tables)
  // TODO: Set your backend API endpoint for registration POST ({ name, batch, email })
  registrationEndpoint: str(import.meta.env.VITE_REGISTRATION_ENDPOINT, "/api/register"),
  // TODO: Set your backend API endpoint for fetching questions GET
  questionsEndpoint: str(import.meta.env.VITE_QUESTIONS_ENDPOINT, ""),
  // TODO: Set your backend API endpoint for project submission POST ({ question_id, user_id, github_url, readme_url })
  submissionEndpoint: str(import.meta.env.VITE_SUBMISSION_ENDPOINT, "/api/submit"),
  problemsEndpoint: str(import.meta.env.VITE_PROBLEMS_ENDPOINT, "/api/problems"),
  resultsEndpoint: str(import.meta.env.VITE_RESULTS_ENDPOINT, "/api/results"),

  // Contact & Socials
  contactEmail: str(import.meta.env.VITE_CONTACT_EMAIL, "sdc@fec.edu.bd"), // TODO
  venue: str(import.meta.env.VITE_VENUE, "FECSDC Discord Competition-Arena Channel"),
  discordInvite: str(import.meta.env.VITE_DISCORD_INVITE, "https://discord.gg/A8sHFFSQD"), // TODO

  socials: {
    github: str(import.meta.env.VITE_SOCIAL_GITHUB, "https://github.com/fecsdc"), // TODO
    discord: str(import.meta.env.VITE_SOCIAL_DISCORD, "https://discord.gg/A8sHFFSQD"), // TODO
    facebook: str(import.meta.env.VITE_SOCIAL_FACEBOOK, "https://www.facebook.com/people/Faridpur-Engineering-College-Software-Development-Club-FecSdc/61566838616344/?rdid=h4EBLcOuYruOxDdP&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1JxP4p24kL%2F"), // TODO
    linkedin: str(import.meta.env.VITE_SOCIAL_LINKEDIN, "https://linkedin.com/company/fecsdc"), // TODO
  },

  // Key stats for live countup strip
  stats: json(import.meta.env.VITE_STATS, [
    { label: "REGISTERED MEMBERS", value: 20, suffix: "+" },
    { label: "HOURS OF SPRINT", value: 6, suffix: "H" },
    { label: "CHALLENGE TRACKS", value: 2, suffix: "" },
  ]),
};
