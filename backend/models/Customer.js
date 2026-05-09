const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['blacklisted', 'warned'], default: 'blacklisted' },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
