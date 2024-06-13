import sgMail from '@sendgrid/mail';
import { startOfMonth, subMonths } from 'date-fns';
import { Message, RecyclingLocation, User } from '../models';
import { deleteImageFromS3, uploadImageToS3 } from '../utils';

async function addRecyclingLocation(req, res) {
  try {
    const imageUrl = await uploadImageToS3(req.file);

    const locationData = {
      ...req.body,
      image: imageUrl,
    };

    const location = new RecyclingLocation(locationData);
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.recyclingLocations.push(location._id);

    await Promise.all([location.save(), user.save()]);

    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ message: 'Error adding recycling location', error });
  }
}

async function deleteRecyclingLocation(req, res) {
  try {
    const { id } = req.params;
    const deletedLocation = await RecyclingLocation.findByIdAndDelete(id);

    if (!deletedLocation) {
      return res.status(404).json({ message: 'Recycling location not found' });
    }

    const updateUserPromise = User.updateOne(
      { recyclingLocations: id },
      { $pull: { recyclingLocations: id } }
    );

    const deleteImagePromise = deletedLocation.image
      ? deleteImageFromS3(deletedLocation.image)
      : Promise.resolve();

    await Promise.all([updateUserPromise, deleteImagePromise]);

    res.status(200).json({ message: 'Recycling location deleted' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting the recycling location', error });
  }
}

async function getMessages(_req, res) {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).lean();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
}

async function getRecyclingLocationById(req, res) {
  try {
    const { id } = req.params;
    const location = await RecyclingLocation.findById(id).lean();
    if (!location) {
      return res.status(404).json({ message: 'Recycling location not found' });
    }
    res.status(200).json(location);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching the recycling location', error });
  }
}

async function getRecyclingLocations(_req, res) {
  try {
    const locations = await RecyclingLocation.find()
      .select('-schedule._id')
      .lean();
    res.status(200).json(locations);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching recycling locations', error });
  }
}

async function getStatistics(_req, res) {
  try {
    const recyclingLocationCount = await RecyclingLocation.countDocuments();
    const messageCount = await Message.countDocuments({ read: false });

    // Get the date 12 months ago from today
    const twelveMonthsAgo = startOfMonth(subMonths(new Date(), 11));

    // Aggregation for recycling locations
    const recyclingLocationAggregation = await RecyclingLocation.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Aggregation for messages
    const messageAggregation = await Message.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const latestRecyclingLocations = await RecyclingLocation.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    const latestMessages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.status(200).json({
      recyclingLocationCount,
      messageCount,
      latestRecyclingLocations,
      latestMessages,
      recyclingLocationAggregation,
      messageAggregation,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error });
  }
}

async function markMessageAsRead(req, res) {
  try {
    const { messageId } = req.params;
    const message = await Message.findByIdAndUpdate(
      messageId,
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error marking message as read', error });
  }
}

async function respondToMessage(req, res) {
  try {
    const { messageId } = req.params;
    const message = await Message.findByIdAndUpdate(
      messageId,
      { response: req.body.response },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: message.email,
      from: process.env.SENDGRID_EMAIL,
      subject: 'Răspuns la mesajul dvs.',
      text: req.body.response,
      html: `<p>Stimate/Stimată ${message.name},</p>
             <p>Vă mulțumim pentru mesajul dvs. și pentru interesul acordat.</p>
             <p>${req.body.response}</p>
             <p>Dacă aveți alte întrebări sau nelămuriri, nu ezitați să ne contactați.</p>
             <p>Cu respect,</p>
             <p>Echipa EcoGadget</p>`,
    };
    await sgMail.send(msg);

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error responding to message', error });
  }
}

async function updateRecyclingLocation(req, res) {
  try {
    const { id } = req.params;
    const location = await RecyclingLocation.findById(id);

    if (!location) {
      return res.status(404).json({ message: 'Recycling location not found' });
    }

    let imageUrl = location.image;

    if (req.file) {
      // Delete the old image if it exists and a new file is uploaded
      if (location.image) {
        await deleteImageFromS3(location.image);
      }
      imageUrl = await uploadImageToS3(req.file);
    }

    const updatedData = {
      ...req.body,
      image: imageUrl,
    };

    const updatedLocation = await RecyclingLocation.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    res.status(200).json(updatedLocation);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating recycling location', error });
  }
}

export default {
  addRecyclingLocation,
  deleteRecyclingLocation,
  getMessages,
  getRecyclingLocationById,
  getRecyclingLocations,
  getStatistics,
  markMessageAsRead,
  respondToMessage,
  updateRecyclingLocation,
};
