const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Helper: generate JWT
const signToken = (user) =>
  jwt.sign(
    { id: user._id, userId: user.userId },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

// Helper: sanitize user (remove sensitive fields)
const sanitize = (user) => ({
  _id: user._id,
  userId: user.userId,
  companyName: user.companyName,
  plan: user.plan,
  pagesPrinted: user.pagesPrinted,
  subscriptionDate: user.subscriptionDate,
});

// ─── SIGNUP ────────────────────────────────────────────────────────────────
// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { companyName, userId, password } = req.body;
    if (!companyName || !userId || !password)
      return res.status(400).json({ message: 'All fields required' });

    const exists = await User.findOne({ userId });
    if (exists)
      return res.status(409).json({ message: 'User ID already registered' });

    const user = await User.create({ companyName, userId, password });
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── LOGIN ─────────────────────────────────────────────────────────────────
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findOne({ userId });
    if (!user) return res.status(401).json({ message: 'Invalid User ID or Password' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid User ID or Password' });

    const token = signToken(user);
    res.json({ token, user: sanitize(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── FORGOT PASSWORD: SEND CODE ────────────────────────────────────────────
// POST /api/auth/forgot/send-code
router.post('/forgot/send-code', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: 'User ID not found' });

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    user.resetCode = code;
    user.resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save({ validateBeforeSave: false });

    // In production: send via SMS/email. For demo, return in response.
    res.json({ message: 'Reset code generated', code });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── FORGOT PASSWORD: VERIFY CODE + RESET ─────────────────────────────────
// POST /api/auth/forgot/reset
router.post('/forgot/reset', async (req, res) => {
  try {
    const { userId, code, newPassword } = req.body;
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: 'User ID not found' });

    if (user.resetCode !== code || Date.now() > user.resetCodeExpiry)
      return res.status(400).json({ message: 'Invalid or expired reset code' });

    user.password = newPassword; // pre-save hook will hash it
    user.resetCode = null;
    user.resetCodeExpiry = null;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── AUTH MIDDLEWARE ───────────────────────────────────────────────────────
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Not authenticated' });

  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

// ─── UPDATE PLAN ───────────────────────────────────────────────────────────
// PATCH /api/auth/update-plan
router.patch('/update-plan', protect, async (req, res) => {
  try {
    const { plan } = req.body;
    const user = await User.findById(req.user.id);
    user.plan = plan;
    user.subscriptionDate = new Date();
    if (plan !== 'free') user.pagesPrinted = 0;
    await user.save({ validateBeforeSave: false });
    res.json({ user: sanitize(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── INCREMENT PAGES PRINTED ───────────────────────────────────────────────
// PATCH /api/auth/increment-pages
router.patch('/increment-pages', protect, async (req, res) => {
  try {
    const { count } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { pagesPrinted: count } },
      { new: true }
    );
    res.json({ pagesPrinted: user.pagesPrinted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── ADMIN: GET ALL USERS ──────────────────────────────────────────────────
// GET /api/auth/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password -resetCode -resetCodeExpiry');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
