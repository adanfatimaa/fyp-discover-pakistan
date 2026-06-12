// models/Favourite.js

const { pool } = require('../config/db');

const Favourite = {

  save: async (userId, destinationId) => {
    try {
      await pool.query(
        'INSERT INTO favourites (user_id, destination_id) VALUES (?, ?)',
        [userId, destinationId]
      );
      return true;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') return false;
      throw err;
    }
  },

  remove: async (userId, destinationId) => {
    await pool.query(
      'DELETE FROM favourites WHERE user_id = ? AND destination_id = ?',
      [userId, destinationId]
    );
  },

  isSaved: async (userId, destinationId) => {
    const [rows] = await pool.query(
      'SELECT favourite_id FROM favourites WHERE user_id = ? AND destination_id = ?',
      [userId, destinationId]
    );
    return rows.length > 0;
  },

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
