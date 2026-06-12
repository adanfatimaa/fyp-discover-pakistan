const Destination = require("..backend/models/Destination");

const searchDestination = async (req, res) => {
  try {
    const city = req.query.city;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City query parameter is required"
      });
    }

    const destinations = await Destination.find({
      $or: [
        { city: { $regex: city, $options: "i" } },
        { name: { $regex: city, $options: "i" } }
      ]
    });

    res.json({
      success: true,
      count: destinations.length,
      data: destinations
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { searchDestination };