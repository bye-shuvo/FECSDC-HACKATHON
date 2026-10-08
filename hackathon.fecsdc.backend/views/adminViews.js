function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

function safeUrlCell(value) {
  const escaped = escapeHtml(value);
  if (typeof value === "string" && /^https:\/\//i.test(value)) {
    return `<a href="${escaped}" rel="noopener noreferrer nofollow" target="_blank">${escaped}</a>`;
  }
  return escaped;
}

function renderCell(value, type) {
  if (type === "url") return safeUrlCell(value);
  if (type === "question") {
    const text = String(value ?? "");
    return escapeHtml(text.length > 180 ? `${text.slice(0, 177)}...` : text);
  }
  return escapeHtml(value);
}

function renderTable(caption, columns, rows) {
  const headers = columns
    .map((column) => `<th scope="col">${escapeHtml(column.label)}</th>`)
    .join("");
  const body = rows
    .map(
      (row) =>
        `<tr>${columns
          .map(
            (column) =>
              `<td>${column.render ? column.render(row) : renderCell(column.value(row), column.type)}</td>`,
          )
          .join("")}</tr>`,
    )
    .join("");
  return `<div class="table-wrap"><table><caption>${escapeHtml(caption)}</caption><thead><tr>${headers}</tr></thead><tbody>${body || `<tr><td colspan="${columns.length}">No records found.</td></tr>`}</tbody></table></div>`;
}

function layout(title, active, content) {
  const links = [
    ["/", "Dashboard"],
    ["/users", "Users"],
    ["/questions", "Questions"],
    ["/submissions", "Submissions"],
  ]
    .map(
      ([href, label]) =>
        `<a href="/admin${href === "/" ? "" : href}"${active === href ? ' aria-current="page"' : ""}>${label}</a>`,
    )
    .join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${escapeHtml(title)} | FECSDC ADMIN</title><style>
:root{color-scheme:dark;--bg:#0b0b0e;--panel:#141418;--text:#ededef;--muted:#a1a1aa;--line:#303038;--accent:#F47B30}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:14px/1.55 "JetBrains Mono", ui-monospace}header{position:sticky;top:0;z-index:2;background:#0b0b0e;border-bottom:1px solid var(--line)}.bar,main{width:min(1440px,100%);margin:0 auto;padding:16px 24px}.bar{display:flex;align-items:center;justify-content:space-between;gap:20px}header strong{color:var(--accent)}nav{display:flex;flex-wrap:wrap;gap:18px}a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}nav a{color:var(--text)}nav a[aria-current="page"]{color:var(--accent)}h1{font-size:22px;margin:20px 0 16px}h2{font-size:16px;margin:28px 0 10px}.metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.metric{border:1px solid var(--line);background:var(--panel);padding:14px}.metric span{display:block;color:var(--muted)}.metric strong{display:block;font-size:24px;color:var(--accent)}.table-wrap{width:100%;overflow-x:auto;border:1px solid var(--line);margin:14px 0 22px}table{width:100%;border-collapse:collapse;min-width:720px;text-align:left}caption{text-align:left;padding:12px 14px;color:var(--muted)}th,td{padding:10px 14px;border-top:1px solid var(--line);vertical-align:top}th{color:var(--accent);font-weight:600}td{overflow-wrap:anywhere}.pagination{align-items:center;justify-content:space-between;color:var(--muted);padding:4px 0 28px}.pagination a{padding:8px 0}.error,.notice{padding:14px;border:1px solid var(--line);background:var(--panel)}.notice{border-color:#486b53}.toolbar,.form-actions{display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin:12px 0}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:32px;padding:6px 12px;border:1px solid var(--accent);border-radius:4px;background:var(--accent);color:#111;font:inherit;font-weight:700;cursor:pointer;text-decoration:none}.btn:hover{background:#ff9655;text-decoration:none}.btn-outline{background:transparent;color:var(--text);border-color:var(--line)}.btn-outline:hover{border-color:var(--accent);color:var(--accent);background:transparent}.btn-danger{background:#a83232;border-color:#cf5555;color:#fff}.btn-danger:hover{background:#c34141}.btn-sm{min-height:32px;padding:4px 8px}.actions{white-space:nowrap}.field{display:grid;gap:6px;margin:16px 0;max-width:760px}.field input,.field textarea,.search input{width:100%;padding:10px;border:1px solid var(--line);border-radius:3px;background:var(--panel);color:var(--text);font:inherit}.field textarea{min-height:160px;resize:vertical}.field small{color:var(--muted)}.field .field-error{color:#ff9b9b}.search{display:flex;align-items:end;gap:10px;max-width:700px}.search label{display:grid;gap:6px;flex:1}.search input{min-width:120px}.record-form{max-width:760px}input:focus-visible,textarea:focus-visible,a:focus-visible,button:focus-visible{outline:2px solid #ffd166;outline-offset:2px}@media(pointer:coarse){.btn,.btn-sm{min-height:44px}}@media(max-width:640px){.bar,main{padding-left:14px;padding-right:14px}.bar{align-items:flex-start;flex-direction:column}.metrics{grid-template-columns:1fr}.pagination{gap:12px;align-items:flex-start;flex-direction:column}.search{align-items:stretch;flex-direction:column}}
</style></head><body><header><div class="bar"><strong>FECSDC · Admin</strong><nav aria-label="Admin">${links}</nav></div></header><main><h1>${escapeHtml(title)}</h1>${content}</main></body></html>`;
}

function renderDashboard(counts, users, submissions) {
  const metrics = `<section class="metrics" aria-label="Totals">${[
    ["Users", counts.users],
    ["Submissions", counts.submissions],
    ["Questions", counts.questions],
  ]
    .map(
      ([label, count]) =>
        `<a class="metric" href="/admin/${label.toLowerCase()}"><span>${label}</span><strong>${escapeHtml(count)}</strong></a>`,
    )
    .join("")}</section>`;
  const latestUsers = renderTable(
    "Latest users",
    [
      { label: "ID", value: (row) => row.id },
      { label: "Name", value: (row) => row.name },
      { label: "Email", value: (row) => row.email },
      { label: "Registered at", value: (row) => row.created_at },
    ],
    users,
  );
  const latestSubmissions = renderTable(
    "Latest submissions",
    [
      { label: "ID", value: (row) => row.id },
      { label: "User", value: (row) => `${row.user_id} · ${row.user_name}` },
      {
        label: "Question",
        value: (row) => `${row.question_id} · ${row.category}`,
      },
      { label: "Submitted at", value: (row) => row.created_at },
    ],
    submissions,
  );
  return layout(
    "Dashboard",
    "/",
    `${metrics}<div class="toolbar"><a class="btn" href="/admin/users/new">+ Add user</a><a class="btn" href="/admin/questions/new">+ Add question</a><a class="btn" href="/admin/submissions/new">+ Add submission</a></div><h2>Recent activity</h2>${latestUsers}${latestSubmissions}`,
  );
}

function renderNotFound() {
  return layout("Not found", "", '<p class="error">Admin page not found.</p>');
}

function renderError() {
  return layout(
    "Server error",
    "",
    '<p class="error">Unable to load this page.</p>',
  );
}

module.exports = {
  escapeHtml,
  renderDashboard,
  renderLayout: layout,
  renderNotFound,
  renderError,
};
