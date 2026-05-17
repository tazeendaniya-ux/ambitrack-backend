const express = require("express");

const {
  assignNearestAmbulance,
} = require("../controllers/assignmentController");

const router = express.Router();

// Assign nearest ambulance
router.post("/nearest", assignNearestAmbulance);

module.exports = router;