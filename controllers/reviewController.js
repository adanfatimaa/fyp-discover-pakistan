const Review = require("../models/Review");

// Add Review
const addReview = async (req, res) => {
  try {
    const { destination, userName, rating, comment } = req.body;

    const review = await Review.create({
      destination,
      userName,
      rating,
      comment,
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

// Get Reviews by Destination
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      destination: req.params.destination,
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