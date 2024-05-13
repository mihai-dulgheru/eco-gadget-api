import { Appliance } from '../../models';

// Update an existing appliance
async function updateAppliance(req, res) {
  const { id } = req.params;
  try {
    const appliance = await Appliance.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!appliance) {
      return res.status(404).json({ message: 'Appliance not found' });
    }
    res.status(200).json(appliance);
  } catch (error) {
    res.status(400).json({ message: 'Error updating appliance', error: error });
  }
}

export default updateAppliance;
