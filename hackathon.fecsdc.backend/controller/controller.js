const { getDatabase } = require("../config/config");
const { mapQuestion } = require("../lib/questionMapper");
const { createSubmission } = require("../models/submission.model");
const {
  createUser,
  getUserByEmail,
  getUserById,
} = require("../models/user.model");

// Boot-time validation of PROBLEMS_REVEAL_AT (fail-closed if missing or invalid)
const rawRevealAt = process.env.PROBLEMS_REVEAL_AT;
let revealTimestamp = null;

if (!rawRevealAt) {
  console.warn("[gate] WARNING: PROBLEMS_REVEAL_AT is missing. Keeping questions locked.");
} else {
  const parsed = Date.parse(rawRevealAt);
  if (Number.isNaN(parsed)) {
    console.warn(`[gate] WARNING: PROBLEMS_REVEAL_AT is invalid ('${rawRevealAt}'). Keeping questions locked.`);
  } else {
    revealTimestamp = parsed;
  }
}

function isQuestionsLocked() {
  if (revealTimestamp === null) return true;
  return Date.now() < revealTimestamp;
}

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function parseId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function isHttpsUrl(value, allowedHosts, isValidPath = () => true) {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 2048) return false;

  try {
    const url = new URL(trimmed);
    const host = url.hostname.toLowerCase();

    if (url.protocol !== "https:") return false;
    if (!allowedHosts.includes(host)) return false;

    return isValidPath(url.pathname);
  } catch {
    return false;
  }
}

const githubHosts = ["github.com", "www.github.com"];
const readmeHosts = ["github.com", "www.github.com", "raw.githubusercontent.com"];

async function home(req, res) {
  res.json({
    name: "Hackathon API",
    endpoints: [
      "GET /health",
      "POST /register",
      "GET /questions",
      "GET /question/:pk",
      "POST /submit/:pk",
    ],
  });
}

async function health(req, res) {
  res.json({ status: "ok" });
}

async function register(req, res) {

  const id = parseId(req.body?.id);
  if (!id)
    throw httpError(400, "ID is required and must be a positive integer.");

  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const hackerrankUsername =
    typeof req.body?.hackerrank_username === "string"
      ? req.body.hackerrank_username.trim()
      : "";
  const email =
    typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
  const batch = parseId(req.body?.batch);

  if (!name || name.length > 100 || !/^[A-Za-z][A-Za-z\s'._-]*$/.test(name))
    throw httpError(
      400,
      "Name must use letters, spaces, apostrophes, periods, dashes, or underscores.",
    );
  if (!hackerrankUsername || hackerrankUsername.length < 3 || hackerrankUsername.length > 30 || !/^[A-Za-z0-9_-]+$/.test(hackerrankUsername)) {
    throw httpError(
      400,
      "HackerRank username is required and must be 3-30 chars using letters, numbers, underscores, or hyphens.",
    );
  }
  if (!batch)
    throw httpError(400, "Batch is required and must be a positive integer.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
    throw httpError(400, "A valid email address is required.");
  }

  const db = getDatabase();
  if (await getUserById(db, id))
    throw httpError(409, "The user is already registered!");
  if (await getUserByEmail(db, email))
    throw httpError(409, "This email address is already registered.");

  const user = await createUser(db, { id, name, hackerrank_username: hackerrankUsername, email, batch });
  res.status(201).json({ user });
}

async function getQuestionsHandler(req, res) {
  if (isQuestionsLocked()) {
    res.set("Cache-Control", "no-store");
    return res.status(403).json({ error: "locked", revealAt: rawRevealAt || null });
  }

  const db = getDatabase();
  const result = await db.execute(
    "SELECT id, category, question_text, score, details, created_at FROM questions ORDER BY id ASC"
  );
  const rows = Array.isArray(result?.rows) ? result.rows : [];
  res.set("Cache-Control", "public, max-age=60");
  res.json({ questions: rows.map(mapQuestion) });
}

async function getQuestion(req, res) {
  if (isQuestionsLocked()) {
    res.set("Cache-Control", "no-store");
    return res.status(403).json({ error: "locked", revealAt: rawRevealAt || null });
  }

  const id = parseId(req.params.pk);
  if (!id) throw httpError(404, "Question not found.");

  const db = getDatabase();
  const result = await db.execute(
    "SELECT id, category, question_text, score, details, created_at FROM questions WHERE id = ?",
    [id]
  );
  const row = result?.rows?.[0];
  if (!row) throw httpError(404, "Question not found.");
  res.set("Cache-Control", "public, max-age=60");
  res.json({ question: mapQuestion(row) });
}

async function submitAnswer(req, res) {
  const questionId = parseId(req.params.pk);
  if (!questionId)
    throw httpError(400, "Question ID must be a positive integer.");

  const body = req.body || {};
  const githubUrl = body.githubUrl ?? body.github_url;
  const readmeUrl = body.readmeUrl ?? body.readme_url;
  const userIdValue = body.userId ?? body.user_id;

  if (
    !isHttpsUrl(
      githubUrl,
      githubHosts,
      (pathname) => {
        const parts = pathname.split("/").filter(Boolean);
        return parts.length >= 2;
      }
    )
  ) {
    throw httpError(400, "githubUrl must be an HTTPS URL on github.com.");
  }
  if (
    !isHttpsUrl(
      readmeUrl,
      readmeHosts,
      (pathname) => /(?:^|\/)README(?:\.md)?$/i.test(pathname)
    )
  ) {
    throw httpError(400, "readmeUrl must be an HTTPS GitHub README URL.");
  }

  const userId = userIdValue == null ? null : parseId(userIdValue);
  if (userIdValue == null || !userId)
    throw httpError(400, "userId must be a positive integer.");

  const db = getDatabase();
  if (!(await getUserById(db, userId)))
    throw httpError(404, "User not found.");

  const submission = await createSubmission(db, {
    questionId,
    userId,
    githubUrl,
    readmeUrl,
  });
  res.status(201).json({ submission });
}

module.exports = {
  home,
  health,
  register,
  getQuestions: getQuestionsHandler,
  getQuestion,
  submitAnswer,
};
