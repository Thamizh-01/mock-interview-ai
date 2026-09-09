require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const authRoutes = require("./routes/auth");
const questionRoutes = require("./routes/questions");
const aptitudeRoutes = require("./routes/aptitude");
const progressRoutes = require("./routes/progress");
const resumeRoutes = require("./routes/resume");
const analyticsRoutes = require("./routes/analytics");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Upload folder
const uploadsPath = process.env.VERCEL
  ? "/tmp/uploads"
  : path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

app.use("/uploads", express.static(uploadsPath));

/* ===========================
   API Routes
=========================== */

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/aptitude", aptitudeRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/api/health", (req, res) => {
  const dbStates = ["disconnected", "connected", "connecting", "disconnecting"];
  res.json({
    success: true,
    message: "Mock Interview API is running",
    database: dbStates[mongoose.connection.readyState] || "unknown",
    hasMongoUri: !!process.env.MONGODB_URI,
    isLocalMongo: (process.env.MONGODB_URI || '').includes('localhost') || (process.env.MONGODB_URI || '').includes('127.0.0.1'),
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGeminiKey: !!process.env.GEMINI_API_KEY
  });
});

/* ===========================
   MongoDB
=========================== */

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

/* ===========================
   Serve React Build
=========================== */

const buildPath = path.join(__dirname, "../client/build");

if (fs.existsSync(buildPath)) {
  console.log("Serving React build from:", buildPath);

  app.use(express.static(buildPath));

  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({
        success: false,
        message: "API Route Not Found"
      });
    }

    res.sendFile(path.join(buildPath, "index.html"));
  });
} else {
  console.log("React build folder not found.");

  app.get("/", (req, res) => {
    res.send("Mock Interview Backend is Running...");
  });
}

/* ===========================
   Start Server
=========================== */

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;