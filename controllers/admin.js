import {
  Appliance,
  Message,
  RecommendationStats,
  RecyclingInfo,
  RecyclingLocation,
  User,
} from '../models';
import { deleteImageFromS3, uploadImageToS3 } from '../utils';
import aws from '../utils/aws';

async function getUsers(_req, res) {
  try {
    const users = await User.find({ role: 'user' }).lean();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const user = await User.findOne({ _id: id, role: 'user' }).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
}

async function addUser(req, res) {
  try {
    const requiredFields = ['email', 'firstName', 'lastName', 'password'];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length) {
      return res
        .status(400)
        .json({ message: `Missing required fields: ${missingFields}` });
    }
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error adding user', error });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const user = await User.findById(id).lean();
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
      userId: id,
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
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
}

async function getRecyclingManagers(_req, res) {
  try {
    const managers = await User.find({ role: 'recycling_manager' }).lean();
    res.status(200).json(managers);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching recycling managers', error });
  }
}

async function getRecyclingManagerById(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ message: 'Recycling manager ID is required' });
    }
    const manager = await User.findOne({
      _id: id,
      role: 'recycling_manager',
    }).lean();
    if (!manager) {
      return res.status(404).json({ message: 'Recycling manager not found' });
    }
    res.status(200).json(manager);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching recycling manager', error });
  }
}

async function addRecyclingManager(req, res) {
  try {
    const requiredFields = ['email', 'firstName', 'lastName', 'password'];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length) {
      return res
        .status(400)
        .json({ message: `Missing required fields: ${missingFields}` });
    }
    const existingManager = await User.findOne({ email: req.body.email });
    if (existingManager) {
      return res.status(400).json({ message: 'Email is already in use' });
    }
    const newManager = new User({ ...req.body, role: 'recycling_manager' });
    await newManager.save();
    res.status(201).json(newManager);
  } catch (error) {
    res.status(500).json({ message: 'Error adding recycling manager', error });
  }
}

async function updateRecyclingManager(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ message: 'Recycling manager ID is required' });
    }
    const updatedManager = await User.findByIdAndUpdate(
      id,
      { ...req.body, role: 'recycling_manager' },
      { new: true }
    );
    if (!updatedManager) {
      return res.status(404).json({ message: 'Recycling manager not found' });
    }
    res.status(200).json(updatedManager);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating recycling manager', error });
  }
}

async function deleteRecyclingManager(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ message: 'Recycling manager ID is required' });
    }

    const manager = await User.findById(id).populate('recyclingLocations');
    if (!manager) {
      return res.status(404).json({ message: 'Recycling manager not found' });
    }

    // Delete all recycling locations associated with the manager
    const locationDeletionPromises = manager.recyclingLocations.map(
      async (locationId) => {
        const location = await RecyclingLocation.findById(locationId);
        if (location.image) {
          await deleteImageFromS3(location.image);
        }
        await Message.deleteMany({ locationId: location._id });
        await RecommendationStats.deleteMany({
          'recyclingCenters.id': location._id,
        });
        return RecyclingLocation.findByIdAndDelete(location._id);
      }
    );

    await Promise.all(locationDeletionPromises);

    // Delete the manager
    const deletedManager = await User.findByIdAndDelete(id);
    if (!deletedManager) {
      return res.status(404).json({ message: 'Recycling manager not found' });
    }

    res.status(200).json({ message: 'Recycling manager deleted' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting recycling manager', error });
  }
}

async function getRecyclingInfos(_req, res) {
  try {
    const recyclingInfos = await RecyclingInfo.find().lean();
    res.status(200).json(recyclingInfos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recycling infos', error });
  }
}

async function getRecyclingInfoById(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Recycling info ID is required' });
    }
    const recyclingInfo = await RecyclingInfo.findById(id).lean();
    if (!recyclingInfo) {
      return res.status(404).json({ message: 'Recycling info not found' });
    }
    res.status(200).json(recyclingInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recycling info', error });
  }
}

async function addRecyclingInfo(req, res) {
  try {
    const payload = {
      ...req.body,
      createdBy: req.user._id,
    };
    if (req.file) {
      const imageUrl = await uploadImageToS3(req.file);
      payload.picture = { alt: req.file.originalname, url: imageUrl };
    }
    const recyclingInfo = new RecyclingInfo(payload);
    await recyclingInfo.save();
    res.status(201).json(recyclingInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error adding recycling info', error });
  }
}

async function updateRecyclingInfo(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Recycling info ID is required' });
    }
    const recyclingInfo = await RecyclingInfo.findById(id);

    if (!recyclingInfo) {
      return res.status(404).json({ message: 'Recycling info not found' });
    }

    let imageUrl = recyclingInfo.picture;

    const updatedData = {
      ...req.body,
      updatedAt: new Date(),
      updatedBy: req.user._id,
    };

    if (req.file) {
      // Delete the old image if it exists and a new file is uploaded
      if (recyclingInfo.picture) {
        await deleteImageFromS3(recyclingInfo.picture.url);
      }
      updatedData.picture = { alt: req.file.originalname, url: imageUrl };
    }

    const updatedRecyclingInfo = await RecyclingInfo.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    res.status(200).json(updatedRecyclingInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error updating recycling info', error });
  }
}

async function deleteRecyclingInfo(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Recycling info ID is required' });
    }
    const deletedRecyclingInfo = await RecyclingInfo.findByIdAndDelete(id);

    if (!deletedRecyclingInfo) {
      return res.status(404).json({ message: 'Recycling info not found' });
    }

    if (deletedRecyclingInfo.picture) {
      await deleteImageFromS3(deletedRecyclingInfo.picture.url);
    }

    res.status(200).json({ message: 'Recycling info deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recycling info', error });
  }
}

export default {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  getRecyclingManagers,
  getRecyclingManagerById,
  addRecyclingManager,
  updateRecyclingManager,
  deleteRecyclingManager,
  getRecyclingInfos,
  getRecyclingInfoById,
  addRecyclingInfo,
  updateRecyclingInfo,
  deleteRecyclingInfo,
};
