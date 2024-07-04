import sgMail from '@sendgrid/mail';
import { startOfMonth, subMonths } from 'date-fns';
import { Message, RecyclingLocation, User } from '../models';
import { deleteImageFromS3, uploadImageToS3 } from '../utils';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function addRecyclingLocation(req, res) {
  try {
    const imageUrl = await uploadImageToS3(req.file);

    const locationData = {
      ...req.body,
      image: imageUrl,
      location: {
        type: 'Point',
        coordinates: [req.body.longitude, req.body.latitude],
      },
    };

    const location = new RecyclingLocation(locationData);
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.recyclingLocations.push(location._id);

    await Promise.all([location.save(), user.save()]);

    res.status(201).json({
      ...location.toObject(),
      longitude: location.location.coordinates[0],
      latitude: location.location.coordinates[1],
    });
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
    // Add longitude and latitude properties to each location
    locations.forEach((location) => {
      location.longitude = location.location.coordinates[0];
      location.latitude = location.location.coordinates[1];
    });
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

    const msg = {
      to: message.email,
      from: process.env.SENDGRID_EMAIL,
      subject: 'Răspuns la mesajul dvs.',
      text: req.body.response,
      html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Răspuns la mesajul dvs.</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      box-sizing: border-box;
    "
  >
    <div
      style="
        background-color: #f2f2f2;
        padding: 20px;
        max-width: 640px;
        margin: 0 auto;
      "
    >
      <div style="background-color: #ffffff; border-radius: 8px; padding: 20px">
        <img
          src="https://eco-gadget.s3.eu-north-1.amazonaws.com/assets/icon.png"
          alt="EcoGadget Logo"
          style="display: block; margin: 0 auto 20px auto; max-width: 100px"
        />
        <p style="color: #030303; font-size: 16px; margin-bottom: 20px">
          Stimate/Stimată ${message.name},
        </p>
        <p style="color: #030303; font-size: 16px; margin-bottom: 20px">
          Vă mulțumim pentru mesajul dvs. și pentru interesul acordat.
        </p>
        <p style="color: #030303; font-size: 16px; margin-bottom: 20px">
          ${req.body.response}
        </p>
        <p style="color: #030303; font-size: 16px; margin-bottom: 20px">
          Dacă aveți alte întrebări sau nelămuriri, nu ezitați să ne contactați.
        </p>
        <p style="color: #030303; font-size: 16px; margin-bottom: 20px">
          Cu respect,
        </p>
        <p style="color: #030303; font-size: 16px; font-weight: bold">
          Echipa EcoGadget
        </p>
      </div>
    </di>
  </body>
</html>
`,
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
      if (imageUrl) {
        await deleteImageFromS3(imageUrl);
      }
      imageUrl = await uploadImageToS3(req.file);
    }

    const updatedData = {
      ...req.body,
      image: imageUrl,
      location: {
        type: 'Point',
        coordinates: [req.body.longitude, req.body.latitude],
      },
    };

    const updatedLocation = await RecyclingLocation.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    res.status(200).json({
      ...updatedLocation.toObject(),
      longitude: updatedLocation.location.coordinates[0],
      latitude: updatedLocation.location.coordinates[1],
    });
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
