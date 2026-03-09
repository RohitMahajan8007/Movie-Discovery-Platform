const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists" });

    user = await User.findOne({ username });
    if (user) return res.status(400).json({ error: "Username already taken" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Make the very first user an admin automatically for easy setup
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "admin" : "user";

    user = new User({ username, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    if (user.isBanned)
      return res
        .status(403)
        .json({
          error: "Your account has been banned. Please contact support.",
        });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const payload = { id: user._id, role: user.role };
    const secret = process.env.JWT_SECRET || "fallbacksecret_change_me_later";

    jwt.sign(payload, secret, { expiresIn: "1d" }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

module.exports = router;
