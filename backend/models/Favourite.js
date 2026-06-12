// models/Favourite.js
// MySQL version — favourites table
// favourites: favourite_id, user_id, destination_id, created_at
const { pool } = require('..backend/config/db');

const Favourite = {

  // Save karo
  save: async (userId, destinationId) => {
    try {
      await pool.query(
        'INSERT INTO favourites (user_id, destination_id) VALUES (?, ?)',
        [userId, destinationId]
      );
      return true;
    } catch (err) {
      // ER_DUP_ENTRY — already saved
      if (err.code === 'ER_DUP_ENTRY') return false;
      throw err;
    }
  },

  // Remove karo
  remove: async (userId, destinationId) => {
    await pool.query(
      'DELETE FROM favourites WHERE user_id = ? AND destination_id = ?',
      [userId, destinationId]
    );
  },

  // Check karo saved hai ya nahi
  isSaved: async (userId, destinationId) => {
    const [rows] = await pool.query(
      'SELECT favourite_id FROM favourites WHERE user_id = ? AND destination_id = ?',
      [userId, destinationId]
    );
    return rows.length > 0;
  },

  // User ki saari saved destinations
  getUserFavourites: async (userId) => {
    const [rows] = await pool.query(
      `SELECT d.*, d.hero_image AS image
       FROM favourites f
       JOIN destination d ON d.destination_id = f.destination_id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [userId]
    );
    return rows;
  }
};

module.exports = Favourite;