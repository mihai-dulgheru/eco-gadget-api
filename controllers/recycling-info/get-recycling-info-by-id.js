import { RecyclingInfo } from '../../models';

// Get a single recycling information entry by ID
async function getRecyclingInfoById(req, res) {
  try {
    const { id } = req.params;
    const recyclingInfo = await RecyclingInfo.findById(id).lean();
    if (!recyclingInfo) {
      return res
        .status(404)
        .json({ message: 'Recycling information not found' });
    }
    res.status(200).json(recyclingInfo);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching the recycling information',
      error: error,
    });
  }
}

export default getRecyclingInfoById;
