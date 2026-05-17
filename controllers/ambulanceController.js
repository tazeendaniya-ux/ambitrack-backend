const db = require("../config/firebase");

/**
 * REGISTER AMBULANCE
 */
const registerAmbulance = async (req, res) => {
  try {
    const {
      ambulanceNumber,
      driverName,
      phone,
      latitude,
      longitude,
    } = req.body;

    // Validation
    if (
      !ambulanceNumber ||
      !driverName ||
      !phone ||
      !latitude ||
      !longitude
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Ambulance object
    const ambulanceData = {
      ambulanceNumber,
      driverName,
      phone,
      latitude,
      longitude,
      available: true,
      createdAt: new Date(),
    };

    // Save to Firestore
    const ambulanceRef = await db
      .collection("ambulances")
      .add(ambulanceData);

    res.status(201).json({
      success: true,
      message: "Ambulance registered successfully",
      data: {
        ambulanceId: ambulanceRef.id,
      },
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
 * GET AVAILABLE AMBULANCES
 */
const getAvailableAmbulances = async (req, res) => {
  try {
    const snapshot = await db
      .collection("ambulances")
      .where("available", "==", true)
      .get();

    const ambulances = [];

    snapshot.forEach((doc) => {
      ambulances.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json({
      success: true,
      message: "Available ambulances fetched",
      data: ambulances,
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
  registerAmbulance,
  getAvailableAmbulances,
};