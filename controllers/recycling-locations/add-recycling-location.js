import { RecyclingLocation } from '../../models';

// Add a new recycling location
async function addRecyclingLocation(req, res) {
  try {
    const location = new RecyclingLocation(req.body);
    await location.save();
    res.status(201).json(location);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error adding the recycling location', error: error });
  }
}

export default addRecyclingLocation;
