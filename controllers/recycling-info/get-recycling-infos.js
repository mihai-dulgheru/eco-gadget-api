import { RecyclingInfo } from '../../models';

// Get all recycling information entries
async function getRecyclingInfos(_req, res) {
  try {
    const recyclingInfos = await RecyclingInfo.find();
    res.status(200).json(recyclingInfos);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching recycling information', error: error });
  }
}

export default getRecyclingInfos;
