const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// Get user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add/Remove favorite
router.post("/favorites", authMiddleware, async (req, res) => {
  try {
    const { action, tmdbId, title, posterPath } = req.body;
    const user = await User.findById(req.user.id);
    if (action === "add") {
      if (!user.favorites.some((f) => f.tmdbId === tmdbId)) {
        user.favorites.push({ tmdbId, title, posterPath });
      }
    } else if (action === "remove") {
      user.favorites = user.favorites.filter((f) => f.tmdbId !== tmdbId);
    }
    await user.save();
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get favorites
router.get("/favorites", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add to watch history
router.post("/history", authMiddleware, async (req, res) => {
  try {
    const { tmdbId, title, posterPath } = req.body;
    const user = await User.findById(req.user.id);

    // Check if already in history, if so remove it so we can re-add it to the top
    user.watchHistory = user.watchHistory.filter((h) => h.tmdbId !== tmdbId);
    user.watchHistory.unshift({
      tmdbId,
      title,
      posterPath,
      watchedAt: Date.now(),
    });

    // Keep only last 50 unwatched
    if (user.watchHistory.length > 50)
      user.watchHistory = user.watchHistory.slice(0, 50);

    await user.save();
    res.json(user.watchHistory);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get watch history
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.watchHistory);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: view users
router.get("/", adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: toggle ban user
router.put("/ban/:id", adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.role === "admin")
      return res.status(403).json({ error: "Cannot ban admin" });

    user.isBanned = !user.isBanned;
    await user.save();
    res.json({
      message: user.isBanned ? "User banned" : "User unbanned",
      isBanned: user.isBanned,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: delete user
router.delete("/:id", adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.role === "admin")
      return res.status(403).json({ error: "Cannot delete admin" });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
