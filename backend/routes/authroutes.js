const express = require('express');
const router  = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { pool } = require('../config/db');

// ── Signup Route ────────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if email already exists
    const [existing] = await pool.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into MySQL users table
    await pool.query(
      'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'Account created successfully! Please log in.' });

  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ── Login Route ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    // Fetch user from MySQL
    const [rows] = await pool.query(
      'SELECT user_id, full_name, email, password_hash, role FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user    = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Sign JWT — id = user_id, role from DB
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Frontend login.js expects: token, role, name
    res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role,        // 'user' or 'admin'
      name: user.full_name
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ── Get current user Route ────────────────────────
router.get('/me', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT user_id, full_name, email, role FROM users WHERE user_id = ?',
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔥 Ab server.js ko aik valid router object milega
module.exports = router;