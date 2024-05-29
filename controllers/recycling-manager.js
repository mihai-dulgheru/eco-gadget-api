import { Message, RecyclingLocation } from '../models';

async function getStatistics(req, res) {
  try {
    const recyclingLocationCount = await RecyclingLocation.countDocuments();
    const messageCount = await Message.countDocuments();
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
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error });
  }
}

async function getRecyclingLocations(req, res) {
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

async function getMessages(req, res) {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).lean();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
}

export default {
  getStatistics,
  getRecyclingLocations,
  getMessages,
};
