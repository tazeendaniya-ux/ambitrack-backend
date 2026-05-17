const db = require("../config/firebase");

const {
  findNearestAmbulance,
} = require("../services/nearestAmbulanceService");

/**
 * ASSIGN NEAREST AMBULANCE
 */
const assignNearestAmbulance = async (req, res) => {
  try {
    const { emergencyId } = req.body;

    // Get emergency request
    const emergencyDoc = await db
      .collection("emergencies")
      .doc(emergencyId)
      .get();

    if (!emergencyDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Emergency not found",
      });
    }

    const emergencyData = emergencyDoc.data();

    // Get available ambulances
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

    if (ambulances.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No available ambulances",
      });
    }

    // Find nearest ambulance
    const nearestAmbulance =
      findNearestAmbulance(
        emergencyData.latitude,
        emergencyData.longitude,
        ambulances
      );

    // Update ambulance availability
    await db
      .collection("ambulances")
      .doc(nearestAmbulance.id)
      .update({
        available: false,
      });

    // Update emergency request
    await db
      .collection("emergencies")
      .doc(emergencyId)
      .update({
        status: "assigned",
        assignedAmbulanceId:
          nearestAmbulance.id,
      });

    res.status(200).json({
      success: true,
      message:
        "Nearest ambulance assigned successfully",
      ambulance: nearestAmbulance,
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
  assignNearestAmbulance,
};