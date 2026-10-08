'use strict';

const { escapeHtml, renderLayout } = require('./adminViews');

const resources = {
  users: {
    title: 'Users',
    label: 'user',
    columns: [
      ['ID', (row) => row.id], ['Name', (row) => row.name],
      ['HackerRank', (row) => row.hackerrank_username], ['Batch', (row) => row.batch],
      ['Email', (row) => row.email], ['Created', (row) => row.created_at],
      ['Submissions', (row) => row.submission_count],
    ],
  },
  questions: {
    title: 'Questions',
    label: 'question',
    columns: [
      ['ID', (row) => row.id], ['Category', (row) => row.category],
      ['Question', (row) => row.question_text, 'question'], ['Score', (row) => row.score],
      ['Submissions', (row) => row.submission_count], ['Created', (row) => row.created_at],
    ],
  },
  submissions: {
    title: 'Submissions',
    label: 'submission',
    columns: [
      ['ID', (row) => row.id], ['User', (row) => `${row.user_id} · ${row.user_name}`],
      ['Question', (row) => `${row.question_id} · ${row.category}`],
      ['GitHub', (row) => row.github_url, 'url'], ['README', (row) => row.readme_url, 'url'],
      ['Created', (row) => row.created_at],
    ],
  },
};

const formFields = {
  users: [
    { name: 'id', label: 'ID', type: 'number', createOnly: true, help: 'Positive integer, up to 2147483647.' },
    { name: 'name', label: 'Name', type: 'text', required: true, maxLength: 100 },
    { name: 'hackerrank_username', label: 'HackerRank username', type: 'text', required: true, maxLength: 30 },
    { name: 'batch', label: 'Batch', type: 'number', required: true, min: 1, max: 9999 },
    { name: 'email', label: 'Email', type: 'email', required: true, maxLength: 255 },
  ],
  questions: [
    { name: 'category', label: 'Category', type: 'text', required: true, maxLength: 100 },
    { name: 'question_text', label: 'Question text', type: 'textarea', required: true, maxLength: 20000 },
    { name: 'details', label: 'Details', type: 'textarea', required: false, maxLength: 20480, help: 'Optional JSON object (up to 20 KB) with difficulty, summary, statement, constraints, deliverables, judging.' },
    { name: 'score', label: 'Score', type: 'number', required: true, min: 0, max: 100000 },
  ],
  submissions: [
    { name: 'question_id', label: 'Question ID', type: 'number', required: true, min: 1, max: 2147483647 },
    { name: 'user_id', label: 'User ID', type: 'number', required: true, min: 1, max: 2147483647 },
    { name: 'github_url', label: 'GitHub URL', type: 'url', required: true, maxLength: 2048 },
    { name: 'readme_url', label: 'README URL', type: 'url', required: true, maxLength: 2048 },
  ],
};

function safeUrl(value) {
  const escaped = escapeHtml(value);
  if (typeof value === 'string' && /^https:\/\//i.test(value)) {
    return `<a href="${escaped}" rel="noopener noreferrer nofollow" target="_blank">${escaped}</a>`;
  }
  return escaped;
}

function flashMessage(code) {
  const messages = { created: 'Record created.', updated: 'Changes saved.', deleted: 'Record deleted.' };
  return messages[code] ? `<p class="notice" role="status">${messages[code]}</p>` : '';
}

function renderList(kind, rows, pagination, message) {
  const resource = resources[kind];
  const base = `/admin/${kind}`;
  const headers = resource.columns.map(([label]) => `<th scope="col">${escapeHtml(label)}</th>`).join('');
  const tableRows = rows.map((row) => {
    const id = String(row.id);
    const cells = resource.columns.map(([label, getValue]) => {
      const value = getValue(row);
      const type = resource.columns.find((column) => column[0] === label)?.[2];
      const text = type === 'question' ? String(value ?? '') : value;
      const output = type === 'url' ? safeUrl(value) : type === 'question' ? escapeHtml(text.length > 180 ? `${text.slice(0, 177)}...` : text) : escapeHtml(value);
      return `<td>${output}</td>`;
    }).join('');
    const encodedId = encodeURIComponent(id);
    return `<tr>${cells}<td class="actions"><a class="btn btn-outline btn-sm" href="${base}/${encodedId}/edit" aria-label="Edit ${resource.label} ${escapeHtml(id)}">Edit</a><a class="btn btn-danger btn-sm" href="${base}/${encodedId}/delete" aria-label="Delete ${resource.label} ${escapeHtml(id)}">Delete</a></td></tr>`;
  }).join('');
  const query = new URLSearchParams({ page: String(pagination.page), limit: String(pagination.limit) });
  if (pagination.query) query.set('q', pagination.query);
  const pageCount = Math.max(1, Math.ceil(pagination.total / pagination.limit));
  const pageLink = (page, label) => {
    const params = new URLSearchParams(query);
    params.set('page', String(page));
    return `<a class="btn btn-outline btn-sm" href="${base}?${escapeHtml(params.toString())}">${label}</a>`;
  };
  const clear = pagination.query ? `<a class="btn btn-outline" href="${base}">Clear</a>` : '';
  const search = `<form class="search" method="get" action="${base}"><label for="q">Search</label><input id="q" name="q" type="search" maxlength="200" value="${escapeHtml(pagination.query)}"><input type="hidden" name="limit" value="${pagination.limit}"><button class="btn btn-outline" type="submit">Search</button>${clear}</form>`;
  const content = `${flashMessage(message)}<div class="toolbar"><a class="btn" href="${base}/new" aria-label="Add ${resource.label}">+ Add ${resource.label}</a></div>${search}<div class="table-wrap"><table><caption>${escapeHtml(resource.title)}</caption><thead><tr>${headers}<th scope="col">Actions</th></tr></thead><tbody>${tableRows || `<tr><td colspan="${resource.columns.length + 1}">No records found.</td></tr>`}</tbody></table></div><nav class="pagination" aria-label="Pagination">${pagination.page > 1 ? pageLink(pagination.page - 1, 'Previous') : '<span></span>'}<span>Page ${pagination.page} of ${pageCount} · ${pagination.total} total</span>${pagination.page < pageCount ? pageLink(pagination.page + 1, 'Next') : '<span></span>'}</nav>`;
  return renderLayout(resource.title, `/${kind}`, content);
}

function renderForm(kind, values, errors, csrfToken, options = {}) {
  const resource = resources[kind];
  const creating = options.mode === 'create';
  const fields = formFields[kind].filter((field) => creating || !field.createOnly);
  const inputs = fields.map((field) => {
    const id = `field-${field.name}`;
    const error = errors[field.name];
    const describedBy = error ? ` aria-describedby="${id}-error"` : '';
    const invalid = error ? ' aria-invalid="true"' : '';
    const rawVal = values[field.name];
    const textVal = typeof rawVal === 'object' && rawVal !== null
      ? JSON.stringify(rawVal, null, 2)
      : (rawVal ?? '');
    const common = `id="${id}" name="${field.name}" type="${field.type}" value="${escapeHtml(textVal)}"${field.required ? ' required' : ''}${field.maxLength ? ` maxlength="${field.maxLength}"` : ''}${field.min !== undefined ? ` min="${field.min}"` : ''}${field.max !== undefined ? ` max="${field.max}"` : ''}${invalid}${describedBy}`;
    const control = field.type === 'textarea'
      ? `<textarea id="${id}" name="${field.name}"${field.maxLength ? ` maxlength="${field.maxLength}"` : ''}${field.required ? ' required' : ''}${invalid}${describedBy}>${escapeHtml(textVal)}</textarea>`
      : `<input ${common}>`;
    const help = field.help ? `<small>${escapeHtml(field.help)}</small>` : '';
    const errorHtml = error ? `<small class="field-error" id="${id}-error">${escapeHtml(error)}</small>` : '';
    return `<div class="field"><label for="${id}">${escapeHtml(field.label)}${field.required ? ' <span aria-hidden="true">*</span>' : ''}</label>${control}${help}${errorHtml}</div>`;
  }).join('');
  const id = options.id === undefined ? '' : `/${encodeURIComponent(String(options.id))}`;
  const action = creating ? `/admin/${kind}` : `/admin/${kind}${id}`;
  const title = `${creating ? 'Create' : 'Edit'} ${resource.label}`;
  const alert = errors._form ? `<p class="error" role="alert">${escapeHtml(errors._form)}</p>` : '';
  const content = `${alert}<form class="record-form" method="post" action="${action}"><input type="hidden" name="_csrf" value="${escapeHtml(csrfToken)}">${!creating && kind === 'users' ? `<div class="field"><label for="record-id">ID</label><input id="record-id" type="number" value="${escapeHtml(options.id)}" readonly></div>` : ''}${inputs}<div class="form-actions"><button class="btn" type="submit">${creating ? 'Create' : 'Save changes'}</button><a class="btn btn-outline" href="/admin/${kind}">Cancel</a></div></form>`;
  return renderLayout(title, `/${kind}`, content);
}

function renderDeleteConfirm(kind, row, count, csrfToken, errorMessage = '') {
  const resource = resources[kind];
  const id = String(row.id);
  const encodedId = encodeURIComponent(id);
  let warning = `Delete ${resource.label} ${escapeHtml(id)}? This cannot be undone.`;
  if (kind === 'users') warning = `Deleting this user will also delete ${escapeHtml(count)} submission(s) by cascade.`;
  if (kind === 'questions') warning = `${escapeHtml(count)} submission(s) reference this question. Deletion is blocked while any remain.`;
  const details = kind === 'users'
    ? `<p><strong>${escapeHtml(row.name)}</strong> · ${escapeHtml(row.email)}</p>`
    : kind === 'questions'
      ? `<p><strong>${escapeHtml(row.category)}</strong> · ${escapeHtml(row.score)} points</p>`
      : `<p>Submission ${escapeHtml(id)} · user ${escapeHtml(row.user_id)} · question ${escapeHtml(row.question_id)}</p>`;
  const content = `${errorMessage ? `<p class="error" role="alert">${escapeHtml(errorMessage)}</p>` : ''}<p>${warning}</p>${details}<form class="form-actions" method="post" action="/admin/${kind}/${encodedId}/delete"><input type="hidden" name="_csrf" value="${escapeHtml(csrfToken)}"><button class="btn btn-danger" type="submit">Delete permanently</button><a class="btn btn-outline" href="/admin/${kind}">Cancel</a></form>`;
  return renderLayout(`Delete ${resource.label}`, `/${kind}`, content);
}

function renderMessage(title, message) {
  return renderLayout(title, '', `<p class="error" role="alert">${escapeHtml(message)}</p><p><a class="btn btn-outline" href="/admin/users">Users</a></p>`);
}

function renderNotFound() {
  return renderMessage('Not found', 'Admin page not found.');
}

function renderError() {
  return renderMessage('Server error', 'Unable to complete this request.');
}

module.exports = { renderList, renderForm, renderDeleteConfirm, renderMessage, renderNotFound, renderError };
