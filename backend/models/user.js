// models/user.js
// MySQL version — no mongoose
// users table: user_id, full_name, email, password_hash, role, created_at
const { pool } = require('..backend/config/db');

const User = {

  // Email se user dhundo
  findByEmail: async (email) => {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  // ID se user dhundo
  findById: async (id) => {
    const [rows] = await pool.query(
      'SELECT user_id, full_name, email, role, created_at FROM users WHERE user_id = ?',
      [id]
    );
    return rows[0] || null;
  },

  // Naya user banao
  create: async (name, email, hashedPassword) => {
    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    return result.insertId;
  },

  // Check karo email already exists
  emailExists: async (email) => {
    const [rows] = await pool.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );
    return rows.length > 0;
  }
};

module.exports = User;