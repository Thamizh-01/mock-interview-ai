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
   MongoDB (Serverless-ready Connection)
=========================== */

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    };

    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI environment variable is missing");
    }

    cached.promise = mongoose
      .connect(uri, opts)
      .then((m) => {
        console.log("✅ MongoDB Connected");
        return m;
      })
      .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err.message);
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
}

// Attempt initial connection asynchronously
if (process.env.MONGODB_URI) {
  connectDB().catch((err) => console.error("Initial MongoDB connect failed:", err.message));
}

// Middleware: ensure database is connected before handling DB-dependent API routes
app.use(async (req, res, next) => {
  if (req.path === "/api/health" || req.path === "/api/auth/config") {
    return next();
  }
  if (req.path.startsWith("/api")) {
    try {
      await connectDB();
      next();
    } catch (err) {
      console.error(`Database connection failed for ${req.method} ${req.path}:`, err.message);
      return res.status(503).json({
        success: false,
        message: "Database connection failed",
        error: err.message
      });
    }
  } else {
    next();
  }
});

/* ===========================
   API Routes
=========================== */

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/aptitude", aptitudeRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/api/health", async (req, res) => {
  const dbStates = ["disconnected", "connected", "connecting", "disconnecting"];
  let dbStatus = "disconnected";
  let dbError = null;

  try {
    await connectDB();
    dbStatus = "connected";
  } catch (err) {
    dbStatus = "disconnected";
    dbError = err.message;
  }

  res.json({
    success: true,
    message: "Mock Interview API is running",
    database: dbStatus,
    readyState: dbStates[mongoose.connection.readyState] || "unknown",
    dbError: dbError,
    hasMongoUri: !!process.env.MONGODB_URI,
    isLocalMongo: (process.env.MONGODB_URI || '').includes('localhost') || (process.env.MONGODB_URI || '').includes('127.0.0.1'),
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGeminiKey: !!process.env.GEMINI_API_KEY
  });
});

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