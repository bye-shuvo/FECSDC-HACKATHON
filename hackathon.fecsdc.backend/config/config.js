const fs = require('node:fs');
const path = require('node:path');
const { connect } = require('@tidbcloud/serverless');

let client;

function getDatabase() {
  if (client) return client;

  const url = process.env.TIDB_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) {
    throw new Error('Set TIDB_DATABASE_URL to the TiDB Cloud connection URL.');
  }

  client = connect({ url, fullResult: true });
  return client;
}

async function initializeDatabase() {
  const db = getDatabase();
  const schemaPath = path.join(__dirname, '..', 'schema', 'init.sql');

  if (!fs.existsSync(schemaPath)) {
    return db;
  }

  const sql = fs.readFileSync(schemaPath, 'utf8');
  const statements = sql
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await db.execute(statement);
  }

  return db;
}

module.exports = { getDatabase, initializeDatabase };
