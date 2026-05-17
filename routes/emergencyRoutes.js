const express = require("express");

const {
  createEmergencyRequest,
  getAllEmergencies,
} = require("../controllers/emergencyController");

const router = express.Router();

// Create emergency request
router.post("/request", createEmergencyRequest);

// Get all emergencies
router.get("/all", getAllEmergencies);

module.exports = router;