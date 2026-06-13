// routes/favouriteRoutes.js
const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/authmiddleware');
const {
  saveFavourite,
  removeFavourite,
  checkFavourite,
  getUserFavourites
} = require('../controllers/favouriteController');
router.use(protect);

router.get('/', getUserFavourites);

router.get('/:slug', checkFavourite);

router.post('/:slug', saveFavourite);

router.delete('/:slug', removeFavourite);

module.exports = router;
