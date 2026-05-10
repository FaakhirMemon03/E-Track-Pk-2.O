const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const Customer = require('../models/Customer');

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

const Contact = require('../models/Contact');

// ... existing routes ...

// Submit Contact Form
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const contact = new Contact({ name, email, message });
    await contact.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
