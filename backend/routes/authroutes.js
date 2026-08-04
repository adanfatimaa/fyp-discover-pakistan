const express = require('express');
const router  = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const crypto   = require('crypto');
const { pool } = require('../config/db');
const { sendVerificationEmail, sendResetEmail } = require('../utils/mailer');

//  Signup Route 
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const [existing] = await pool.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    await pool.query(
      'INSERT INTO users (full_name, email, password_hash, is_verified, verification_token) VALUES (?, ?, ?, 0, ?)',
      [name, email, hashedPassword, verificationToken]
    );

    await sendVerificationEmail(email, name, verificationToken);

    res.status(201).json({ message: 'Account created! Please check your email to verify your account before logging in.' });

  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

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

    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

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


router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.redirect('http://localhost:3000/verify-result.html?status=fail');
    }

    const [rows] = await pool.query(
      'SELECT user_id FROM users WHERE verification_token = ?',
      [token]
    );

    if (rows.length === 0) {
      return res.redirect('http://localhost:3000/verify-result.html?status=fail');
    }

    await pool.query(
      'UPDATE users SET is_verified = 1, verification_token = NULL WHERE user_id = ?',
      [rows[0].user_id]
    );

    return res.redirect('http://localhost:3000/verify-result.html?status=success');

  } catch (err) {
    console.error('Verify error:', err.message);
    return res.redirect('http://localhost:3000/verify-result.html?status=fail');
  }
});

// Request a password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please enter your email' });
    }

    const [rows] = await pool.query('SELECT user_id, full_name FROM users WHERE email = ?', [email]);

    // Always respond the same way, whether the email exists or not
    // (this stops people from being able to "guess" which emails are registered)
    if (rows.length === 0) {
      return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await pool.query(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE user_id = ?',
      [token, expiry, rows[0].user_id]
    );

    await sendResetEmail(email, rows[0].full_name, token);

    res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });

  } catch (err) {
    console.error('Forgot password error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Actually reset the password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Missing token or new password' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const [rows] = await pool.query(
      'SELECT user_id, reset_token_expiry FROM users WHERE reset_token = ?',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset link' });
    }

    const user = rows[0];
    if (new Date(user.reset_token_expiry) < new Date()) {
      return res.status(400).json({ message: 'This reset link has expired. Please request a new one.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE user_id = ?',
      [hashedPassword, user.user_id]
    );

    res.status(200).json({ message: 'Password reset successful! You can now log in.' });

  } catch (err) {
    console.error('Reset password error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;