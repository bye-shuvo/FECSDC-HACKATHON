async function getQuestions(db) {
	const result = await db.execute(
		'SELECT id, category, question_text AS description, score, created_at FROM questions ORDER BY id'
	);
	return result.rows || [];
}

async function getQuestionById(db, id) {
	const result = await db.execute(
		'SELECT id, category, question_text AS description, score, created_at FROM questions WHERE id = ?',
		[id]
	);
	return result.rows?.[0] || null;
}

module.exports = { getQuestions, getQuestionById };

