const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: '' },
  recoveryQuestion: { type: String, required: true },
  recoveryAnswer: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
