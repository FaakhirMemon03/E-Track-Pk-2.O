const jwt = require('jsonwebtoken');
const Store = require('../models/Store');
const Admin = require('../models/Admin');

const requireAuth = (role) => async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Authentication required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (role && decoded.role !== role) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (decoded.role === 'store') {
      const store = await Store.findById(decoded.id);
      if (!store) return res.status(401).json({ error: 'Store not found' });
      if (store.status === 'banned') return res.status(403).json({ error: 'Your account is banned' });
      req.user = store;
    } else if (decoded.role === 'admin') {
      const admin = await Admin.findById(decoded.id);
      if (!admin) return res.status(401).json({ error: 'Admin not found' });
      req.user = admin;
    }
    
    req.role = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { requireAuth };
