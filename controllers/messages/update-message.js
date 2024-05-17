import { Message } from '../../models';

// Update a message
async function updateMessage(req, res) {
  try {
    const { id } = req.params;
    const updatedMessage = await Message.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating the message',
      error: error,
    });
  }
}

export default updateMessage;
