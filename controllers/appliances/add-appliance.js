import { Appliance, User } from '../../models';

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

export default addAppliance;
