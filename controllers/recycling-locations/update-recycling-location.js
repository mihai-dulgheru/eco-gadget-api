import { RecyclingLocation } from '../../models';

// Update an existing recycling location
async function updateRecyclingLocation(req, res) {
  const { id } = req.params;
  try {
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
      .status(400)
      .json({ message: 'Error updating recycling location', error: error });
  }
}

export default updateRecyclingLocation;
