// controllers/citycontroller.js
const { pool } = require('../config/db');

//  GET all destinations 
const getAllCities = async (req, res) => {
  try {
    const [cities] = await pool.query(
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
    res.json({ success: true, count: cities.length, data: cities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

//  GET single destination by slug 
const getCityBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;

    // Main city info
    const [cities] = await pool.query(
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

    if (cities.length === 0) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }

    const city = cities[0];

    // Places for this city
    const [places] = await pool.query(
      'SELECT * FROM places WHERE destination_id = ?',
      [city.destination_id]
    );

    // Restaurants for this city
    const [restaurants] = await pool.query(
      'SELECT * FROM restaurants WHERE destination_id = ? ORDER BY rating DESC',
      [city.destination_id]
    );

    res.json({
      success: true,
      data: {
        ...city,
        badges:      city.badges      ? city.badges.split(',')      : [],
        moods:       city.moods       ? city.moods.split(',')       : [],
        places,
        restaurants
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

//  GET search destinations 
const searchCities = async (req, res) => {
  try {
    const keyword = req.query.q || req.query.keyword || '';
    const like    = `%${keyword}%`;

    const [cities] = await pool.query(
      `SELECT d.*, d.hero_image AS image,
        GROUP_CONCAT(DISTINCT cb.label SEPARATOR ',') AS badges
       FROM destination d
       LEFT JOIN city_badges cb ON cb.destination_id = d.destination_id
       WHERE d.name LIKE ? OR d.province LIKE ? OR d.description LIKE ?
       GROUP BY d.destination_id
       ORDER BY d.name ASC`,
      [like, like, like]
    );

    res.json({ success: true, count: cities.length, destinations: cities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

//  GET destinations by mood 
const getCitiesByMood = async (req, res) => {
  try {
    const mood = req.params.mood; // e.g. 'Adventure', 'Cultural'

    const [cities] = await pool.query(
      `SELECT d.*, d.hero_image AS image
       FROM destination d
       JOIN destination_mood dm ON dm.destination_id = d.destination_id
       JOIN mood m ON m.mood_id = dm.mood_id
       WHERE m.mood_name LIKE ?
       ORDER BY d.name ASC`,
      [`%${mood}%`]
    );

    res.json({ success: true, count: cities.length, data: cities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST add new destination (admin only)
const addCity = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const {
      name, slug, province, description, tagline,
      hero_image, population, language, best_season,
      badges = [], moods = []
    } = req.body;

    // Insert into destination table
    const [result] = await conn.query(
      `INSERT INTO destination
         (name, slug, province, description, tagline, hero_image, population, language, best_season)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, slug || name.toLowerCase().replace(/\s+/g, '-'),
       province, description, tagline, hero_image, population, language, best_season]
    );

    const destId = result.insertId;

    // Insert badges
    for (const label of badges) {
      await conn.query(
        'INSERT INTO city_badges (destination_id, label) VALUES (?, ?)',
        [destId, label]
      );
    }

    // Insert mood links
    for (const moodName of moods) {
      const [moodRows] = await conn.query(
        'SELECT mood_id FROM mood WHERE mood_name = ?', [moodName]
      );
      if (moodRows.length > 0) {
        await conn.query(
          'INSERT IGNORE INTO destination_mood (destination_id, mood_id) VALUES (?, ?)',
          [destId, moodRows[0].mood_id]
        );
      }
    }

    await conn.commit();
    res.status(201).json({ success: true, message: 'City added!', destination_id: destId });

  } catch (err) {
    await conn.rollback();
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'City with this slug already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
};

//  PUT update destination (admin only) 
const updateCity = async (req, res) => {
  try {
    const { name, province, description, tagline,
            hero_image, population, language, best_season } = req.body;
    const id = req.params.id;

    await pool.query(
      `UPDATE destination SET
         name=?, province=?, description=?, tagline=?,
         hero_image=?, population=?, language=?, best_season=?
       WHERE destination_id=?`,
      [name, province, description, tagline,
       hero_image, population, language, best_season, id]
    );

    res.json({ success: true, message: 'City updated!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//  DELETE destination (admin only) 
const deleteCity = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const id = req.params.id;

    // Delete related rows first (foreign key order)
    await conn.query('DELETE FROM city_badges      WHERE destination_id = ?', [id]);
    await conn.query('DELETE FROM destination_mood WHERE destination_id = ?', [id]);
    await conn.query('DELETE FROM places           WHERE destination_id = ?', [id]);
    await conn.query('DELETE FROM restaurants      WHERE destination_id = ?', [id]);
    await conn.query('DELETE FROM reviews          WHERE destination_id = ?', [id]);
    await conn.query('DELETE FROM favourites       WHERE destination_id = ?', [id]);
    await conn.query('DELETE FROM destination      WHERE destination_id = ?', [id]);

    await conn.commit();
    res.json({ success: true, message: 'City deleted!' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
};

module.exports = {
  getAllCities, getCityBySlug, searchCities,
  getCitiesByMood, addCity, updateCity, deleteCity
};
