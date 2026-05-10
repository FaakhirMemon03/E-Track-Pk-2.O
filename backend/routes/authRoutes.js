const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Store = require('../models/Store');
const Admin = require('../models/Admin');

// --- Store Auth ---

// Store Signup
router.post('/store/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingStore = await Store.findOne({ email });
    if (existingStore) return res.status(400).json({ error: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const store = new Store({ name, email, password: hashedPassword });
    await store.save();

    res.status(201).json({ message: 'Store created successfully. 14-day trial started.' });
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Store Login
router.post('/store/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const store = await Store.findOne({ email });
    if (!store) return res.status(400).json({ error: 'Invalid credentials' });

    if (store.status === 'banned') return res.status(403).json({ error: 'Your account is banned. Contact Admin.' });
    if (store.planExpiresAt && new Date() > store.planExpiresAt) {
      return res.status(403).json({ error: 'Your plan has expired. Please purchase a plan.' });
    }

    const isMatch = await bcrypt.compare(password, store.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: store._id, role: 'store' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, store: { id: store._id, name: store.name, email: store.email, plan: store.plan, planExpiresAt: store.planExpiresAt, profilePic: store.profilePic } });
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- Admin Auth ---

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, admin: { id: admin._id, email: admin.email, profilePic: admin.profilePic } });
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- Forgot/Reset Password ---

// Admin: Get Recovery Question
router.post('/admin/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json({ question: admin.recoveryQuestion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Reset Password via Answer
router.post('/admin/reset-password', async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    
    if (admin.recoveryAnswer !== answer) {
      return res.status(400).json({ error: 'Incorrect answer' });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Store: Forgot Password (Mock Email Token)
router.post('/store/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const store = await Store.findOne({ email });
    if (!store) return res.status(404).json({ error: 'Store not found' });

    // Generate random 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    store.resetPasswordToken = resetCode;
    store.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await store.save();

    // Send Email
    const sendEmail = require('../utils/sendEmail');
    const message = `Your password reset code is: ${resetCode}\n\nThis code will expire in 1 hour.`;

    try {
      await sendEmail({
        email: store.email,
        subject: 'E-Track PK: Password Reset Code',
        message
      });
      res.json({ message: 'Reset code sent to email' });
    } catch (err) {
      store.resetPasswordToken = undefined;
      store.resetPasswordExpire = undefined;
      await store.save();
      return res.status(500).json({ error: 'Email could not be sent' });
    }
});

// Store: Reset Password via Token
router.post('/store/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    const store = await Store.findOne({ 
      email, 
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!store) return res.status(400).json({ error: 'Invalid or expired reset code' });

    store.password = await bcrypt.hash(newPassword, 10);
    store.resetPasswordToken = undefined;
    store.resetPasswordExpire = undefined;
    await store.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
