require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
const userRoutes = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/users", userRoutes);

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/movieDB";

const { MongoMemoryServer } = require("mongodb-memory-server");

const connectDB = async () => {
  try {
    console.log("Attempting to connect to primary MongoDB...");
    // Attempt standard connection with a longer timeout for cloud DB
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.log(
      "Local MongoDB not found. Starting in-memory database as fallback...",
    );
    try {
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      await mongoose.connect(memoryUri);
      console.log("Connected to MongoDB (In-Memory Fallback)");
    } catch (memErr) {
      console.error("Failed to start in-memory database:", memErr);
      process.exit(1);
    }
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

connectDB();
