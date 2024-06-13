import { RecyclingLocation } from '../models';

// Get a single recycling location by ID
async function getRecyclingLocationById(req, res) {
  try {
    const { id } = req.params;
    const location = await RecyclingLocation.findById(id).lean();
    if (!location) {
      return res.status(404).json({ message: 'Recycling location not found' });
    }
    // Convert GeoJSON to latitude and longitude
    const result = {
      ...location,
      latitude: location.location.coordinates[1],
      longitude: location.location.coordinates[0],
    };
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching the recycling location', error });
  }
}

// Get all recycling locations
async function getRecyclingLocations(_req, res) {
  try {
    const locations = await RecyclingLocation.find()
      .select('-schedule._id')
      .lean();
    // Convert GeoJSON to latitude and longitude
    const result = locations.map((location) => ({
      ...location,
      latitude: location.location.coordinates[1],
      longitude: location.location.coordinates[0],
    }));
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching recycling locations', error });
  }
}

export default {
  getRecyclingLocationById,
  getRecyclingLocations,
};
