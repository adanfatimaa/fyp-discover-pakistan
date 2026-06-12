// controllers/reviewcontroller.js
const { pool } = require('..backend/config/db');

// ── GET reviews for a city ────────────────────────────────────
const getReviews = async (req, res) => {
  try {
    // Get destination_id from slug
    const [dest] = await pool.query(
      'SELECT destination_id FROM destination WHERE slug = ?',
      [req.params.slug]
    );
    if (dest.length === 0) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }
    const destId = dest[0].destination_id;

    // Get reviews with user name joined
    const [reviews] = await pool.query(
      `SELECT r.review_id, r.stars, r.review_text, r.created_at,
              u.full_name AS user_name
       FROM reviews r
       JOIN users u ON u.user_id = r.user_id
       WHERE r.destination_id = ?
       ORDER BY r.created_at DESC`,
      [destId]
    );

    const total   = reviews.length;
    const average = total > 0
      ? (reviews.reduce((s, r) => s + r.stars, 0) / total).toFixed(1)
      : 0;

    res.json({ success: true, average, total, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST submit a review ──────────────────────────────────────
const addReview = async (req, res) => {
  try {
    const { stars, review_text } = req.body;

    // Get destination_id from slug
    const [dest] = await pool.query(
      'SELECT destination_id FROM destination WHERE slug = ?',
      [req.params.slug]
    );
    if (dest.length === 0) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }

    await pool.query(
      'INSERT INTO reviews (user_id, destination_id, stars, review_text) VALUES (?, ?, ?, ?)',
      [req.user.id, dest[0].destination_id, stars, review_text]
    );

    res.status(201).json({ success: true, message: 'Review submitted!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getReviews, addReview };