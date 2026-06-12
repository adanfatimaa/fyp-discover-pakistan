// routes/favouriteRoutes.js
const express = require('express');
const router  = express.Router();
const { protect } = require('../backend/middleware/authmiddleware');
const {
  saveFavourite,
  removeFavourite,
  checkFavourite,
  getUserFavourites
} = require('../backend/controllers/favouriteController');

// All favourite routes require login
router.use(protect);

// GET  /api/favourites           — user ki saari saved cities
router.get('/', getUserFavourites);

// GET  /api/favourites/:slug     — check karo saved hai ya nahi
router.get('/:slug', checkFavourite);

// POST /api/favourites/:slug     — save karo
router.post('/:slug', saveFavourite);

// DELETE /api/favourites/:slug   — remove karo
router.delete('/:slug', removeFavourite);

module.exports = router;