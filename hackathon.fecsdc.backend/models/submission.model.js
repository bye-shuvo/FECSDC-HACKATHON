async function createSubmission(db, { questionId, userId, githubUrl, readmeUrl }) {
  const result = await db.execute(
    'INSERT INTO submissions (question_id, user_id, github_url, readme_url) VALUES (?, ?, ?, ?)',
    [questionId, userId, githubUrl, readmeUrl]
  );
  return { id: result.lastInsertId, questionId, userId, githubUrl, readmeUrl };
}

module.exports = { createSubmission };
