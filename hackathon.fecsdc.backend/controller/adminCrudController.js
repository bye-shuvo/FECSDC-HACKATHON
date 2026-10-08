"use strict";

const { getDatabase } = require("../config/config");
const validators = require("../lib/adminValidators");
const csrf = require("../middleware/adminCsrf");
const views = require("../views/adminCrudViews");
const { sendCsv } = require("./adminController");

const resourceMeta = {
  users: { table: "users", label: "user" },
  questions: { table: "questions", label: "question" },
  submissions: { table: "submissions", label: "submission" },
};

function rowsOf(result) {
  return Array.isArray(result?.rows) ? result.rows : [];
}

function insertedId(result) {
  return (
    result?.insertId ??
    result?.lastInsertId ??
    result?.result?.insertId ??
    result?.result?.lastInsertId
  );
}

function dbErrorCode(error) {
  const codes = {
    ER_DUP_ENTRY: 1062,
    ER_ROW_IS_REFERENCED_2: 1451,
    ER_NO_REFERENCED_ROW_2: 1452,
  };
  const candidates = [
    error?.errno,
    error?.code,
    error?.details?.code,
    error?.details?.errno,
    error?.details?.error_code,
    error?.cause?.code,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && Object.hasOwn(codes, candidate)) {
      return codes[candidate];
    }
    const numeric = Number(candidate);
    if (candidate !== undefined && candidate !== null && Number.isInteger(numeric)) {
      return numeric;
    }
  }
  return undefined;
}

function logAdminStack(error) {
  const trace = typeof error?.stack === "string"
    ? error.stack.split("\n").slice(1).join("\n")
    : "stack unavailable";
  console.error(`[admin] request failed\n${trace}`);
}

function escapeLike(value) {
  return `%${value.replace(/[!%_]/g, "!$&")}%`;
}

function parsePositiveId(value) {
  return validators.parseInteger(
    typeof value === "string" ? value : "",
    1,
    validators.INT_MAX,
  );
}

function logMutation(action, table, id) {
  console.info(`[admin] action=${action} table=${table} id=${id ?? "unknown"}`);
}

function sendNotFound(res) {
  res
    .status(404)
    .type("html")
    .send(
      views.renderMessage("Not found", "The requested record does not exist."),
    );
}

function sendError(res) {
  res.status(500).type("html").send(views.renderError());
}

function run(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      logAdminStack(error);
      if (!res.headersSent) sendError(res);
    }
  };
}

function pagination(req, csv = false) {
  const page =
    parsePositiveId(typeof req.query.page === "string" ? req.query.page : "") ||
    1;
  const limit = Math.min(
    parsePositiveId(
      typeof req.query.limit === "string" ? req.query.limit : "",
    ) || 50,
    csv ? 10000 : 200,
  );
  const query =
    typeof req.query.q === "string" ? req.query.q.slice(0, 200) : "";
  return {
    page,
    limit,
    query,
    offset: Math.min((page - 1) * limit, 2147483647),
    total: 0,
  };
}

const listQueries = {
  users: {
    from: "FROM users u LEFT JOIN submissions s ON s.user_id = u.id",
    search:
      "(CAST(u.id AS CHAR) LIKE ? ESCAPE '!' OR u.name LIKE ? ESCAPE '!' OR u.email LIKE ? ESCAPE '!' OR u.hackerrank_username LIKE ? ESCAPE '!')",
    count: "COUNT(DISTINCT u.id)",
    select:
      "SELECT u.id, u.name, u.hackerrank_username, u.batch, u.email, u.created_at, COUNT(s.id) AS submission_count",
    group:
      "GROUP BY u.id, u.name, u.hackerrank_username, u.batch, u.email, u.created_at",
    order: "ORDER BY u.created_at DESC",
  },
  questions: {
    from: "FROM questions q LEFT JOIN submissions s ON s.question_id = q.id",
    search:
      "(q.category LIKE ? ESCAPE '!' OR q.question_text LIKE ? ESCAPE '!')",
    count: "COUNT(DISTINCT q.id)",
    select:
      "SELECT q.id, q.category, q.question_text, q.score, q.created_at, COUNT(s.id) AS submission_count",
    group: "GROUP BY q.id, q.category, q.question_text, q.score, q.created_at",
    order: "ORDER BY q.created_at DESC",
  },
  submissions: {
    from: "FROM submissions s JOIN users u ON u.id = s.user_id JOIN questions q ON q.id = s.question_id",
    search:
      "(u.name LIKE ? ESCAPE '!' OR u.email LIKE ? ESCAPE '!' OR s.github_url LIKE ? ESCAPE '!' OR q.category LIKE ? ESCAPE '!')",
    count: "COUNT(*)",
    select:
      "SELECT s.id, s.question_id, s.user_id, s.github_url, s.readme_url, s.created_at, u.name AS user_name, q.category",
    group: "",
    order: "ORDER BY s.created_at DESC",
  },
};

function list(kind) {
  return run(async (req, res) => {
    const config = listQueries[kind];
    const csv = req.query.format === "csv";
    const page = pagination(req, csv);
    const where = page.query ? ` WHERE ${config.search}` : "";
    const filterCount = kind === "users" ? 4 : kind === "questions" ? 2 : 4;
    const filters = page.query
      ? Array(filterCount).fill(escapeLike(page.query))
      : [];
    const db = getDatabase();
    const totalResult = await db.execute(
      `SELECT ${config.count} AS total ${config.from}${where}`,
      filters,
    );
    page.total = Number(rowsOf(totalResult)[0]?.total) || 0;
    if (csv && kind === "submissions") {
      const result = await db.execute(
        `SELECT s.id, s.user_id, u.name AS user_name, s.question_id, q.category, q.question_text, s.github_url, s.readme_url, s.created_at ${config.from}${where} ${config.order} LIMIT ? OFFSET ?`,
        [...filters, page.limit, page.offset],
      );
      sendCsv(
        res,
        "admin-submissions.csv",
        [
          "id",
          "user_id",
          "user_name",
          "question_id",
          "category",
          "question_text",
          "github_url",
          "readme_url",
          "submitted_at",
        ],
        rowsOf(result).map((row) => [
          row.id,
          row.user_id,
          row.user_name,
          row.question_id,
          row.category,
          row.question_text,
          row.github_url,
          row.readme_url,
          row.created_at,
        ]),
      );
      return;
    }
    const result = await db.execute(
      `${config.select} ${config.from}${where} ${config.group} ${config.order} LIMIT ? OFFSET ?`,
      [...filters, page.limit, page.offset],
    );
    if (csv && kind === "users") {
      sendCsv(
        res,
        "admin-users.csv",
        [
          "id",
          "name",
          "hackerrank_username",
          "batch",
          "email",
          "registered_at",
          "submission_count",
        ],
        rowsOf(result).map((row) => [
          row.id,
          row.name,
          row.hackerrank_username,
          row.batch,
          row.email,
          row.created_at,
          row.submission_count,
        ]),
      );
      return;
    }
    if (csv && kind === "questions") {
      sendCsv(
        res,
        "admin-questions.csv",
        [
          "id",
          "category",
          "question_text",
          "score",
          "created_at",
          "submission_count",
        ],
        rowsOf(result).map((row) => [
          row.id,
          row.category,
          row.question_text,
          row.score,
          row.created_at,
          row.submission_count,
        ]),
      );
      return;
    }
    const message = typeof req.query.msg === "string" ? req.query.msg : "";
    res
      .type("html")
      .send(views.renderList(kind, rowsOf(result), page, message));
  });
}

function newForm(kind) {
  return run(async (_req, res) => {
    const action = csrf.actionFor(kind, "create");
    res
      .type("html")
      .send(
        views.renderForm(kind, {}, {}, csrf.makeToken(action), {
          mode: "create",
        }),
      );
  });
}

function findRecord(kind, id) {
  const queries = {
    users:
      "SELECT id, name, hackerrank_username, batch, email, created_at FROM users WHERE id = ?",
    questions:
      "SELECT id, category, question_text, score, details, created_at FROM questions WHERE id = ?",
    submissions:
      "SELECT s.id, s.question_id, s.user_id, s.github_url, s.readme_url, s.created_at FROM submissions s WHERE s.id = ?",
  };
  return getDatabase()
    .execute(queries[kind], [id])
    .then((result) => rowsOf(result)[0] || null);
}

function editForm(kind) {
  return run(async (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (!id) return sendNotFound(res);
    const row = await findRecord(kind, id);
    if (!row) return sendNotFound(res);
    const action = csrf.actionFor(kind, "update", id);
    res
      .type("html")
      .send(
        views.renderForm(kind, row, {}, csrf.makeToken(action), {
          mode: "edit",
          id,
        }),
      );
  });
}

async function userDuplicateFields(db, values, creating) {
  const errors = {};
  const result = creating
    ? await db.execute(
        "SELECT id, email FROM users WHERE id = ? OR email = ?",
        [values.id, values.email],
      )
    : await db.execute(
        "SELECT id, email FROM users WHERE email = ? AND id <> ?",
        [values.email, values.id],
      );
  for (const row of rowsOf(result)) {
    if (creating && Number(row.id) === Number(values.id))
      errors.id = "This ID is already in use.";
    if (String(row.email).toLowerCase() === String(values.email).toLowerCase())
      errors.email = "This email is already in use.";
  }
  if (!Object.keys(errors).length)
    errors.email = "This value conflicts with an existing user.";
  return errors;
}

async function referenceErrors(db, values) {
  const errors = {};
  const [users, questions] = await Promise.all([
    db.execute("SELECT id FROM users WHERE id = ?", [values.user_id]),
    db.execute("SELECT id FROM questions WHERE id = ?", [values.question_id]),
  ]);
  if (!rowsOf(users).length) errors.user_id = "No such user/question";
  if (!rowsOf(questions).length) errors.question_id = "No such user/question";
  return errors;
}

function renderInvalid(
  res,
  kind,
  values,
  errors,
  token,
  mode,
  id,
  status = 422,
) {
  res
    .status(status)
    .type("html")
    .send(views.renderForm(kind, values, errors, token, { mode, id }));
}

function create(kind) {
  return run(async (req, res) => {
    const creating = true;
    const validation =
      kind === "users"
        ? validators.validateUser(req.body ?? {}, creating)
        : kind === "questions"
          ? validators.validateQuestion(req.body ?? {})
          : validators.validateSubmission(req.body ?? {});
    const token = csrf.makeToken(csrf.actionFor(kind, "create"));
    if (!validation.valid)
      return renderInvalid(
        res,
        kind,
        validation.values,
        validation.errors,
        token,
        "create",
      );

    const db = getDatabase();
    const values = validation.values;
    try {
      if (kind === "users") {
        await db.execute(
          "INSERT INTO users (id, name, hackerrank_username, batch, email) VALUES (?, ?, ?, ?, ?)",
          [
            values.id,
            values.name,
            values.hackerrank_username,
            values.batch,
            values.email,
          ],
        );
        logMutation("create", "users", values.id);
      } else if (kind === "questions") {
        const result = await db.execute(
          "INSERT INTO questions (category, question_text, score, details) VALUES (?, ?, ?, ?)",
          [values.category, values.question_text, values.score, values.details],
        );
        logMutation("create", "questions", insertedId(result));
      } else {
        const missing = await referenceErrors(db, values);
        if (Object.keys(missing).length)
          return renderInvalid(res, kind, values, missing, token, "create");
        const result = await db.execute(
          "INSERT INTO submissions (question_id, user_id, github_url, readme_url) VALUES (?, ?, ?, ?)",
          [
            values.question_id,
            values.user_id,
            values.github_url,
            values.readme_url,
          ],
        );
        logMutation("create", "submissions", insertedId(result));
      }
    } catch (error) {
      if (kind === "users" && dbErrorCode(error) === 1062) {
        return renderInvalid(
          res,
          kind,
          values,
          await userDuplicateFields(db, values, creating),
          token,
          "create",
          undefined,
          409,
        );
      }
      if (kind === "submissions" && dbErrorCode(error) === 1452) {
        const errors = await referenceErrors(db, values);
        return renderInvalid(
          res,
          kind,
          values,
          Object.keys(errors).length
            ? errors
            : { user_id: "No such user/question." },
          token,
          "create",
        );
      }
      throw error;
    }
    res.redirect(303, `/admin/${kind}?msg=created`);
  });
}

function update(kind) {
  return run(async (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (!id) return sendNotFound(res);
    const existing = await findRecord(kind, id);
    if (!existing) return sendNotFound(res);
    const validation =
      kind === "users"
        ? validators.validateUser(req.body ?? {}, false)
        : kind === "questions"
          ? validators.validateQuestion(req.body ?? {})
          : validators.validateSubmission(req.body ?? {});
    const token = csrf.makeToken(csrf.actionFor(kind, "update", id));
    if (!validation.valid)
      return renderInvalid(
        res,
        kind,
        validation.values,
        validation.errors,
        token,
        "edit",
        id,
      );

    const db = getDatabase();
    const values = validation.values;
    try {
      if (kind === "users") {
        values.id = id;
        await db.execute(
          "UPDATE users SET name = ?, hackerrank_username = ?, batch = ?, email = ? WHERE id = ?",
          [
            values.name,
            values.hackerrank_username,
            values.batch,
            values.email,
            id,
          ],
        );
        logMutation("update", "users", id);
      } else if (kind === "questions") {
        await db.execute(
          "UPDATE questions SET category = ?, question_text = ?, score = ?, details = ? WHERE id = ?",
          [values.category, values.question_text, values.score, values.details, id],
        );
        logMutation("update", "questions", id);
      } else {
        const missing = await referenceErrors(db, values);
        if (Object.keys(missing).length)
          return renderInvalid(res, kind, values, missing, token, "edit", id);
        await db.execute(
          "UPDATE submissions SET question_id = ?, user_id = ?, github_url = ?, readme_url = ? WHERE id = ?",
          [
            values.question_id,
            values.user_id,
            values.github_url,
            values.readme_url,
            id,
          ],
        );
        logMutation("update", "submissions", id);
      }
    } catch (error) {
      if (kind === "users" && dbErrorCode(error) === 1062) {
        return renderInvalid(
          res,
          kind,
          values,
          await userDuplicateFields(db, values, false),
          token,
          "edit",
          id,
          409,
        );
      }
      if (kind === "submissions" && dbErrorCode(error) === 1452) {
        const errors = await referenceErrors(db, values);
        return renderInvalid(
          res,
          kind,
          values,
          Object.keys(errors).length
            ? errors
            : { user_id: "No such user/question." },
          token,
          "edit",
          id,
        );
      }
      throw error;
    }
    res.redirect(303, `/admin/${kind}?msg=updated`);
  });
}

async function submissionCount(db, column, id) {
  const allowedColumn = column === "user_id" ? "user_id" : "question_id";
  const result = await db.execute(
    `SELECT COUNT(*) AS total FROM submissions WHERE ${allowedColumn} = ?`,
    [id],
  );
  return Number(rowsOf(result)[0]?.total) || 0;
}

function deleteConfirm(kind) {
  return run(async (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (!id) return sendNotFound(res);
    const row = await findRecord(kind, id);
    if (!row) return sendNotFound(res);
    const db = getDatabase();
    const count =
      kind === "users"
        ? await submissionCount(db, "user_id", id)
        : kind === "questions"
          ? await submissionCount(db, "question_id", id)
          : 0;
    const token = csrf.makeToken(csrf.actionFor(kind, "delete", id));
    res.type("html").send(views.renderDeleteConfirm(kind, row, count, token));
  });
}

function remove(kind) {
  return run(async (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (!id) return sendNotFound(res);
    const existing = await findRecord(kind, id);
    if (!existing) return sendNotFound(res);
    const db = getDatabase();
    const query = {
      users: "DELETE FROM users WHERE id = ?",
      questions: "DELETE FROM questions WHERE id = ?",
      submissions: "DELETE FROM submissions WHERE id = ?",
    }[kind];
    try {
      await db.execute(query, [id]);
    } catch (error) {
      if (kind === "questions" && dbErrorCode(error) === 1451) {
        const count = await submissionCount(db, "question_id", id);
        const token = csrf.makeToken(csrf.actionFor(kind, "delete", id));
        return res
          .status(409)
          .type("html")
          .send(
            views.renderDeleteConfirm(
              kind,
              existing,
              count,
              token,
              "This question has submissions. Delete or reassign them first.",
            ),
          );
      }
      throw error;
    }
    logMutation("delete", resourceMeta[kind].table, id);
    res.redirect(303, `/admin/${kind}?msg=deleted`);
  });
}

module.exports = {
  list,
  newForm,
  editForm,
  create,
  update,
  deleteConfirm,
  remove,
  dbErrorCode,
  notFound: (_req, res) =>
    res.status(404).type("html").send(views.renderNotFound()),
  handleError: (_error, _req, res, _next) => {
    console.error("Admin CRUD request failed");
    if (!res.headersSent) sendError(res);
  },
};
