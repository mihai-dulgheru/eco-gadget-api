import { Appliance } from '../../models';

// Get all appliances
async function getAppliances(_req, res) {
  try {
    const appliances = await Appliance.find({}).lean();
    res.status(200).json(appliances);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching appliances', error: error });
  }
}

export default getAppliances;
