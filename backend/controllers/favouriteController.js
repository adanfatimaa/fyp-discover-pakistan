const { pool } = require('../config/db');

// Save a favourite
exports.saveFavourite = async (req, res) => {
    try {
        const userId = req.user.id;  // comes from JWT token via protect middleware
        const slug   = req.params.slug;

        // get destination_id from slug
        const [dest] = await pool.query(
            'SELECT destination_id FROM destination WHERE slug = ?', [slug]
        );
        if (dest.length === 0) {
            return res.status(404).json({ success: false, message: 'City not found' });
        }

        await pool.query(
            'INSERT IGNORE INTO favourites (user_id, destination_id) VALUES (?, ?)',
            [userId, dest[0].destination_id]
        );

        res.status(201).json({ success: true, message: 'Saved to favourites' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Remove a favourite
exports.removeFavourite = async (req, res) => {
    try {
        const userId = req.user.id;
        const slug   = req.params.slug;

        const [dest] = await pool.query(
            'SELECT destination_id FROM destination WHERE slug = ?', [slug]
        );
        if (dest.length === 0) {
            return res.status(404).json({ success: false, message: 'City not found' });
        }

        await pool.query(
            'DELETE FROM favourites WHERE user_id = ? AND destination_id = ?',
            [userId, dest[0].destination_id]
        );

        res.status(200).json({ success: true, message: 'Removed from favourites' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Check if this city is already saved by this user
exports.checkFavourite = async (req, res) => {
    try {
        const userId = req.user.id;
        const slug   = req.params.slug;

        const [dest] = await pool.query(
            'SELECT destination_id FROM destination WHERE slug = ?', [slug]
        );
        if (dest.length === 0) {
            return res.status(404).json({ success: false, message: 'City not found' });
        }

        const [rows] = await pool.query(
            'SELECT * FROM favourites WHERE user_id = ? AND destination_id = ?',
            [userId, dest[0].destination_id]
        );

        res.json({ success: true, isSaved: rows.length > 0 });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all favourites for logged-in user
exports.getUserFavourites = async (req, res) => {
    try {
        const userId = req.user.id;

        const [favourites] = await pool.query(
            `SELECT d.name, d.slug, d.hero_image, d.province
             FROM favourites f
             JOIN destination d ON d.destination_id = f.destination_id
             WHERE f.user_id = ?`,
            [userId]
        );

        res.status(200).json({ success: true, count: favourites.length, data: favourites });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};