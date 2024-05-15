import { Appliance, User } from '../../models';

// Delete an appliance
async function deleteAppliance(req, res) {
  const { id } = req.params;
  try {
    // Find the appliance by ID and delete it
    const appliance = await Appliance.findByIdAndDelete(id);
    if (!appliance) {
      return res.status(404).json({ message: 'Appliance not found' });
    }

    // Delete the appliance from the user's list of appliances
    await User.findByIdAndUpdate(req.user._id, { $pull: { appliances: id } });

    // Send a response
    res.status(200).json({ message: 'Appliance successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appliance', error: error });
  }
}

export default deleteAppliance;
