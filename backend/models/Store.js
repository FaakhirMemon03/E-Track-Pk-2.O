const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: '' },
  status: { type: String, enum: ['active', 'banned', 'pending_approval'], default: 'active' },
  plan: { type: String, enum: ['trial', '1month', '6month', '1year', 'none'], default: 'trial' },
  planExpiresAt: { type: Date },
  isVerified: { type: Boolean, default: false }, // For email verification
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
}, { timestamps: true });

// Pre-save to set trial expiration if new
storeSchema.pre('save', async function() {
  if (this.isNew && this.plan === 'trial') {
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 14); // 14 days trial
    this.planExpiresAt = expireDate;
  }
});

module.exports = mongoose.model('Store', storeSchema);
