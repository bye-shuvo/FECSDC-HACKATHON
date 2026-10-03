/**
 * Form Validation Rules
 * Aligned with database constraints:
 * users: name VARCHAR(100) NOT NULL, batch INT NOT NULL, email VARCHAR(255) NOT NULL UNIQUE
 * submissions: user_id INT NOT NULL, github_url VARCHAR(2048), readme_url VARCHAR(2048), question_id INT
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates registration id against submissions.user_id INT NOT NULL
 * @param {string|number} id
 * @returns {string|null} Error message or null if valid
 */
export function validateId(id) {
  const raw = String(id ?? "").trim();
  if (!raw) {
    return "Registration number is required.";
  }
  if (!/^\d+$/.test(raw)) {
    return "Registration number must be a whole number.";
  }
  const numeric = Number(raw);
  if (numeric === 0 || numeric > 2147483647) {
    return "Enter a valid registration number.";
  }
  return null;
}

/**
 * Validates full name against users.name VARCHAR(100)
 * @param {string} name
 * @returns {string|null} Error message or null if valid
 */
export function validateName(name) {
  const trimmed = (name || "").trim().replace(/\s+/g, " ");
  if (!trimmed) {
    return "Name is required.";
  }
  if (trimmed.length > 100) {
    return "Name must not exceed 100 characters.";
  }
  return null;
}

/**
 * Validates batch against users.batch INT NOT NULL
 * Must be a positive integer, no decimals, no letters, max 4 digits (≤9999).
 * @param {string|number} batch
 * @returns {string|null} Error message or null if valid
 */
export function validateBatch(batch) {
  const raw = String(batch ?? "").trim();
  if (!raw) {
    return "Batch is required.";
  }
  // Reject anything that is not a pure integer string (no dot, no e, no sign)
  if (!/^\d+$/.test(raw)) {
    return "Batch must be a whole number (e.g. 13).";
  }
  const num = Number(raw);
  if (num <= 0) {
    return "Batch must be greater than 0.";
  }
  if (raw.length > 4 || num > 9999) {
    return "Batch must be at most 4 digits.";
  }
  return null;
}

/**
 * Validates email address against users.email VARCHAR(255)
 * @param {string} email
 * @returns {string|null} Error message or null if valid
 */
export function validateEmail(email) {
  const trimmed = (email || "").trim().toLowerCase();
  if (!trimmed) {
    return "Email address is required.";
  }
  if (trimmed.length > 255) {
    return "Email must not exceed 255 characters.";
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return "Enter a valid email address.";
  }
  return null;
}

/**
 * Validates GitHub URL against submissions.github_url VARCHAR(2048)
 * Must start with https://, be a valid URL, host github.com, max 2048 chars.
 * @param {string} url
 * @returns {string|null} Error message or null if valid
 */
export function validateGithubUrl(url) {
  const trimmed = (url || "").trim();
  if (!trimmed) {
    return "GitHub repository URL is required.";
  }
  if (trimmed.length > 2048) {
    return "URL must not exceed 2048 characters.";
  }
  if (!trimmed.startsWith("https://")) {
    return "URL must start with https://";
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    if (host !== "github.com" && host !== "www.github.com") {
      return "URL host must be github.com";
    }
    // Path should contain at least owner/repo
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    if (pathParts.length < 2) {
      return "Provide a direct repository link (e.g. https://github.com/org/repo).";
    }
  } catch {
    return "Enter a valid repository URL.";
  }

  return null;
}

/**
 * Validates Readme URL against submissions.readme_url VARCHAR(2048)
 * Must start with https://, be a valid URL, max 2048 chars.
 * @param {string} url
 * @returns {string|null} Error message or null if valid
 */
export function validateReadmeUrl(url) {
  const trimmed = (url || "").trim();
  if (!trimmed) {
    return "README or documentation URL is required.";
  }
  if (trimmed.length > 2048) {
    return "URL must not exceed 2048 characters.";
  }
  if (!trimmed.startsWith("https://")) {
    return "URL must start with https://";
  }

  try {
    new URL(trimmed);
  } catch {
    return "Enter a valid documentation URL.";
  }

  return null;
}

/**
 * Validates question selection against submissions.question_id INT
 * @param {number|string} id
 * @returns {string|null} Error message or null if valid
 */
export function validateQuestionId(id) {
  if (!id) {
    return "Please select a challenge question.";
  }
  const numeric = Number(id);
  if (!Number.isInteger(numeric) || numeric <= 0) {
    return "Please select a valid challenge question.";
  }
  return null;
}
