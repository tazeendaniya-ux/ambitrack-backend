const db = require("../config/firebase");

/**
 * UPDATE AMBULANCE LOCATION
 */
const updateLocation = async (req, res) => {
  try {
    const {
      ambulanceId,
      latitude,
      longitude,
    } = req.body;

    // Validation
    if (
      !ambulanceId ||
      !latitude ||
      !longitude
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Update ambulance location
    await db
      .collection("ambulances")
      .doc(ambulanceId)
      .update({
        latitude,
        longitude,
        updatedAt: new Date(),
      });

    res.status(200).json({
      success: true,
      message: "Location updated successfully",
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
 * GET LIVE AMBULANCE LOCATION
 */
const getLiveLocation = async (req, res) => {
  try {
    const { ambulanceId } = req.params;

    const ambulanceDoc = await db
      .collection("ambulances")
      .doc(ambulanceId)
      .get();

    if (!ambulanceDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Ambulance not found",
      });
    }

    const ambulanceData = ambulanceDoc.data();

    res.status(200).json({
      success: true,
      location: {
        latitude: ambulanceData.latitude,
        longitude: ambulanceData.longitude,
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

module.exports = {
  updateLocation,
  getLiveLocation,
};