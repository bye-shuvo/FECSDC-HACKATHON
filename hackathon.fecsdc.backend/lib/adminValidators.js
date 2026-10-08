'use strict';

const INT_MAX = 2147483647;

function textValue(value) {
  return typeof value === 'string' ? value : '';
}

function parseInteger(value, minimum, maximum) {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum ? parsed : null;
}

function validate(body, fields, allowedFields) {
  const input = body && typeof body === 'object' ? body : {};
  const values = {};
  const errors = {};

  for (const key of Object.keys(input)) {
    if (!allowedFields.includes(key) && key !== '_csrf') errors._form = 'Unexpected field.';
  }

  for (const field of fields) {
    values[field.name] = textValue(input[field.name]);
    const value = values[field.name];
    if (field.normalize) values[field.name] = field.normalize(value);
    const normalized = values[field.name];

    if (field.required && !normalized.trim()) {
      errors[field.name] = field.requiredMessage || 'This field is required.';
      continue;
    }
    if (!normalized && !field.required) continue;
    if (field.maxLength && normalized.length > field.maxLength) {
      errors[field.name] = `Must be ${field.maxLength} characters or fewer.`;
      continue;
    }
    if (field.integer) {
      const number = parseInteger(normalized, field.minimum, field.maximum);
      if (number === null) {
        errors[field.name] = field.integerMessage || `Enter an integer from ${field.minimum} to ${field.maximum}.`;
      } else {
        values[field.name] = number;
      }
      continue;
    }
    if (field.pattern && normalized && !field.pattern.test(normalized)) {
      errors[field.name] = field.patternMessage;
      continue;
    }
    if (field.email && normalized && !/^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i.test(normalized)) {
      errors[field.name] = 'Enter a valid email address.';
      continue;
    }
    if (field.url && normalized) {
      let parsed;
      try {
        parsed = new URL(normalized);
      } catch {
        errors[field.name] = field.urlMessage;
        continue;
      }
      if (parsed.protocol !== 'https:' || !parsed.hostname || parsed.username || parsed.password) {
        errors[field.name] = field.urlMessage;
        continue;
      }
      if (field.url === 'github' && (!['github.com', 'www.github.com'].includes(parsed.hostname.toLowerCase()) || !/^\/[^/]+\/[^/]+\/?$/.test(parsed.pathname))) {
        errors[field.name] = field.urlMessage;
      }
    }
  }

  return { values, errors, valid: Object.keys(errors).length === 0 };
}

const userFields = [
  { name: 'name', required: true, maxLength: 100, normalize: (value) => value.trim().replace(/\s+/g, ' ') },
  { name: 'hackerrank_username', required: true, maxLength: 30, pattern: /^[A-Za-z0-9_]+$/, patternMessage: 'Use only letters, numbers, and underscores.' },
  { name: 'batch', required: true, integer: true, minimum: 1, maximum: 9999 },
  { name: 'email', required: true, maxLength: 255, normalize: (value) => value.trim().toLowerCase(), email: true },
];

const questionFields = [
  { name: 'category', required: true, maxLength: 100, normalize: (value) => value.trim() },
  { name: 'question_text', required: true, maxLength: 20000, normalize: (value) => value.trim() },
  { name: 'details', required: false },
  { name: 'score', required: true, integer: true, minimum: 0, maximum: 100000 },
];

function validateDetailsJson(raw) {
  if (typeof raw !== 'string' || !raw.trim()) {
    return { valid: true, value: null };
  }
  const trimmed = raw.trim();
  if (Buffer.byteLength(trimmed, 'utf8') > 20480) {
    return { valid: false, error: 'Must be 20 KB or fewer.' };
  }
  let parsed;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return { valid: false, error: 'Must be valid JSON.' };
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { valid: false, error: 'Details must be a JSON object.' };
  }
  if (parsed.difficulty !== undefined && typeof parsed.difficulty !== 'string') {
    return { valid: false, error: 'difficulty must be a string.' };
  }
  if (parsed.summary !== undefined && typeof parsed.summary !== 'string') {
    return { valid: false, error: 'summary must be a string.' };
  }
  if (parsed.statement !== undefined && typeof parsed.statement !== 'string') {
    return { valid: false, error: 'statement must be a string.' };
  }
  if (
    parsed.constraints !== undefined &&
    (!Array.isArray(parsed.constraints) || !parsed.constraints.every((c) => typeof c === 'string'))
  ) {
    return { valid: false, error: 'constraints must be an array of strings.' };
  }
  if (
    parsed.deliverables !== undefined &&
    (!Array.isArray(parsed.deliverables) || !parsed.deliverables.every((d) => typeof d === 'string'))
  ) {
    return { valid: false, error: 'deliverables must be an array of strings.' };
  }
  if (
    parsed.judging !== undefined &&
    (!Array.isArray(parsed.judging) ||
      !parsed.judging.every(
        (j) =>
          j &&
          typeof j === 'object' &&
          !Array.isArray(j) &&
          typeof j.label === 'string' &&
          j.weight !== undefined &&
          !Number.isNaN(Number(j.weight))
      ))
  ) {
    return { valid: false, error: 'judging must be an array of { label, weight } objects.' };
  }
  return { valid: true, value: JSON.stringify(parsed) };
}

const submissionFields = [
  { name: 'question_id', required: true, integer: true, minimum: 1, maximum: INT_MAX },
  { name: 'user_id', required: true, integer: true, minimum: 1, maximum: INT_MAX },
  { name: 'github_url', required: true, maxLength: 2048, url: 'github', urlMessage: 'Enter a GitHub HTTPS URL in owner/repository form.' },
  { name: 'readme_url', required: true, maxLength: 2048, url: 'https', urlMessage: 'Enter a valid HTTPS URL.' },
];

function validateUser(body, creating) {
  const allowed = creating ? ['id', ...userFields.map((field) => field.name)] : userFields.map((field) => field.name);
  const result = validate(body, creating ? [{ name: 'id', required: true, integer: true, minimum: 1, maximum: INT_MAX }, ...userFields] : userFields, allowed);
  if (!creating) delete result.values.id;
  return result;
}

function validateQuestion(body) {
  const result = validate(body, questionFields, questionFields.map((field) => field.name));
  const rawDetails = typeof body?.details === 'string' ? body.details : '';
  const detailsValidation = validateDetailsJson(rawDetails);
  if (!detailsValidation.valid) {
    result.errors.details = detailsValidation.error;
    result.values.details = rawDetails;
    result.valid = false;
  } else if (!result.valid) {
    result.values.details = rawDetails;
  } else {
    result.values.details = detailsValidation.value;
  }
  return result;
}

function validateSubmission(body) {
  return validate(body, submissionFields, submissionFields.map((field) => field.name));
}

module.exports = { INT_MAX, parseInteger, validateUser, validateQuestion, validateSubmission };
