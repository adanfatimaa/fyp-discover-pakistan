// backend/routes/reviewroutes.js
const express = require('express');
const router  = express.Router();

// Sahi controllers aur middleware ko import kar rahe hain
const { getReviews, addReview } = require('../controllers/reviewcontroller');
const { protect } = require('../middleware/authmiddleware');

// 1. 📖 GET reviews for a city (Public)
router.get('/:slug', getReviews);

// 2. 📝 POST submit a review (Protected - Login required)
router.post('/:slug', protect, addReview);

module.exports = router;