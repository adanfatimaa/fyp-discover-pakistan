// routes/searchRoutes.js
const express = require('express');
const router  = express.Router();

// Teeno controllers ko import kar rahe hain
const { searchDestination } = require('../controllers/searchcontroller');
const { getCityBySlug, getCitiesByMood } = require('../controllers/Citycontroller');

// 1. Search Route (Jo pehle se chal raha hai)
router.get('/search', searchDestination);

// 2. City Details Route (Jo click karne par places/restaurants lata hai)
router.get('/details/:slug', getCityBySlug);

// 3. 🔀 Mood Recommendation Route (Jo abhi hum test kar rahe hain)
router.get('/mood/:mood', getCitiesByMood);

module.exports = router;