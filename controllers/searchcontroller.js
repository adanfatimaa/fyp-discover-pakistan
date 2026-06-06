const Destination = require("../models/Destination");

const searchDestination = async (req, res) => {
  try {
    const query = req.query.query;

  
    const all = await Destination.find();
    console.log("ALL DATA FROM DB:", all);

    const result = await Destination.find({
      city: { $regex: query, $options: "i" }
    });

    console.log("SEARCH RESULT:", result);
    res.json({
      success: true,
      count: result.length,
      data: result
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { searchDestination };
    
