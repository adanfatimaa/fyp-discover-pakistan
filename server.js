const express = require("express");
const dotenv = require("dotenv");
const dns = require("dns");
const connectDB = require("./config/db");

// Load .env
dotenv.config();

// Change DNS servers
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Connect MongoDB
connectDB();

const app = express();

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


