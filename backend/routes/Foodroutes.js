// routes/Foodroutes.js
// food.html ke liye — /api/food-categories
// MySQL mein food_categories + food_items tables hain
const express  = require('express');
const router   = express.Router();
const { pool } = require('..backend/config/db');

// GET /api/food-categories
// food_categories table + food_items joined karke bheja
router.get('/food-categories', async (_req, res) => {
  try {
    // Pehle saari categories
    const [categories] = await pool.query(
      'SELECT * FROM food_categories ORDER BY food_cat_id ASC'
    );

    // Har category ke items
    const result = [];
    for (const cat of categories) {
      const [items] = await pool.query(
        'SELECT * FROM food_items WHERE food_cat_id = ?',
        [cat.food_cat_id]
      );
      result.push({
        id:    cat.slug,
        label: cat.label,
        items: items.map(item => ({
          id:          item.food_id,
          name:        item.name,
          description: item.description,
          image:       item.image || ''
        }))
      });
    }

    res.json(result);

  } catch (err) {
    console.error('Food categories error:', err.message);
    // Fallback static data agar DB error ho
    res.status(500).json({ success: false, message: 'Could not load food data' });
  }
});

module.exports = router;