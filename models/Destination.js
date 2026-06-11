const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    province: String,
    city: String,
    category: String,
    description: String,
    image: String,
  },
  { collection: "destination" }
);

module.exports = mongoose.model("Destination", destinationSchema);