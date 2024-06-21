import {
  Appliance,
  Message,
  RecommendationStats,
  RecyclingLocation,
  User,
} from '../models';
import aws from '../utils/aws';

// Delete a user
async function deleteUser(req, res) {
  const { _id } = req.user;

  try {
    // Retrieve user data
    const user = await User.findById(_id).lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Optionally, delete the profile picture from S3 if exists
    if (user.profilePicture?.url) {
      await aws.remove(aws.getKey(user.profilePicture.url));
    }

    const { appliances, email } = user;

    // Fetch messages and delete related data in parallel
    const messagesPromise = Message.find({ email }).select('_id').lean();
    const deleteAppliancesPromise = Appliance.deleteMany({
      _id: { $in: appliances },
    });
    const deleteRecommendationStatsPromise = RecommendationStats.deleteMany({
      userId: _id,
    });

    const [messages] = await Promise.all([
      messagesPromise,
      deleteAppliancesPromise,
      deleteRecommendationStatsPromise,
    ]);

    const messageIds = messages.map((message) => message._id);
    const deleteMessagesPromise = Message.deleteMany({
      _id: { $in: messageIds },
    });
    const updateRecyclingLocationsPromise = RecyclingLocation.updateMany(
      { messages: { $in: messageIds } },
      { $pull: { messages: { $in: messageIds } } }
    );

    await Promise.all([deleteMessagesPromise, updateRecyclingLocationsPromise]);

    // Delete the user
    await User.findByIdAndDelete(_id);

    res.status(200).json({ message: 'User successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
}

// Get a user's personal info
async function getPersonalInfo(req, res) {
  const { _id } = req.user;

  try {
    const user = await User.findById(_id).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
}

// Update a user's name
async function updateName(req, res) {
  const { _id } = req.user;
  const { firstName, lastName } = req.body;

  try {
    if (!firstName || !lastName) {
      return res.status(400).json({
        message: 'Please provide both first and last name',
      });
    }
    const user = await User.findByIdAndUpdate(
      _id,
      { firstName, lastName },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user's name", error });
  }
}

// Update a user's phone number
async function updatePhone(req, res) {
  const { _id } = req.user;
  const { phone } = req.body;

  try {
    if (!phone) {
      return res.status(400).json({ message: 'Please provide a phone number' });
    }
    const user = await User.findByIdAndUpdate(_id, { phone }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user's phone number", error });
  }
}

// Update a user
async function updateUser(req, res) {
  const { _id } = req.user;
  const updateData = req.body;

  // Check if there's a file to upload
  if (req.file) {
    try {
      const { name, data, mimetype } = req.file;
      const uploadResult = await aws.upload(name, data, { public: true });
      updateData.profilePicture = {
        name: uploadResult.name,
        size: req.file.size,
        type: mimetype,
        url: aws.getPublicUrl(uploadResult.key),
      };
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error uploading file to S3', error });
    }
  }

  try {
    const user = await User.findByIdAndUpdate(_id, updateData, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
}

export default {
  deleteUser,
  getPersonalInfo,
  updateName,
  updatePhone,
  updateUser,
};
