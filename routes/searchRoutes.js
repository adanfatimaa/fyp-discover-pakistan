const express = require("express");
const router = express.Router();

const { searchDestination } = require("../controllers/searchcontroller.js");

router.get("/search", searchDestination);


module.exports = router;









