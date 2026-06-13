// searchserver.js
const express   = require('express');
const dotenv    = require('dotenv');
const cors      = require('cors');
const { connectDB } = require('./backend/config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Search route only
app.use('/api/search', require('./backend/routes/searchRoutes'));

app.get('/', (_req, res) => {
  res.json({ message: 'Search Server running' });
});

const PORT = process.env.SEARCH_PORT || 5000;
app.listen(PORT, () => {
  console.log(`  Search Server: http://localhost:${PORT}`);
});