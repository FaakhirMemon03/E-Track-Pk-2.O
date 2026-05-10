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

// Get Store Statistics
router.get('/stats', requireAuth('store'), async (req, res) => {
  try {
    const blacklistedByYou = await Customer.countDocuments({ reportedBy: req.user._id });
    const systemWideReports = await Customer.countDocuments();
    
    // For now, we use a placeholder for total searches or track it in the user model later
    // Let's assume total searches is stored in req.user.searchCount (we can add this)
    res.json({
      totalSearches: req.user.searchCount || 0,
      blacklistedByYou,
      systemWideReports,
      recentActivity: await Customer.find().sort({ createdAt: -1 }).limit(3).populate('reportedBy', 'name')
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

    // Update search count
    req.user.searchCount = (req.user.searchCount || 0) + 1;
    await req.user.save();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Report/Blacklist customer
router.post('/report', requireAuth('store'), async (req, res) => {
  try {
    const { phone, email, address, reason } = req.body;
    
    // Check plan and limits
    const isTrial = req.user.plan === 'trial';
    const isExpired = req.user.planExpiresAt && new Date() > req.user.planExpiresAt;
    
    if (isTrial || isExpired) {
      const reportCount = await Customer.countDocuments({ reportedBy: req.user._id });
      if (reportCount >= 50) {
        return res.status(403).json({ 
          error: 'Report limit reached. Trial/Free users can only report up to 50 customers. Please upgrade your plan for unlimited reports.' 
        });
      }
    }

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
    res.status(500).json({ error: error.message });
  }
});

// Submit payment proof
router.post('/payment-proof', requireAuth('store'), upload.single('screenshot'), async (req, res) => {
  try {
    const { transactionId, plan } = req.body;
    req.user.status = 'pending_approval';
    req.user.paymentTransactionId = transactionId;
    req.user.requestedPlan = plan;
    if (req.file) {
      req.user.paymentScreenshot = `/uploads/${req.file.filename}`;
    }
    await req.user.save();
    res.json({ message: 'Payment proof submitted. Admin will review and activate your plan.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
});

const Order = require('../models/Order');

// Log/Update Order Status
router.post('/orders', requireAuth('store'), async (req, res) => {
  try {
    const { customerPhone, customerEmail, orderId, status, amount } = req.body;
    const order = new Order({
      customerPhone,
      customerEmail,
      orderId,
      status,
      amount,
      storeId: req.user._id
    });
    await order.save();
    res.status(201).json({ message: 'Order status logged successfully', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Store Order History
router.get('/orders', requireAuth('store'), async (req, res) => {
  try {
    const orders = await Order.find({ storeId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
