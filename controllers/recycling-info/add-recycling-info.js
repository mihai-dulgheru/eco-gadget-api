import { RecyclingInfo } from '../../models';

// Add a new recycling information entry
async function addRecyclingInfo(req, res) {
  try {
    const newRecyclingInfo = new RecyclingInfo({
      ...req.body,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });
    await newRecyclingInfo.save();
    res.status(201).json(newRecyclingInfo);
  } catch (error) {
    res.status(400).json({
      message: 'Error adding new recycling information',
      error: error,
    });
  }
}

export default addRecyclingInfo;
