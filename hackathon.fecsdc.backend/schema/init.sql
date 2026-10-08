CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  question_text TEXT NOT NULL, -- question_title
  details JSON NULL,  -- difficulty, summary, statement, constraints[], deliverables[], judging[{label,weight}]
  score INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  hackerrank_username VARCHAR(30) NOT NULL,
  batch INT NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  user_id INT NOT NULL,
  github_url VARCHAR(2048) NOT NULL,
  readme_url VARCHAR(2048) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX submissions_question_id_idx (question_id),
  INDEX submissions_user_id_idx (user_id),
  CONSTRAINT submissions_question_fk FOREIGN KEY (question_id) REFERENCES questions(id),
  CONSTRAINT submissions_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
