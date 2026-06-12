// routes/searchRoutes.js
const express = require('express');
const router  = express.Router();

const { searchDestination } = require('../controllers/searchcontroller');
const { getCityBySlug, getCitiesByMood } = require('../controllers/Citycontroller');

router.get('/search', searchDestination);

router.get('/details/:slug', getCityBySlug);

router.get('/mood/:mood', getCitiesByMood);

module.exports = router;
