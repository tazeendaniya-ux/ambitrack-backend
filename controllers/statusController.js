const db = require("../config/firebase");

/**
 * UPDATE EMERGENCY STATUS
 */
const updateEmergencyStatus = async (req, res) => {
  try {
    const {
      emergencyId,
      status,
    } = req.body;

    // Allowed statuses
    const allowedStatuses = [
      "pending",
      "assigned",
      "on_the_way",
      "arrived",
      "completed",
    ];

    // Validation
    if (!emergencyId || !status) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // Update Firestore
    await db
      .collection("emergencies")
      .doc(emergencyId)
      .update({
        status,
        updatedAt: new Date(),
      });

    res.status(200).json({
      success: true,
      message: "Emergency status updated",
      status,
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
 * GET EMERGENCY STATUS
 */
const getEmergencyStatus = async (req, res) => {
  try {
    const { emergencyId } = req.params;

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

    res.status(200).json({
      success: true,
      emergencyId,
      status: emergencyData.status,
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
  updateEmergencyStatus,
  getEmergencyStatus,
};