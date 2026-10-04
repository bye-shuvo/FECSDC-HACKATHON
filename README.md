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

## Contributing

You are welcome to contribute by improving the frontend, refining the API, or improving the database model. Keep the project organized and make sure local environment variables are configured correctly before running the app.
