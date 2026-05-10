const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const Customer = require('../models/Customer');
const Contact = require('../models/Contact');

// Get Top Protector (Store with most reports)
router.get('/top-protector', async (req, res) => {
  try {
    const topStores = await Customer.aggregate([
      { $group: { _id: "$reportedBy", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    if (!topStores.length) {
      return res.json({ name: "E-Track Hero", count: 0 });
    }

    const store = await Store.findById(topStores[0]._id).select('name createdAt');
    if (!store) return res.json({ name: "E-Track Hero", count: topStores[0].count });

    res.json({
      name: store.name,
      count: topStores[0].count,
      joined: store.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Global Stats
router.get('/stats', async (req, res) => {
  try {
    const totalReports = await Customer.countDocuments();
    const totalStores = await Store.countDocuments();
    res.json({ totalReports, totalStores });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit Contact Message
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const newMessage = new Contact({ name, email, message });
    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully! We will contact you soon.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
