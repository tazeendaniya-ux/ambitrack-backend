require("dotenv").config();

const app = require("./app");

// Firebase init
require("./config/firebase");

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle unknown errors
process.on("uncaughtException", (err) => {
  console.log("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.log("❌ Unhandled Rejection:", err);
});