import { RecyclingInfo } from '../../models';

// Delete a recycling information entry
async function deleteRecyclingInfo(req, res) {
  const { id } = req.params;
  try {
    const recyclingInfo = await RecyclingInfo.findByIdAndDelete(id);
    if (!recyclingInfo) {
      return res
        .status(404)
        .json({ message: 'Recycling information not found' });
    }
    res
      .status(200)
      .json({ message: 'Recycling information successfully deleted' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting recycling information', error: error });
  }
}

export default deleteRecyclingInfo;
