const Review = require("../models/Review");

// Add Review
const addReview = async (req, res) => {
  try {
    const review = await Review.create({
      destinationId: req.params.destinationId,
      userId: req.body.userId,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      destinationId: req.params.destinationId,
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addReview,
  getReviews,
};