const mongoose = require('mongoose');

const storeCustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  totalOrders: { type: Number, default: 1 },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  notes: { type: String },
  category: { type: String, enum: ['Regular', 'Loyal', 'Problematic', 'Fraud'], default: 'Regular' }
}, { timestamps: true });

// Index for quick lookup within a store
storeCustomerSchema.index({ storeId: 1, phone: 1 }, { unique: true });

module.exports = mongoose.model('StoreCustomer', storeCustomerSchema);
