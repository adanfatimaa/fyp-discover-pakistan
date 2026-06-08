const express = require("express");
const router = express.Router();

const {
  addFavourite,
  getFavourites,
  deleteFavourite,
} = require("../controllers/favouriteController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/:destinationId", authMiddleware, addFavourite);

router.get("/", authMiddleware, getFavourites);

router.delete("/:destinationId", authMiddleware, deleteFavourite);

module.exports = router;