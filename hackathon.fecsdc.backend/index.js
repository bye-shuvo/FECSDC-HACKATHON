const dotenv = require('dotenv');
const cors = require("cors");

dotenv.config();

const express = require('express');
const path = require('node:path');
const homeRouter = require('./routes/router');
const { initializeDatabase } = require('./config/config');

const app = express();
const allowedOrigins = [
  'https://hackathonfecsdc.vercel.app',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(express.json({ limit: '32kb' }));
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use('/api-workbench', express.static(path.join(__dirname, 'frontend')));
app.use(homeRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((error, req, res, next) => {
  const duplicate = error.details?.code === 'ER_DUP_ENTRY' || /duplicate entry/i.test(error.message || '');
  const status = error.status || (duplicate ? 409 : 500);
  if (status >= 500) console.error(error);
  res.status(status).json({ error: status < 500 ? error.message : 'Internal server error' });
});

async function start() {
  await initializeDatabase();

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
}

if (require.main === module) {
  start().catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exitCode = 1;
  });
}

module.exports = { app, start };
