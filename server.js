require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

// Firebase init
require("./config/firebase");

const PORT = process.env.PORT || 5000;

// ------------------------------
// 🌐 HTTP SERVER
// ------------------------------
const server = http.createServer(app);

// ------------------------------
// ⚡ SOCKET.IO SETUP (FIXED FOR PROD)
// ------------------------------
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://ambitrack-backend.onrender.com"
      // 👉 add your frontend URL here later if deployed
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

  // 🚑 DRIVER LIVE LOCATION
  socket.on("driver-location", (data) => {
    if (!data || !data.driverId) return;

    ambulanceLocations[data.driverId] = {
      lat: data.lat,
      lng: data.lng,
      updatedAt: Date.now(),
    };

    // 📡 Broadcast to all clients
    io.emit("ambulance-update", ambulanceLocations);
  });

  // 📊 STATUS UPDATES
  socket.on("status-update", (data) => {
    io.emit("status-broadcast", {
      emergencyId: data.emergencyId,
      status: data.status,
      updatedAt: Date.now(),
    });
  });

  // ❌ DISCONNECT
  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ------------------------------
// 🧹 CLEANUP OLD LOCATIONS
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
// 🚀 START SERVER (IMPORTANT FIX)
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