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
      longitude: location.location.coordinates[0],
      latitude: location.location.coordinates[1],
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
      longitude: location.location.coordinates[0],
      latitude: location.location.coordinates[1],
    }));
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching recycling locations', error });
  }
}

// Get recycling locations by name
async function searchRecyclingLocations(req, res) {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(200).json([]);
    }
    const locations = await RecyclingLocation.find({
      name: { $regex: query, $options: 'i' },
    })
      .select('-schedule._id')
      .lean();
    // Convert GeoJSON to latitude and longitude
    const result = locations.map((location) => ({
      ...location,
      longitude: location.location.coordinates[0],
      latitude: location.location.coordinates[1],
    }));
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error searching recycling locations', error });
  }
}

export default {
  getRecyclingLocationById,
  getRecyclingLocations,
  searchRecyclingLocations,
};
