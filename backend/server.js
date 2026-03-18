import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dns from "dns";

// Fix DNS resolution for MongoDB Atlas SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ========================
// Middleware
// ========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ========================
// Test Route
// ========================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🌍 Travel Wild API is running!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

// ========================
// Connect to MongoDB & Start Server
// ========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("\n✅ MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}\n`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
