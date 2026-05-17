const express = require("express");

const {
  registerAmbulance,
  getAvailableAmbulances,
} = require("../controllers/ambulanceController");

const router = express.Router();

// Register ambulance
router.post("/register", registerAmbulance);

// Get available ambulances
router.get("/available", getAvailableAmbulances);

module.exports = router;