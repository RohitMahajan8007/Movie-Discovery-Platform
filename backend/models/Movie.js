const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    posterUrl: { type: String },
    description: { type: String },
    releaseDate: { type: Date },
    trailerUrl: { type: String },
    genre: { type: String },
    category: { type: String }, // e.g., 'Movies', 'TV Shows'
  },
  { timestamps: true },
);

module.exports = mongoose.model("Movie", movieSchema);
