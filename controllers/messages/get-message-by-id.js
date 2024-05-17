import { Message } from '../../models';

// Get message by ID
async function getMessageById(req, res) {
  try {
    const { id } = req.params;
    const message = await Message.findById(id).lean();
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching the message',
      error: error,
    });
  }
}

export default getMessageById;
