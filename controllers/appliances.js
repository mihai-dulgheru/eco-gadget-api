import { Appliance, User } from '../models';

// Add a new appliance
async function addAppliance(req, res) {
  try {
    // Create a new appliance
    const newAppliance = new Appliance(req.body);
    await newAppliance.save();

    // Add the appliance to the user's list of appliances
    await User.findByIdAndUpdate(req.user._id, {
      $push: { appliances: newAppliance._id },
    });

    // Send a response
    res.status(201).json(newAppliance);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error adding new appliance', error: error });
  }
}

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

// Get a single appliance by ID
async function getApplianceById(req, res) {
  try {
    const { id } = req.params;
    const appliance = await Appliance.findById(id).lean();
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

// Get all appliances
async function getAppliances(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('appliances').lean();
    const appliances = user.appliances;

    res.status(200).json(appliances);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching appliances', error: error });
  }
}

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

export default {
  addAppliance,
  deleteAppliance,
  getApplianceById,
  getAppliances,
  updateAppliance,
};
