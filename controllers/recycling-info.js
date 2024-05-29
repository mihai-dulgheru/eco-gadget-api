import { RecyclingInfo } from '../models';

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

// Delete a recycling information entry
async function deleteRecyclingInfo(req, res) {
  const { id } = req.params;
  try {
    const recyclingInfo = await RecyclingInfo.findByIdAndDelete(id);
    if (!recyclingInfo) {
      return res
        .status(404)
        .json({ message: 'Recycling information not found' });
    }
    res
      .status(200)
      .json({ message: 'Recycling information successfully deleted' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting recycling information', error: error });
  }
}

// Get a single recycling information entry by ID
async function getRecyclingInfoById(req, res) {
  try {
    const { id } = req.params;
    const recyclingInfo = await RecyclingInfo.findById(id).lean();
    if (!recyclingInfo) {
      return res
        .status(404)
        .json({ message: 'Recycling information not found' });
    }
    res.status(200).json(recyclingInfo);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching the recycling information',
      error: error,
    });
  }
}

// Get all recycling information entries
async function getRecyclingInfos(_req, res) {
  try {
    const recyclingInfos = await RecyclingInfo.find()
      .select('-sections.social._id')
      .lean();
    res.status(200).json(recyclingInfos);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching recycling information', error: error });
  }
}

// Update an existing recycling information entry
async function updateRecyclingInfo(req, res) {
  const { id } = req.params;
  try {
    const recyclingInfo = await RecyclingInfo.findByIdAndUpdate(
      id,
      {
        ...req.body,
        updatedBy: req.user._id,
      },
      { new: true }
    );
    if (!recyclingInfo) {
      return res
        .status(404)
        .json({ message: 'Recycling information not found' });
    }
    res.status(200).json(recyclingInfo);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error updating recycling information', error: error });
  }
}

export default {
  addRecyclingInfo,
  deleteRecyclingInfo,
  getRecyclingInfoById,
  getRecyclingInfos,
  updateRecyclingInfo,
};
