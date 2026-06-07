const db = require("../config/firebase");

/**
 * CREATE EMERGENCY REQUEST
 */
const createEmergencyRequest = async (req, res) => {
  try {
    const {
      patientName,
      phone,
      latitude,
      longitude,
      emergencyType,
    } = req.body;

    // Validation
    if (
      !patientName ||
      !phone ||
      !latitude ||
      !longitude ||
      !emergencyType
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ================= PRIORITY LOGIC =================
    let priority = "Low";

    if (
      emergencyType === "Cardiac Arrest" ||
      emergencyType === "Breathing Problem"
    ) {
      priority = "Critical";
    } else if (
      emergencyType === "Major Accident"
    ) {
      priority = "High";
    } else if (
      emergencyType === "Injury"
    ) {
      priority = "Medium";
    }

    // Emergency object
    const emergencyData = {
      patientName,
      phone,
      latitude,
      longitude,
      emergencyType,
      priority,
      status: "pending",
      createdAt: new Date(),
    };

    // Save to Firestore
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
    console.error(error);

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

    res.status(200).json({
      success: true,
      emergencies,
    });
  } catch (error) {
    console.error(error);

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