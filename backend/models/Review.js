// models/Review.js
// MySQL version — reviews table
// reviews: review_id, user_id, destination_id, stars, review_text, created_at
const { pool } = require('..backend/config/db');

const Review = {

  // City ke reviews lao (slug se)
  getBySlug: async (slug) => {
    const [rows] = await pool.query(
      `SELECT r.review_id, r.stars, r.review_text, r.created_at,
              u.full_name AS user_name, u.user_id
       FROM reviews r
       JOIN users u ON u.user_id = r.user_id
       JOIN destination d ON d.destination_id = r.destination_id
       WHERE d.slug = ?
       ORDER BY r.created_at DESC`,
      [slug]
    );
    return rows;
  },

  // Review add karo
  create: async (userId, destinationId, stars, reviewText) => {
    const [result] = await pool.query(
      'INSERT INTO reviews (user_id, destination_id, stars, review_text) VALUES (?, ?, ?, ?)',
      [userId, destinationId, stars, reviewText]
    );
    return result.insertId;
  },

  // Average rating calculate karo
  getAverage: async (destinationId) => {
    const [rows] = await pool.query(
      'SELECT AVG(stars) AS average, COUNT(*) AS total FROM reviews WHERE destination_id = ?',
      [destinationId]
    );
    return {
      average: parseFloat(rows[0].average || 0).toFixed(1),
      total:   rows[0].total || 0
    };
  }
};

module.exports = Review;