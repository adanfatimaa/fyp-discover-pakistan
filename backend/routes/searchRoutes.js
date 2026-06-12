// routes/searchRoutes.js
const express = require('express');
const router  = express.Router();
const { searchDestination } = require('..backend/controllers/searchcontroller');

// GET /api/search?q=lahore
// GET /api/search?keyword=lahore
router.get('/search', searchDestination);

module.exports = router;