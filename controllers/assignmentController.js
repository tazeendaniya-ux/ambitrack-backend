const https = require("https");
const querystring = require("querystring");
const db = require("../config/firebase");

const {
  findNearestAmbulance,
} = require("../services/nearestAmbulanceService");

const geocodeAddress = (address) => {
  return new Promise((resolve, reject) => {
    const query = querystring.escape(address);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;

    https
      .get(
        url,
        {
          headers: {
            "User-Agent": "AmbiTrack/1.0",
            Accept: "application/json",
          },
        },
        (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            try {
              const results = JSON.parse(data);
              if (!Array.isArray(results) || !results.length) {
                return resolve(null);
              }

              const { lat, lon } = results[0];
              resolve({
                lat: Number(lat),
                lon: Number(lon),
              });
            } catch (error) {
              reject(error);
            }
          });
        }
      )
      .on("error", reject);
  });
};

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

    let patientLat = emergencyData.latitude;
    let patientLon = emergencyData.longitude;

    if (
      emergencyData.locationType === "manual" &&
      emergencyData.manualLocation
    ) {
      const geocoded = await geocodeAddress(
        emergencyData.manualLocation
      );

      if (!geocoded) {
        return res.status(400).json({
          success: false,
          message:
            "Unable to resolve manual pickup address. Please verify the entered location.",
        });
      }

      patientLat = geocoded.lat;
      patientLon = geocoded.lon;

      await db
        .collection("emergencies")
        .doc(emergencyId)
        .update({
          latitude: patientLat,
          longitude: patientLon,
        });
    }

    if (patientLat == null || patientLon == null) {
      return res.status(400).json({
        success: false,
        message:
          "Emergency location coordinates are missing. Cannot assign an ambulance.",
      });
    }

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
        patientLat,
        patientLon,
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