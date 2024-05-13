import { Appliance } from '../../models';

// Delete an appliance
async function deleteAppliance(req, res) {
  const { id } = req.params;
  try {
    const appliance = await Appliance.findByIdAndDelete(id);
    if (!appliance) {
      return res.status(404).json({ message: 'Appliance not found' });
    }
    res.status(200).json({ message: 'Appliance successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appliance', error: error });
  }
}

export default deleteAppliance;
