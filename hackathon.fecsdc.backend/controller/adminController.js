const { getDatabase } = require('../config/config');
const views = require('../views/adminViews');

function csvCell(value) {
  let text = String(value ?? '');
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function sendCsv(res, filename, headers, rows) {
  const body = [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
  res.set('Content-Disposition', `attachment; filename="${filename}"`);
  res.set('Content-Type', 'text/csv; charset=utf-8').send(body);
}

async function dashboard(req, res) {
  const db = getDatabase();
  const [users, submissions, questions, latestUsers, latestSubmissions] = await Promise.all([
    db.execute('SELECT COUNT(*) AS total FROM users'),
    db.execute('SELECT COUNT(*) AS total FROM submissions'),
    db.execute('SELECT COUNT(*) AS total FROM questions'),
    db.execute('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 5'),
    db.execute('SELECT s.id, s.user_id, u.name AS user_name, s.question_id, q.category, s.created_at FROM submissions s JOIN users u ON u.id = s.user_id JOIN questions q ON q.id = s.question_id ORDER BY s.created_at DESC LIMIT 5'),
  ]);
  res.type('html').send(views.renderDashboard({
    users: users.rows[0].total,
    submissions: submissions.rows[0].total,
    questions: questions.rows[0].total,
  }, latestUsers.rows, latestSubmissions.rows));
}

function notFound(req, res) {
  res.status(404).type('html').send(views.renderNotFound());
}

function handleError(error, req, res, next) {
  const trace = typeof error?.stack === 'string'
    ? error.stack.split('\n').slice(1).join('\n')
    : 'stack unavailable';
  console.error(`[admin] request failed\n${trace}`);
  if (res.headersSent) {
    res.end();
    return;
  }
  res.status(500).type('html').send(views.renderError());
}

module.exports = { dashboard, sendCsv, notFound, handleError };