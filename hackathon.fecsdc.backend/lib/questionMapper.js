'use strict';

function parseDetails(raw) {
  if (raw == null) return {};
  if (typeof raw === 'object') return raw; // MySQL native JSON (mysql2 parses it)
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

const strArr = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []);

function mapQuestion(row) {
  if (!row) return null;
  const d = parseDetails(row.details);
  const text = row.question_text ?? row.description ?? '';
  return {
    // existing keys (Submit dropdown, admin, old clients)
    id: row.id,
    category: row.category,
    question_text: text,
    score: row.score,
    created_at: row.created_at,
    // problem page keys
    title: text,
    track: row.category,
    points: row.score,
    difficulty: d.difficulty ?? '',
    summary: d.summary ?? '',
    statement: d.statement ?? '',
    constraints: strArr(d.constraints),
    deliverables: strArr(d.deliverables),
    judging: Array.isArray(d.judging)
      ? d.judging
          .filter((j) => j && typeof j.label === 'string')
          .map((j) => ({ label: j.label, weight: Number(j.weight) || 0 }))
      : [],
  };
}

module.exports = { mapQuestion, parseDetails };
