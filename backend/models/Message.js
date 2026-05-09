const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  senderModel: { type: String, required: true, enum: ['Store', 'Admin'] },
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
  receiverModel: { type: String, required: true, enum: ['Store', 'Admin'] },
  text: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);