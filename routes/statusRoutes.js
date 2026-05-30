const express = require("express");

const {
  updateEmergencyStatus,
  getEmergencyStatus,
} = require("../controllers/statusController");

const router = express.Router();

/**
 * UPDATE EMERGENCY STATUS
 * PUT /status/update
 */
router.put("/update", updateEmergencyStatus);

/**
 * GET SINGLE EMERGENCY STATUS
 * GET /status/:emergencyId
 */
router.get("/:emergencyId", getEmergencyStatus);

module.exports = router;