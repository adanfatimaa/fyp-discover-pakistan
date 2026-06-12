// routes/Foodroutes.js

const express  = require('express');
const router   = express.Router();
const { pool } = require('../config/db');


router.get('/food-categories', async (_req, res) => {
  try {
    const [categories] = await pool.query(
      'SELECT * FROM food_categories ORDER BY food_cat_id ASC'
    );

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
    res.status(500).json({ success: false, message: 'Could not load food data' });
  }
});

module.exports = router;
