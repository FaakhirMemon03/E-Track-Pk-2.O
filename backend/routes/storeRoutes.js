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

const xlsx = require('xlsx');

// ... existing code ...

// Bulk Report via Excel/CSV
router.post('/bulk-report', requireAuth('store'), upload.single('file'), async (req, res) => {
  try {
    // 1. Check if user has a paid plan
    const isTrial = req.user.plan === 'trial';
    const isExpired = req.user.planExpiresAt && new Date() > req.user.planExpiresAt;
    
    if (isTrial || isExpired) {
      return res.status(403).json({ 
        error: 'Bulk upload is a premium feature. Please upgrade your plan to upload data in bulk.' 
      });
    }

    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // 2. Parse Excel File
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!sheetData.length) {
      return res.status(400).json({ error: 'Excel sheet is empty' });
    }

    // 3. Prepare data for insertion
    const records = sheetData.map(row => ({
      phone: row.phone || row.Phone || row.PHONE || '',
      email: row.email || row.Email || row.EMAIL || '',
      address: row.address || row.Address || row.ADDRESS || '',
      reason: row.reason || row.Reason || row.REASON || 'Bulk Upload',
      reportedBy: req.user._id
    })).filter(r => r.phone || r.email);

    if (!records.length) {
      return res.status(400).json({ error: 'No valid records found in sheet. Ensure columns are named phone, email, address, reason.' });
    }

    // 4. Bulk Insert
    await Customer.insertMany(records);

    res.status(201).json({ 
      message: `${records.length} customers blacklisted successfully via bulk upload.` 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const StoreCustomer = require('../models/StoreCustomer');

// ... existing code ...

// Get My Customers
router.get('/my-customers', requireAuth('store'), async (req, res) => {
  try {
    const customers = await StoreCustomer.find({ storeId: req.user._id }).sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Single Customer
router.post('/my-customers', requireAuth('store'), async (req, res) => {
  try {
    const customer = new StoreCustomer({ ...req.body, storeId: req.user._id });
    await customer.save();
    res.status(201).json({ message: 'Customer added to your database', customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk Upload My Customers
// Delete Personal Customer
router.delete('/my-customers/:id', requireAuth('store'), async (req, res) => {
  try {
    await StoreCustomer.findOneAndDelete({ _id: req.params.id, storeId: req.user._id });
    res.json({ message: 'Customer removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk Upload Handler Logic
const bulkUploadCustomers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please select a valid Excel file.' });
    }

    let workbook;
    try {
      const absolutePath = path.resolve(req.file.path);
      workbook = xlsx.readFile(absolutePath);
    } catch (readError) {
      return res.status(400).json({ error: 'Could not read Excel file.' });
    }

    let sheetData = [];
    for (const name of workbook.SheetNames) {
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[name]);
      if (data.length > 0) {
        sheetData = data;
        break;
      }
    }

    const records = sheetData.map(row => {
      const findVal = (possibleKeys) => {
        const key = Object.keys(row).find(k => possibleKeys.includes(k.toLowerCase().trim()));
        return key ? String(row[key]).trim() : '';
      };

      return {
        name: findVal(['name', 'full name', 'customer name', 'username']) || 'Unknown',
        phone: findVal(['phone', 'mobile', 'contact', 'phone number', 'mobile number']),
        email: findVal(['email', 'email address', 'mail']),
        address: findVal(['address', 'full address', 'location', 'city']),
        notes: findVal(['notes', 'reason', 'description', 'remark']),
        storeId: req.user._id
      };
    }).filter(r => r.phone && r.phone.length >= 7);

    if (!records.length) {
      const foundKeys = sheetData.length > 0 ? Object.keys(sheetData[0]).join(', ') : 'None';
      return res.status(400).json({ error: `No valid records found. Found columns: [${foundKeys}]` });
    }

    try {
      await StoreCustomer.insertMany(records, { ordered: false }); 
    } catch (bulkError) {
      if (bulkError.code !== 11000) throw bulkError;
    }

    res.status(201).json({ message: `${records.length} customers processed successfully.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bulk Upload My Customers Route
router.post('/my-customers/bulk', requireAuth('store'), upload.single('file'), bulkUploadCustomers);

module.exports = router;
