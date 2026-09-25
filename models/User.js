const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, trim: true }, // email or mobile
  companyName: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  plan: { type: String, default: null },            // null, 'free', '299', '999'
  pagesPrinted: { type: Number, default: 0 },
  subscriptionDate: { type: Date, default: null },
  resetCode: { type: String, default: null },
  resetCodeExpiry: { type: Date, default: null },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
