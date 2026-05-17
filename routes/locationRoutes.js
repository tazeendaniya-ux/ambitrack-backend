const express = require("express");

const {
  updateLocation,
  getLiveLocation,
} = require("../controllers/locationController");

const router = express.Router();

// Update location
router.post("/update", updateLocation);

// Get live location
router.get("/:ambulanceId", getLiveLocation);

module.exports = router;