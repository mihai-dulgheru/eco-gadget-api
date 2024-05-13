import { Appliance } from '../../models';

// Get a single appliance by ID
async function getApplianceById(req, res) {
  try {
    const { id } = req.params;
    const appliance = await Appliance.findById(id);
    if (!appliance) {
      return res.status(404).json({ message: 'Appliance not found' });
    }
    res.status(200).json(appliance);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching the appliance', error: error });
  }
}

export default getApplianceById;
