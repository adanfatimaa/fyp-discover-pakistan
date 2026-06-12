const { pool } = require('../config/db'); 

// Add Favourite (MySQL)
exports.addFavourite = async (req, res) => {
  try {
    const { userId, destinationId } = req.body;
    await pool.query(
      'INSERT INTO favourites (user_id, destination_id) VALUES (?, ?)',
      [userId, destinationId]
    );

    res.status(201).json({ success: true, message: "Favourite added" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Favourites (MySQL)
exports.getFavourites = async (req, res) => {
  try {
    const userId = req.query.userId;
    const [favourites] = await pool.query(
      'SELECT * FROM favourites WHERE user_id = ?',
      [userId]
    );

    res.status(200).json({
      success: true,
      count: favourites.length,
      data: favourites,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Favourite (MySQL)
exports.deleteFavourite = async (req, res) => {
  try {
    const { userId, destinationId } = req.query;
    await pool.query(
      'DELETE FROM favourites WHERE user_id = ? AND destination_id = ?',
      [userId, destinationId]
    );

    res.status(200).json({ success: true, message: "Favourite removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
