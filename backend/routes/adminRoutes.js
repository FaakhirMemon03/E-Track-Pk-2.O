const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const Customer = require('../models/Customer');
const { requireAuth } = require('../middleware/auth');

// List all stores
router.get('/stores', requireAuth('admin'), async (req, res) => {
  try {
    const stores = await Store.find().select('-password');
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Block/Unblock store
router.put('/stores/:id/status', requireAuth('admin'), async (req, res) => {
  try {
    const { status } = req.body; // 'active', 'banned'
    const store = await Store.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ message: `Store ${status} successfully`, store });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve subscription/plan
router.put('/stores/:id/activate', requireAuth('admin'), async (req, res) => {
  try {
    const { plan, durationMonths } = req.body;
    let months = parseInt(durationMonths);
    
    // Auto-map duration if not provided correctly
    if (!months || isNaN(months)) {
      if (plan === '1month') months = 1;
      else if (plan === '6month') months = 6;
      else if (plan === '1year') months = 12;
      else months = 1;
    }

    const storeToUpdate = await Store.findById(req.params.id);
    if (!storeToUpdate) return res.status(404).json({ error: 'Store not found' });

    let expiresAt = new Date();
    // If store already has an active PAID plan that hasn't expired, extend it.
    // If they are on 'trial', we start the new plan from NOW (trial ends immediately).
    if (storeToUpdate.plan !== 'trial' && storeToUpdate.planExpiresAt && storeToUpdate.planExpiresAt > new Date()) {
      expiresAt = new Date(storeToUpdate.planExpiresAt);
    }
    
    expiresAt.setMonth(expiresAt.getMonth() + months);

    const store = await Store.findByIdAndUpdate(req.params.id, {
      plan,
      planExpiresAt: expiresAt,
      status: 'active',
      requestedPlan: 'none'
    }, { new: true });

    res.json({ message: 'Plan activated successfully', store });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View all blacklisted customers
router.get('/customers', requireAuth('admin'), async (req, res) => {
  try {
    const customers = await Customer.find().populate('reportedBy', 'name');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Admin Profile
router.put('/profile', requireAuth('admin'), async (req, res) => {
  try {
    const { username, password, recoveryQuestion, recoveryAnswer } = req.body;
    if (username) req.user.username = username;
    if (recoveryQuestion) req.user.recoveryQuestion = recoveryQuestion;
    if (recoveryAnswer) req.user.recoveryAnswer = recoveryAnswer;
    
    if (password) {
      const bcrypt = require('bcryptjs');
      req.user.password = await bcrypt.hash(password, 10);
    }

    await req.user.save();
    res.json({ message: 'Admin profile updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
