const Contact = require('../models/Contact');

// ... existing code ...

module.exports = router;

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
