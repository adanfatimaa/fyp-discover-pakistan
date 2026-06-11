require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const dns = require("dns")
const searchRoutes= require("./routes/searchRoutes.js");
const reviewRoutes= require("./routes/reviewRoutes.js");
const favouriteRoutes = require("./routes/favouriteRoutes.js");
 
const connectDB = require("./config/db");
// Load .env
require("dotenv").config();
// Change DNS servers
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
connectDB();
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log("MongoDB Connection Error:", err.message);
});

// Routes
app.get("/api/test-direct", (req, res) => {
    res.json({ message: "Direct route is working" });
});
app.use("/api", searchRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favourites", favouriteRoutes);
// Default Route
app.get("/", (req, res) => {
    res.send("API Working");
});
    
        
        


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


