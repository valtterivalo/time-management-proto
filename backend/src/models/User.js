const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  
  // Analytics and preferences
  lastLogin: { type: Date, default: Date.now },
  preferences: {
    theme: { type: String, default: 'light' },
    notificationsEnabled: { type: Boolean, default: true },
    focusSessionDuration: { type: Number, default: 25 }, // in minutes
    breakDuration: { type: Number, default: 5 } // in minutes
  },
  
  // Activity stats
  stats: {
    tasksCompleted: { type: Number, default: 0 },
    totalFocusTime: { type: Number, default: 0 }, // in seconds
    focusSessionsCompleted: { type: Number, default: 0 }
  },
  
  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);