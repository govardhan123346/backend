const Message = require('../models/Message');

// @POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const msg = await Message.create({
      user: req.user ? req.user._id : null,
      name, email, subject, message,
    });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/messages  (admin)
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/messages/:id/read  (admin)
const markRead = async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/messages/:id  (admin)
const deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { sendMessage, getMessages, markRead, deleteMessage };
