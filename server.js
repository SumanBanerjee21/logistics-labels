require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');

const app = express();

const allowedOrigins = [
  'https://logistics-labels-5akf6jt9s-sumanbanerjee21s-projects.vercel.app',
  'http://localhost:5173',
];

// CORS
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests without an Origin header
    // (for example, server-to-server requests)
    if (!origin) {
      return callback(null, true);
    }

    // Allow the exact production Vercel URL
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow all Vercel deployment URLs
    if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Handle CORS preflight requests
app.options('*', cors());

// Allow larger JSON payloads for logo uploads
app.use(express.json({
  limit: '2mb',
}));

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'Logistics API is running ✅',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

// Connect to MongoDB then start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }); 