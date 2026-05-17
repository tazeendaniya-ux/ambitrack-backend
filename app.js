const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const ambulanceRoutes = require("./routes/ambulanceRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const locationRoutes = require("./routes/locationRoutes");
const statusRoutes = require("./routes/statusRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("AmbiTrack Backend Running Successfully 🚑");
});

// Routes
app.use("/auth", authRoutes);
app.use("/emergency", emergencyRoutes);
app.use("/ambulance", ambulanceRoutes);
app.use("/assign", assignmentRoutes);
app.use("/location", locationRoutes);
app.use("/status", statusRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error Handler
app.use(errorHandler);

module.exports = app;