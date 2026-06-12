// models/Destination.js
// MySQL version — no mongoose
// Yeh file direct queries provide karti hai destination table ke liye
const { pool } = require('..backend/config/db');

const Destination = {

  // Sab destinations lao
  getAll: async () => {
    const [rows] = await pool.query(
      `SELECT d.*,
        GROUP_CONCAT(DISTINCT cb.label ORDER BY cb.label SEPARATOR ',') AS badges,
        GROUP_CONCAT(DISTINCT m.mood_name ORDER BY m.mood_name SEPARATOR ',') AS moods
       FROM destination d
       LEFT JOIN city_badges cb ON cb.destination_id = d.destination_id
       LEFT JOIN destination_mood dm ON dm.destination_id = d.destination_id
       LEFT JOIN mood m ON m.mood_id = dm.mood_id
       GROUP BY d.destination_id
       ORDER BY d.name ASC`
    );
    return rows;
  },

  // Slug se single destination
  getBySlug: async (slug) => {
    const [rows] = await pool.query(
      `SELECT d.*,
        GROUP_CONCAT(DISTINCT cb.label SEPARATOR ',') AS badges,
        GROUP_CONCAT(DISTINCT m.mood_name SEPARATOR ',') AS moods
       FROM destination d
       LEFT JOIN city_badges cb ON cb.destination_id = d.destination_id
       LEFT JOIN destination_mood dm ON dm.destination_id = d.destination_id
       LEFT JOIN mood m ON m.mood_id = dm.mood_id
       WHERE d.slug = ?
       GROUP BY d.destination_id`,
      [slug]
    );
    return rows[0] || null;
  },

  // ID se single destination
  getById: async (id) => {
    const [rows] = await pool.query(
      'SELECT * FROM destination WHERE destination_id = ?',
      [id]
    );
    return rows[0] || null;
  },

  // Search by name, province, description
  search: async (keyword) => {
    const like = `%${keyword}%`;
    const [rows] = await pool.query(
      `SELECT d.*, d.hero_image AS image,
        GROUP_CONCAT(DISTINCT cb.label SEPARATOR ',') AS badges
       FROM destination d
       LEFT JOIN city_badges cb ON cb.destination_id = d.destination_id
       WHERE d.name LIKE ? OR d.province LIKE ? OR d.description LIKE ?
       GROUP BY d.destination_id
       ORDER BY d.name ASC`,
      [like, like, like]
    );
    return rows;
  },

  // Mood ke hisaab se destinations
  getByMood: async (moodName) => {
    const [rows] = await pool.query(
      `SELECT d.*, d.hero_image AS image
       FROM destination d
       JOIN destination_mood dm ON dm.destination_id = d.destination_id
       JOIN mood m ON m.mood_id = dm.mood_id
       WHERE m.mood_name LIKE ?
       ORDER BY d.name ASC`,
      [`%${moodName}%`]
    );
    return rows;
  },

  // Naya destination add karo (admin)
  create: async (conn, data) => {
    const { name, slug, province, description, tagline,
            hero_image, population, language, best_season } = data;
    const [result] = await conn.query(
      `INSERT INTO destination
         (name, slug, province, description, tagline, hero_image, population, language, best_season)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
       province, description, tagline || '', hero_image || '',
       population || '', language || '', best_season || '']
    );
    return result.insertId;
  },

  // Update destination (admin)
  update: async (id, data) => {
    const { name, province, description, tagline,
            hero_image, population, language, best_season } = data;
    await pool.query(
      `UPDATE destination SET
         name=?, province=?, description=?, tagline=?,
         hero_image=?, population=?, language=?, best_season=?
       WHERE destination_id=?`,
      [name, province, description, tagline || '',
       hero_image || '', population || '', language || '',
       best_season || '', id]
    );
  },

  // Delete destination (admin)
  delete: async (conn, id) => {
    // Foreign key order mein delete karo
    await conn.query('DELETE FROM city_badges      WHERE destination_id = ?', [id]);
    await conn.query('DELETE FROM destination_mood WHERE destination_id = ?', [id]);
    await conn.query('DELETE FROM places           WHERE destination_id = ?', [id]);
    await conn.query('DELETE FROM restaurants      WHERE destination_id = ?', [id]);
    await conn.query('DELETE FROM reviews          WHERE destination_id = ?', [id]);
    await conn.query('DELETE FROM favourites       WHERE destination_id = ?', [id]);
    await conn.query('DELETE FROM destination      WHERE destination_id = ?', [id]);
  }
};

module.exports = Destination;