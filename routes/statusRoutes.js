const express = require("express");

const {
  updateEmergencyStatus,
  getEmergencyStatus,
} = require("../controllers/statusController");

const router = express.Router();

// Update status
router.put("/update", updateEmergencyStatus);

// Get status
router.get("/:emergencyId", getEmergencyStatus);

module.exports = router;