import { RecyclingInfo } from '../../models';

// Update an existing recycling information entry
async function updateRecyclingInfo(req, res) {
  const { id } = req.params;
  try {
    const recyclingInfo = await RecyclingInfo.findByIdAndUpdate(
      id,
      {
        ...req.body,
        updatedBy: req.user._id,
      },
      { new: true }
    );
    if (!recyclingInfo) {
      return res
        .status(404)
        .json({ message: 'Recycling information not found' });
    }
    res.status(200).json(recyclingInfo);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error updating recycling information', error: error });
  }
}

export default updateRecyclingInfo;
