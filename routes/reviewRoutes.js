const express = require("express");
const router = express.Router();

const {
  addReview,
  getReviews,
} = require("../controllers/reviewController");

router.post("/:destinationId", addReview);
router.get("/:destinationId", getReviews);

module.exports = router;