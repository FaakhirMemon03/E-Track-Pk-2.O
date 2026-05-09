const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Store = require('../models/Store');
const { requireAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer setup for payment screenshots and profile pics
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Lookup customer in shared blacklist
router.get('/lookup', requireAuth('store'), async (req, res) => {
  try {
    const { phone, email } = req.query;
    const customers = await Customer.find({
      $or: [{ phone }, { email }]
    }).populate('reportedBy', 'name');

    if (customers.length === 0) {
      return res.json({ risk: 'Low Risk', reports: [] });
    }

    const reportCount = customers.length;
    let risk = 'Low Risk';
    if (reportCount >= 3) risk = 'High Risk';
    else if (reportCount >= 1) risk = 'Medium Risk';

    res.json({ risk, reports: customers });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Report/Blacklist customer
router.post('/report', requireAuth('store'), async (req, res) => {
  try {
    const { phone, email, address, reason } = req.body;
    const customer = new Customer({
      phone,
      email,
      address,
      reason,
      reportedBy: req.user._id
    });
    await customer.save();
    res.status(201).json({ message: 'Customer blacklisted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit payment proof
router.post('/payment-proof', requireAuth('store'), upload.single('screenshot'), async (req, res) => {
  try {
    const { transactionId } = req.body;
    // In a real app, we might store this in a 'Payments' collection.
    // For now, we just notify the admin or mark store as pending approval.
    req.user.status = 'pending_approval';
    await req.user.save();
    res.json({ message: 'Payment proof submitted. Admin will review and activate your plan.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Profile
router.put('/profile', requireAuth('store'), upload.single('profilePic'), async (req, res) => {
  try {
    if (req.file) {
      req.user.profilePic = `/uploads/${req.file.filename}`;
    }
    if (req.body.name) req.user.name = req.body.name;
    await req.user.save();
    res.json({ message: 'Profile updated successfully', store: req.user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
