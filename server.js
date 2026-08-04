
const dotenv = require('dotenv');
dotenv.config();

const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const { pool, connectDB } = require('./backend/config/db');

connectDB();

const app = express();

app.use(cors({
  origin: [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());


app.use(express.static(path.join(__dirname, 'Frontend')));

app.use('/api/auth',         require('./backend/routes/authroutes'));
app.use('/api/cities',       require('./backend/routes/searchRoutes'));
app.use('/api',              require('./backend/routes/Foodroutes'));
app.use('/api/reviews',      require('./backend/routes/reviewRoutes'));
app.use('/api/favourites',   require('./backend/routes/favouriteRoutes'));  
app.use('/assets', express.static(path.join(__dirname, 'assets')));
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`  Server running on http://localhost:${PORT}`);
});
