const express = require("express");
const dotenv = require("dotenv");
const dns = require("dns");
const connectDB = require("./config/db");
const searchRoutes = require("./routes/searchRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes.js");
const favouriteRoutes = require("./routes/favouriteRoutes.js");


// Load .env
dotenv.config();

// Change DNS servers
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Connect MongoDB
connectDB();

const app = express();

app.use(express.json());

// Routes
app.use("/api", searchRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favourites", favouriteRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


