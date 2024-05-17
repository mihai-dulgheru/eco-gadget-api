import { Message, RecyclingLocation } from '../../models';

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

export default addMessage;
