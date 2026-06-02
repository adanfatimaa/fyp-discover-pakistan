const Destination = require("../models/Destination");

const searchDestination = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const destinations = await Destination.find({
      $or: [
        {
          city: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          province: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    });

    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  searchDestination,
};