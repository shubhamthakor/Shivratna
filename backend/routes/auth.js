const router  = require('express').Router();
const jwt     = require('jsonwebtoken');
const Admin   = require('../models/Admin');
const protect = require('../middleware/auth');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ success: false, message: 'Username and password required.' });

    const admin = await Admin.findOne({ username: username.trim() });
    if (!admin || !(await admin.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, username: admin.username, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ success: true, token, admin: { name: admin.name, username: admin.username, email: admin.email } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.get('/verify', protect, async (req, res) => {
  const admin = await Admin.findById(req.admin.id).select('-password');
  res.json({ success: true, admin });
});

module.exports = router;
