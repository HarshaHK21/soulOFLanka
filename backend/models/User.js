const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: { // Assuming you now use 'username' based on auth.js
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: { // Using 'role' instead of 'isVendor' based on auth.js
        type: String,
        enum: ['user', 'vendor', 'admin'],
        default: 'user'
    },
    businessName: {
        type: String,
        required: function() { return this.role === 'vendor'; }
    },
    // --- New fields for OTP ---
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    },
    isVerified: { // To track if email is verified
        type: Boolean,
        default: false
    },
    // --- End new fields ---
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);