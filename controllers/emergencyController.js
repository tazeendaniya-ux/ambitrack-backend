const db = require("../config/firebase");

/**
 * CREATE EMERGENCY REQUEST
 */
const createEmergencyRequest = async (req, res) => {
  try {
    console.log("🚑 NEW PRIORITY VERSION RUNNING");

    const {
      patientName,
      phone,
      latitude,
      longitude,
      emergencyType,
      locationType = "current",
      manualLocation,
    } = req.body;

    if (
      !patientName ||
      !phone ||
      !emergencyType ||
      !locationType
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Patient name, phone, emergency type, and location option are required.",
      });
    }

    if (
      locationType === "current" &&
      (latitude == null || longitude == null)
    ) {
      return res.status(400).json({
        success: false,
        message: "Current location not found.",
      });
    }

    if (
      locationType === "manual" &&
      (!manualLocation || !manualLocation.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Manual location address is required.",
      });
    }

    const normalizedType = emergencyType
      .trim()
      .toLowerCase();

    let priority = "Low";

    if (
      normalizedType === "cardiac arrest" ||
      normalizedType === "breathing problem"
    ) {
      priority = "Critical";
    } else if (
      normalizedType === "major accident"
    ) {
      priority = "High";
    } else if (
      normalizedType === "injury"
    ) {
      priority = "Medium";
    }

    const emergencyData = {
      patientName,
      phone,
      emergencyType,
      priority,
      locationType,
      status: "pending",
      createdAt: new Date(),
    };

    if (locationType === "current") {
      emergencyData.latitude = Number(latitude);
      emergencyData.longitude = Number(longitude);
    }

    if (locationType === "manual") {
      emergencyData.manualLocation = manualLocation.trim();
      emergencyData.latitude = null;
      emergencyData.longitude = null;
    }

    const emergencyRef = await db
      .collection("emergencies")
      .add(emergencyData);

    res.status(201).json({
      success: true,
      message: "Emergency request created",
      emergencyId: emergencyRef.id,
      priority,
    });
  } catch (error) {
    console.error(
      "Create Emergency Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * GET ALL EMERGENCY REQUESTS
 */
const getAllEmergencies = async (req, res) => {
  try {
    const snapshot = await db
      .collection("emergencies")
      .orderBy("createdAt", "desc")
      .get();

    const emergencies = [];

    snapshot.forEach((doc) => {
      emergencies.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log(
      `📋 Returning ${emergencies.length} emergencies`
    );

    res.status(200).json({
      success: true,
      emergencies,
    });
  } catch (error) {
    console.error(
      "Get Emergencies Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createEmergencyRequest,
  getAllEmergencies,
};