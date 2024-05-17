import { Message, RecyclingLocation } from '../../models';

// Delete a message
async function deleteMessage(req, res) {
  try {
    const { id } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Remove the message from the corresponding recycling location
    await RecyclingLocation.updateMany(
      { messages: id },
      { $pull: { messages: id } }
    );

    res.status(200).json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting the message',
      error: error,
    });
  }
}

export default deleteMessage;
