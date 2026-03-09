const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    favorites: [
      {
        tmdbId: { type: Number, required: true },
        title: { type: String },
        posterPath: { type: String },
      },
    ],
    watchHistory: [
      {
        tmdbId: { type: Number, required: true },
        title: { type: String },
        posterPath: { type: String },
        watchedAt: { type: Date, default: Date.now },
      },
    ],
    isBanned: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
