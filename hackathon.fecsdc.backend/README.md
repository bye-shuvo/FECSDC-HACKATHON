# Hackathon FECSDC Backend

This backend powers the FECSDC hackathon application, handling participant registration, question retrieval, and solution submission for the competition.

## API Endpoints

The backend exposes the following routes:

- `GET /health` — health-check endpoint
- `POST /register` — register a participant
- `GET /questions` — fetch all questions
- `GET /question/:pk` — fetch a single question
- `POST /submit/:pk` — submit a solution for a question

## Database Initialization

On startup, the backend loads the SQL scaffold from:

```text
hackathon.fecsdc.backend/schema/init.sql
```

This script initializes tables such as users, questions, and submissions if they are not already present.

## Important Note About Ports

The frontend Vite config proxies `/api` requests to:

```text
http://localhost:4000
```