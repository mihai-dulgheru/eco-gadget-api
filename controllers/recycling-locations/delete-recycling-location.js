import { RecyclingLocation } from '../../models';

// Delete a recycling location
async function deleteRecyclingLocation(req, res) {
  const { id } = req.params;
  try {
    const deletedLocation = await RecyclingLocation.findByIdAndDelete(id);
    if (!deletedLocation) {
      return res.status(404).json({ message: 'Recycling location not found' });
    }
    res
      .status(200)
      .json({ message: 'Recycling location successfully deleted' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting recycling location', error: error });
  }
}

export default deleteRecyclingLocation;
