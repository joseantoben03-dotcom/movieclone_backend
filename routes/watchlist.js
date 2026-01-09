// backend/routes/watchlist.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// POST /watchlist/add  (protected)
router.post("/watchlist/add", auth, async (req, res) => {
  try {
    const {
      movieId,
      title,
      poster,
      vote_average,
      popularity,
      genres,
      status,
    } = req.body;

    const userId = req.user.userId; // from JWT

    if (!movieId) {
      return res.status(400).json({ message: "movieId required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const exists = user.watchlist.some((m) => m.movieId === movieId);
    if (exists) {
      return res.status(400).json({ message: "Movie already in watchlist" });
    }

    user.watchlist.push({
      movieId,
      title,
      poster,
      vote_average,
      popularity,
      genres,
      status: status || "plan",
    });

    await user.save();

    res.json({
      message: "Added to watchlist",
      watchlist: user.watchlist,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /watchlist  (protected, no :userId in URL)
router.get("/watchlist", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("name watchlist");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      username: user.name,
      watchlist: user.watchlist,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE /watchlist/:movieId  (protected)
router.delete("/watchlist/:movieId", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { movieId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const before = user.watchlist.length;
    user.watchlist = user.watchlist.filter(
      (m) => m.movieId !== Number(movieId)
    );

    if (user.watchlist.length === before) {
      return res.status(404).json({ message: "Movie not in watchlist" });
    }

    await user.save();

    res.json({
      message: "Removed from watchlist",
      watchlist: user.watchlist,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
