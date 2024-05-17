import { RecyclingLocation } from '../../models';

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

export default deleteRecyclingLocation;
