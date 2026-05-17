const calculateDistance = (
  lat1,
  lon1,
  lat2,
  lon2
) => {
  const dx = lat1 - lat2;
  const dy = lon1 - lon2;

  return Math.sqrt(dx * dx + dy * dy);
};

const findNearestAmbulance = (
  patientLat,
  patientLon,
  ambulances
) => {
  let nearest = null;
  let shortestDistance = Infinity;

  ambulances.forEach((ambulance) => {
    const distance = calculateDistance(
      patientLat,
      patientLon,
      ambulance.latitude,
      ambulance.longitude
    );

    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearest = ambulance;
    }
  });

  return nearest;
};

module.exports = {
  findNearestAmbulance,
};