const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerPhone: { type: String, required: true },
  customerEmail: { type: String, required: true },
  orderId: { type: String, required: true },
  status: { type: String, enum: ['Delivered', 'Returned', 'Cancelled', 'Pending'], default: 'Pending' },
  amount: { type: Number },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
