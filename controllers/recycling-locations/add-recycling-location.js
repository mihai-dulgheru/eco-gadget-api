import { RecyclingLocation } from '../../models';

// Add a new recycling location
async function addRecyclingLocation(req, res) {
  try {
    const newLocation = new RecyclingLocation(req.body);
    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error adding new recycling location', error: error });
  }
}

export default addRecyclingLocation;
