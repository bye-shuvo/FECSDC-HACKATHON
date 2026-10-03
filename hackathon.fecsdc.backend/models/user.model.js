async function getUserByEmail(db, email) {
  const result = await db.execute('SELECT id, name, email FROM users WHERE email = ?', [email]);
  return result.rows?.[0] || null;
}

async function getUserById(db, id) {
  const result = await db.execute('SELECT id FROM users WHERE id = ?', [id]);
  return result.rows?.[0] || null;
}

async function createUser(db, {id, name, email, batch }) {
  const result = await db.execute('INSERT INTO users (id, name, email, batch) VALUES (?, ?, ?, ?)', [id, name, email, batch]);
  return { id, name, email, batch };
}

module.exports = { getUserByEmail, getUserById, createUser };
