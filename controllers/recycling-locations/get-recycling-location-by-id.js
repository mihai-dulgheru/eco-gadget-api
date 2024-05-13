import { RecyclingLocation } from '../../models';

// Get a single recycling location by ID
async function getRecyclingLocationById(req, res) {
  try {
    const { id } = req.params;
    const location = await RecyclingLocation.findById(id);
    if (!location) {
      return res.status(404).json({ message: 'Recycling location not found' });
    }
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching the recycling location',
      error: error,
    });
  }
}

export default getRecyclingLocationById;
