# FEC SDC Hackathon Project

This project is a full-stack hackathon website for FEC SDC, combining a polished event landing experience with a backend for registrations, challenge data, and participant submissions. The frontend is built with React and Vite, while the backend provides the API layer and database integration needed to support the contest workflow.

## Site Map

```text
/
├── Home
├── Hackathon Overview
├── Tracks & Challenges
├── Problem Statements
├── Registration
├── Sponsors
├── FAQ
├── Results
└── Contact / Socials
```

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, TypeScript
- Backend: Node.js, Express
- Database: TiDB Cloud via `@tidbcloud/serverless`
- Runtime tooling: npm, nodemon

## Project Structure

```text
fecsdc-hackathon/
├── README.md
├── hackathon.fecsdc.backend/
│   ├── config/
│   │   └── config.js
│   ├── controller/
│   │   └── controller.js
│   ├── models/
│   │   ├── question.model.js
│   │   ├── submission.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   └── router.js
│   ├── schema/
│   │   └── init.sql
│   ├── .env.example (optional, if added locally)
│   ├── index.js
│   └── package.json
├── hackathon.fecsdc.frontend/
│   ├── src/
│   ├── public/
│   ├── vite.config.ts
│   ├── index.html
│   ├── package.json
│   └── ...
└──
```

## Features

- Landing page and event information UI
- Hackathon challenge/problem pages
- Registration flow
- Question retrieval and answer submission endpoints
- TiDB-backed data model for users, questions, and submissions

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+ recommended
- npm
- A TiDB Cloud connection URL (or another compatible database URL)

## Backend Setup

1. Open a terminal in the backend folder:

```bash
cd hackathon.fecsdc.backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in `hackathon.fecsdc.backend` with the following variables:

```env
PORT=3000
TIDB_DATABASE_URL=your_tidb_connection_string
```

You can also use `DATABASE_URL` if that matches your environment.

4. Start the backend:

```bash
npm run dev
```

The API will run on the port defined in `PORT` (defaults to `3000` if not set).

## Frontend Setup

1. Open a terminal in the frontend folder:

```bash
cd hackathon.fecsdc.frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the Vite dev server:

```bash
npm run dev
```

The frontend usually runs at:

```text
http://localhost:5173
```

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

## Contributing

You are welcome to contribute by improving the frontend, refining the API, or improving the database model. Keep the project organized and make sure local environment variables are configured correctly before running the app.
