async function getUserByEmail(db, email) {
  const result = await db.execute('SELECT id, name, email FROM users WHERE email = ?', [email]);
  return result.rows?.[0] || null;
}

async function getUserById(db, id) {
  const result = await db.execute('SELECT id FROM users WHERE id = ?', [id]);
  return result.rows?.[0] || null;
}

async function createUser(db, {id, name, email, hackerrank_username, batch }) {
  const result = await db.execute('INSERT INTO users (id, name, email, hackerrank_username, batch) VALUES (?, ?, ?, ?, ?)', [id, name, email, hackerrank_username, batch]);
  return { id, name, email, hackerrank_username, batch };
}

module.exports = { getUserByEmail, getUserById, createUser };
