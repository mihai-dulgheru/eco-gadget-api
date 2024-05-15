import { User } from '../../models';

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

export default getAppliances;
