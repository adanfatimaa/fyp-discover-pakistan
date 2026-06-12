// backend/controllers/searchcontroller.js
const { pool } = require('../config/db');

const searchDestination = async (req, res) => {
    try {
        const { city } = req.query;

        // 1. Validation check
        if (!city) {
            return res.status(400).json({ 
                success: false, 
                message: "City query parameter is required" 
            });
        }

        // 2. Raw MySQL Query execution
        // Table ka naam 'destination' aur column 'name' ya 'province' ke mutabiq search karega
        const [rows] = await pool.query(
            'SELECT * FROM destination WHERE name LIKE ? OR province LIKE ?', 
            [`%${city}%`, `%${city}%`]
        );

        // 3. Response return
        return res.status(200).json({
            success: true,
            results_found: rows.length,
            data: rows
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Database query error: " + error.message
        });
    }
};

module.exports = { searchDestination };