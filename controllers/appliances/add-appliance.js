import { Appliance } from '../../models';

// Add a new appliance
async function addAppliance(req, res) {
  try {
    const newAppliance = new Appliance(req.body);
    await newAppliance.save();
    res.status(201).json(newAppliance);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error adding new appliance', error: error });
  }
}

export default addAppliance;
