const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const { adminMiddleware } = require("../middleware/auth");

// Get all admin movies
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: Add a movie
router.post("/", adminMiddleware, async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    res.status(500).json({ error: "Failed to add movie: " + err.message });
  }
});

// Admin: Update a movie
router.put("/:id", adminMiddleware, async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedMovie)
      return res.status(404).json({ error: "Movie not found" });
    res.json(updatedMovie);
  } catch (err) {
    res.status(500).json({ error: "Failed to update movie" });
  }
});

// Admin: Delete a movie
router.delete("/:id", adminMiddleware, async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie)
      return res.status(404).json({ error: "Movie not found" });
    res.json({ message: "Movie deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete movie" });
  }
});

module.exports = router;
