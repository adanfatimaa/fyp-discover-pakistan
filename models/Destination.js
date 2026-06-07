const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Destination", destinationSchema);