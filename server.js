// server.js  —  Discover Pakistan Backend (MySQL)
const express   = require('express');
const dotenv    = require('dotenv');
const cors      = require('cors');
const path      = require('path');
const db = require('.backend/config/db');
dotenv.config();

// ── Connect MySQL ─────────────────────────────────────────────
connectDB();

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());

// Optional: serve frontend folder directly
app.use(express.static(path.join(__dirname, 'Frontend')));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',         require('.backend/routes/authroutes.js'));
app.use('/api/cities',       require('.backend/routes/searchroutes.js'));
app.use('/api',              require('.backend/routes/Foodroutes.js'));

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status:   'OK',
    database: 'MySQL',
    message:  'Discover Pakistan API running'
  });
});

app.get('/', (_req, res) => {
  res.json({ message: 'Discover Pakistan API — MySQL Backend' });
});

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`  Server running on http://localhost:${PORT}`);
});