import { Message, RecyclingLocation } from '../models';

// Add a message
async function addMessage(req, res) {
  try {
    const message = new Message(req.body);
    await message.save();

    // Add the message to the corresponding recycling location
    const location = await RecyclingLocation.findById(req.body.locationId);
    if (location) {
      location.messages.push(message._id);
      await location.save();
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({
      message: 'Error adding the message',
      error: error,
    });
  }
}

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

export default {
  addMessage,
  deleteMessage,
  getMessageById,
  getMessages,
  updateMessage,
};
