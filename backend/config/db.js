// config/db.js  —  MySQL Connection Pool
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'pakistan_travel_guide',
  port:     process.env.DB_PORT     || 3306,
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0
  
});

// Test connection on startup
const connectDB = async () => {
  try {
    const conn = await pool.getConnection();
    console.log('  MySQL Connected: ' + process.env.DB_HOST);
    conn.release();
  } catch (err) {
    console.error('  MySQL Connection Error:', err.message);
    console.error('  .env mein DB_HOST, DB_USER, DB_PASSWORD, DB_NAME check karo');
    process.exit(1);
  }
};

module.exports = { pool, connectDB };
