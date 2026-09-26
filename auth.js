const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Helper: generate JWT
const signToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      userId: user.userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );

// Helper: sanitize user
const sanitize = (user) => ({
  _id: user._id,
  userId: user.userId,
  companyName: user.companyName,
  logo: user.logo || null,
  plan: user.plan,
  pagesPrinted: user.pagesPrinted,
  subscriptionDate: user.subscriptionDate,
});

// ─── SIGNUP ────────────────────────────────────────────────────────────────
// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const {
      companyName,
      userId,
      password,
      logo = null,
    } = req.body;

    if (!companyName || !userId || !password) {
      return res.status(400).json({
        message: 'All fields required',
      });
    }

    if (logo) {
      if (
        typeof logo !== 'string' ||
        !logo.startsWith('data:image/')
      ) {
        return res.status(400).json({
          message: 'Invalid logo format',
        });
      }

      if (logo.length > 1500000) {
        return res.status(400).json({
          message: 'Logo is too large',
        });
      }
    }

    const exists = await User.findOne({ userId });

    if (exists) {
      return res.status(409).json({
        message: 'User ID already registered',
      });
    }

    await User.create({
      companyName,
      userId,
      password,
      logo: logo || null,
    });

    res.status(201).json({
      message: 'Registered successfully',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ─── LOGIN ─────────────────────────────────────────────────────────────────
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const {
      userId,
      password,
    } = req.body;

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid User ID or Password',
      });
    }

    const match = await user.comparePassword(password);

    if (!match) {
      return res.status(401).json({
        message: 'Invalid User ID or Password',
      });
    }

    const token = signToken(user);

    res.json({
      token,
      user: sanitize(user),
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ─── FORGOT PASSWORD: SEND CODE ────────────────────────────────────────────
// POST /api/auth/forgot/send-code
router.post('/forgot/send-code', async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({
        message: 'User ID not found',
      });
    }

    const code = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.resetCode = code;
    user.resetCodeExpiry = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save({
      validateBeforeSave: false,
    });

    res.json({
      message: 'Reset code generated',
      code,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ─── FORGOT PASSWORD: VERIFY CODE + RESET ─────────────────────────────────
// POST /api/auth/forgot/reset
router.post('/forgot/reset', async (req, res) => {
  try {
    const {
      userId,
      code,
      newPassword,
    } = req.body;

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({
        message: 'User ID not found',
      });
    }

    if (
      user.resetCode !== code ||
      Date.now() > user.resetCodeExpiry
    ) {
      return res.status(400).json({
        message: 'Invalid or expired reset code',
      });
    }

    user.password = newPassword;
    user.resetCode = null;
    user.resetCodeExpiry = null;

    await user.save();

    res.json({
      message: 'Password reset successfully',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ─── AUTH MIDDLEWARE ───────────────────────────────────────────────────────
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith('Bearer ')
  ) {
    return res.status(401).json({
      message: 'Not authenticated',
    });
  }

  try {
    const token = authHeader.split(' ')[1];

    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    next();
  } catch {
    res.status(401).json({
      message: 'Token invalid or expired',
    });
  }
};

// ─── UPDATE COMPANY LOGO ──────────────────────────────────────────────────
// PATCH /api/auth/logo
router.patch('/logo', protect, async (req, res) => {
  try {
    const { logo } = req.body;

    if (!logo) {
      return res.status(400).json({
        message: 'Logo is required',
      });
    }

    if (
      typeof logo !== 'string' ||
      !logo.startsWith('data:image/')
    ) {
      return res.status(400).json({
        message: 'Invalid logo format',
      });
    }

    if (logo.length > 1500000) {
      return res.status(400).json({
        message: 'Logo is too large',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    user.logo = logo;

    await user.save({
      validateBeforeSave: false,
    });

    res.json({
      message: 'Logo updated successfully',
      user: sanitize(user),
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ─── REMOVE COMPANY LOGO ──────────────────────────────────────────────────
// PATCH /api/auth/logo/remove
router.patch('/logo/remove', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    user.logo = null;

    await user.save({
      validateBeforeSave: false,
    });

    res.json({
      message: 'Logo removed successfully',
      user: sanitize(user),
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ─── UPDATE PLAN ──────────────────────────────────────────────────────────
// PATCH /api/auth/update-plan
router.patch('/update-plan', protect, async (req, res) => {
  try {
    const { plan } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    user.plan = plan;
    user.subscriptionDate = new Date();

    if (plan !== 'free') {
      user.pagesPrinted = 0;
    }

    await user.save({
      validateBeforeSave: false,
    });

    res.json({
      user: sanitize(user),
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ─── INCREMENT PAGES PRINTED ───────────────────────────────────────────────
// PATCH /api/auth/increment-pages
router.patch('/increment-pages', protect, async (req, res) => {
  try {
    const { count } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: {
          pagesPrinted: count,
        },
      },
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.json({
      pagesPrinted: user.pagesPrinted,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ─── ADMIN: GET ALL USERS ─────────────────────────────────────────────────
// GET /api/auth/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find(
      {},
      '-password -resetCode -resetCodeExpiry'
    );

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;