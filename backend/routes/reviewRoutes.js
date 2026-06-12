// backend/routes/reviewroutes.js
const express = require('express');
const router  = express.Router();

const { getReviews, addReview } = require('../controllers/reviewcontroller');
const { protect } = require('../middleware/authmiddleware');

router.get('/:slug', getReviews);

router.post('/:slug', protect, addReview);

module.exports = router;
