const Contact = require('../models/Contact');

// ... existing code ...

// View all contact messages
router.get('/messages', requireAuth('admin'), async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
