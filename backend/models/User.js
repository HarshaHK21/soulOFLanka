// backend/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { // Frontend eke 'name' field ekata map wenawa
    type: String,
    required: true,
    unique: true, // Username unique wenna one
  },
  email: {
    type: String,
    required: true,
    unique: true, // Email unique wenna one
  },
  password: {
    type: String,
    required: true,
  },
  role: { // 'user', 'vendor', or 'admin'
    type: String,
    enum: ['user', 'vendor', 'admin'], // Allowed roles
    default: 'user', // Default role for new registrations
  },
  businessName: { // Only for vendors
    type: String,
    required: function() { return this.role === 'vendor'; } // Required only if role is 'vendor'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);