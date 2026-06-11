const Favourite = require("../models/Favourite");

// Add Favourite
exports.addFavourite = async (req, res) => {
  try {
    const favourite = await Favourite.create({
      userId: req.body.userId,
      destinationId: req.params.destinationId,
    });

    res.status(201).json({
      success: true,
      data: favourite,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get User Favourites
exports.getFavourites = async (req, res) => {
  try {
    const favourites = await Favourite.find({
      userId: req.query.userId,
    });

    res.status(200).json({
      success: true,
      count: favourites.length,
      data: favourites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Favourite
exports.deleteFavourite = async (req, res) => {
  try {
    await Favourite.findOneAndDelete({
      userId: req.query.userId,
      destinationId: req.params.destinationId,
    });

    res.status(200).json({
      success: true,
      message: "Favourite removed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};