const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Auth middleware
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Not authenticated' });
  try {
    req.user = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

// Plan amounts in paise (INR × 100)
const PLAN_AMOUNTS = {
  '299': 29900,
  '999': 99900,
};

// ─── CREATE ORDER ──────────────────────────────────────────────────────────
// POST /api/payment/create-order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { plan } = req.body;
    const amount = PLAN_AMOUNTS[plan];
    if (!amount) return res.status(400).json({ message: 'Invalid plan' });

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── VERIFY PAYMENT ────────────────────────────────────────────────────────
// POST /api/payment/verify
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    // Verify signature
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSig !== razorpay_signature)
      return res.status(400).json({ message: 'Payment verification failed. Invalid signature.' });

    // Update user plan in DB
    const user = await User.findById(req.user.id);
    user.plan = plan;
    user.subscriptionDate = new Date();
    user.pagesPrinted = plan !== 'free' ? 0 : user.pagesPrinted;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      user: {
        _id: user._id,
        userId: user.userId,
        companyName: user.companyName,
        plan: user.plan,
        pagesPrinted: user.pagesPrinted,
        subscriptionDate: user.subscriptionDate,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
