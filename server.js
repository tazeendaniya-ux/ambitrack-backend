require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

// Firebase init (if used)
require("./config/firebase");

const PORT = process.env.PORT || 5000;

// ------------------------------
// 🌐 HTTP SERVER
// ------------------------------
const server = http.createServer(app);

// ------------------------------
// ⚡ SOCKET.IO SETUP
// ------------------------------
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://ambitrack-backend.onrender.com" // backend itself
      // add frontend URL later (VERY IMPORTANT in production)
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// 🚑 STORE LIVE LOCATIONS
let ambulanceLocations = {};

// ------------------------------
// 🟢 SOCKET EVENTS
// ------------------------------
io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  // ===============================
  // 🚑 DRIVER LOCATION (FIXED)
  // ===============================
  socket.on("driver-location", (data) => {
    console.log("📍 Driver update received:", data);

    if (!data?.driverId) return;

    const update = {
      driverId: data.driverId,
      lat: data.lat,
      lng: data.lng,
      updatedAt: Date.now(),
    };

    // store latest location
    ambulanceLocations[data.driverId] = update;

    // broadcast single driver update (IMPORTANT FIX)
    io.emit("ambulance-update", update);
  });

  // ===============================
  // 📊 STATUS UPDATE
  // ===============================
  socket.on("status-update", (data) => {
    console.log("📊 Status update:", data);

    io.emit("status-broadcast", {
      emergencyId: data.emergencyId,
      status: data.status,
      updatedAt: Date.now(),
    });
  });

  // ===============================
  // ❌ DISCONNECT
  // ===============================
  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ------------------------------
// 🧹 CLEANUP OLD DRIVER LOCATIONS
// ------------------------------
setInterval(() => {
  const now = Date.now();

  for (const id in ambulanceLocations) {
    if (now - ambulanceLocations[id].updatedAt > 30000) {
      delete ambulanceLocations[id];
    }
  }
}, 30000);

// ------------------------------
// 🚀 START SERVER (IMPORTANT FOR RENDER)
// ------------------------------
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ------------------------------
// ⚠️ ERROR HANDLING
// ------------------------------
process.on("uncaughtException", (err) => {
  console.log("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.log("❌ Unhandled Rejection:", err);
});