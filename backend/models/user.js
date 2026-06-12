// models/user.js

const { pool } = require('../config/db');

const User = {

  findByEmail: async (email) => {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      'SELECT user_id, full_name, email, role, created_at FROM users WHERE user_id = ?',
      [id]
    );
    return rows[0] || null;
  },

  create: async (name, email, hashedPassword) => {
    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    return result.insertId;
  },

  emailExists: async (email) => {
    const [rows] = await pool.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );
    return rows.length > 0;
  }
};

module.exports = User;
