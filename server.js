const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const watchlistRoutes = require("./routes/watchlist");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
const MONGO_URL =
  process.env.MONGO_URL ;

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB movieapp"))
  .catch((err) => console.error("❌ Mongo error:", err.message));

// Routes
app.use("/", authRoutes);
app.use("/", watchlistRoutes);

app.get("/", (req, res) => {
  res.send("Movie backend running");
});
