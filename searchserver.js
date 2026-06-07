const express = require("express");
const dotenv = require("dotenv");
const dns = require("dns");

dotenv.config();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(express.json());

// Search Routes
const searchRoutes = require("./routes/searchroutes,js");
app.use("/api", searchRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});






