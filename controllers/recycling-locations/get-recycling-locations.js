import { RecyclingLocation } from '../../models';

// Get all recycling locations
async function getRecyclingLocations(_req, res) {
  try {
    const locations = await RecyclingLocation.find()
      .select('-schedule._id')
      .lean();
    res.status(200).json(locations);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching recycling locations', error: error });
  }
}

export default getRecyclingLocations;
