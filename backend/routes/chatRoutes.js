const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { requireAuth } = require('../middleware/auth');

// Fetch messages between store and admin
router.get('/:storeId', requireAuth(), async (req, res) => {
  try {
    const { storeId } = req.params;
    // Both store and admin can access this, but store can only see their own chat
    if (req.role === 'store' && req.user._id.toString() !== storeId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const messages = await Message.find({
      $or: [
        { senderId: storeId, receiverModel: 'Admin' },
        { receiverId: storeId, senderModel: 'Admin' }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post a new message (logic is also handled by Socket.io, but this is for persistence)
router.post('/', requireAuth(), async (req, res) => {
  try {
    const { receiverId, receiverModel, text } = req.body;
    const message = new Message({
      senderId: req.user._id,
      senderModel: req.role === 'admin' ? 'Admin' : 'Store',
      receiverId,
      receiverModel,
      text
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
