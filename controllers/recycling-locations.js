import { RecyclingLocation } from '../models';

// Add a new recycling location
async function addRecyclingLocation(req, res) {
  try {
    const location = new RecyclingLocation(req.body);
    await location.save();
    res.status(201).json(location);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error adding the recycling location', error: error });
  }
}

// Delete a recycling location
async function deleteRecyclingLocation(req, res) {
  try {
    const { id } = req.params;
    const deletedLocation = await RecyclingLocation.findByIdAndDelete(id);
    if (!deletedLocation) {
      return res.status(404).json({ message: 'Recycling location not found' });
    }
    res.status(200).json({ message: 'Recycling location deleted' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting the recycling location', error: error });
  }
}

// Get a single recycling location by ID
async function getRecyclingLocationById(req, res) {
  try {
    const { id } = req.params;
    const location = await RecyclingLocation.findById(id).lean();
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

// Update an existing recycling location
async function updateRecyclingLocation(req, res) {
  try {
    const { id } = req.params;
    const updatedLocation = await RecyclingLocation.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedLocation) {
      return res.status(404).json({ message: 'Recycling location not found' });
    }
    res.status(200).json(updatedLocation);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating the recycling location', error: error });
  }
}

export default {
  addRecyclingLocation,
  deleteRecyclingLocation,
  getRecyclingLocationById,
  getRecyclingLocations,
  updateRecyclingLocation,
};
