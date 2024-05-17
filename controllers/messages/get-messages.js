import { Message } from '../../models';

// Get all messages
async function getMessages(_req, res) {
  try {
    const messages = await Message.find().lean();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching messages',
      error: error,
    });
  }
}

export default getMessages;
