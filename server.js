require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');

const app = express();

// CORS — allow Vercel frontend + localhost
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    /\.vercel\.app$/,
  ],
  credentials: true,
}));

app.use(express.json());

// Health check
app.get('/', (req, res) => res.json({ status: 'Logistics API is running ✅' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

// Connect to MongoDB then start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
