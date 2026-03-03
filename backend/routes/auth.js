const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure path to your User model is correct
const sendEmail = require('../utils/sendEmail'); // Ensure you have this email utility

// Function to generate a random 6-digit OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// @route   POST /api/auth/register
// @desc    Register a new user or agent and send OTP
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password, role, agentLicense } = req.body;
    
    try {
        // --- Validation ---
        if (!username || !email || !password) {
            return res.status(400).json({ msg: 'Please provide all required fields.' });
        }
        if (role === 'agent' && !agentLicense) {
            return res.status(400).json({ msg: 'Agent License is required for agent registration.' });
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User with this email already exists.' });
        }

        // --- User Creation ---
        const otp = generateOtp();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        const newUser = new User({
            username,
            email,
            password,
            role: role || 'user',
            agentLicense: role === 'agent' ? agentLicense : undefined,
            otp,
            otpExpires,
            isVerified: false,
        });

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        
        await newUser.save();

        // --- Send Welcome Email with OTP ---
        const subject = 'Welcome to Soul of Sri Lanka! Your Verification Code';
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #0056b3;">Welcome to Soul of Sri Lanka!</h2>
                <p>Dear ${username},</p>
                <p>To complete your registration, please use the following One-Time Password (OTP):</p>
                <h3 style="color: #28a745; text-align: center; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">${otp}</h3>
                <p>This code is valid for 10 minutes. Please enter it on the verification page to activate your account.</p>
                <p style="margin-top: 20px; color: #666;">Best regards,<br/>The Soul of Sri Lanka Team</p>
            </div>`;
        
        await sendEmail(email, subject, `Your OTP is ${otp}`, html);
        
        // Only send a success message. Do NOT send a token until after verification and login.
        res.status(201).json({ msg: 'Registration successful! Please check your email for an OTP.' });

    } catch (err) {
        console.error('REGISTRATION ERROR:', err.message);
        res.status(500).json({ msg: 'Server error during registration. Please check backend logs for details.' });
    }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP for a user
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'User not found.' });
        }
        if (user.isVerified) {
            return res.status(400).json({ msg: 'Email is already verified.' });
        }
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ msg: 'Invalid or expired OTP.' });
        }

        user.isVerified = true;
        user.otp = undefined; // Use undefined to remove the field from the document
        user.otpExpires = undefined;
        await user.save();

        res.json({ msg: 'Email successfully verified! You can now log in.' });

    } catch (err) {
        console.error('VERIFY OTP ERROR:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/resend-otp
// @desc    Resend OTP to a user
router.post('/resend-otp', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }
        if (user.isVerified) {
            return res.status(400).json({ msg: 'Email is already verified.' });
        }

        const otp = generateOtp();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        const subject = 'Your New Soul of Sri Lanka Verification Code';
        const html = `<p>Your new OTP is: <strong>${otp}</strong></p>`;
        await sendEmail(email, subject, `Your new OTP is ${otp}`, html);

        res.json({ msg: 'A new OTP has been sent to your email.' });

    } catch (err) {
        console.error('RESEND OTP ERROR:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset OTP
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User with this email does not exist.' });
        }

        const otp = generateOtp();
        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();

        const subject = 'Reset Your Password - Soul of Sri Lanka';
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #0056b3;">Password Reset Request</h2>
                <p>Dear ${user.username},</p>
                <p>We received a request to reset your password. Use the OTP below to proceed:</p>
                <h3 style="color: #28a745; text-align: center; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">${otp}</h3>
                <p>This code is valid for 10 minutes.</p>
                <p>If you didn't request this, you can safely ignore this email.</p>
            </div>`;
        
        await sendEmail(email, subject, `Your Password Reset OTP is ${otp}`, html);

        res.json({ msg: 'Password reset OTP sent to your email.' });

    } catch (err) {
        console.error('FORGOT PASSWORD ERROR:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/verify-reset-otp
// @desc    Verify password reset OTP
router.post('/verify-reset-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }
        
        if (user.resetPasswordOtp !== otp || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ msg: 'Invalid or expired OTP.' });
        }

        res.json({ msg: 'OTP verified successfully.' });

    } catch (err) {
        console.error('VERIFY RESET OTP ERROR:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with OTP
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        if (user.resetPasswordOtp !== otp || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ msg: 'Invalid or expired OTP. Please request a new one.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        // Clear reset tokens
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpires = undefined;
        
        await user.save();

        res.json({ msg: 'Password has been reset successfully. You can now login.' });

    } catch (err) {
        console.error('RESET PASSWORD ERROR:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/login
// @desc    Login a user or agent
router.post('/login', async (req, res) => {
    // This route seems correct from your code, no changes needed here.
    const { email, password } = req.body;
    console.log("LOGIN ATTEMPT:", email);

    try {
        let user = await User.findOne({ email });
        if (!user) {
            console.log("Login failed: User not found");
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        if (!user.isVerified) {
            // Optional: You could trigger a resend OTP here
            console.log("Login failed: User not verified");
            return res.status(403).json({ msg: 'Please verify your email address before logging in.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Login failed: Password mismatch");
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        console.log("Login successful:", user.username);
        const payload = { user: { id: user.id } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        agentLicense: user.agentLicense,
                        isVerified: user.isVerified
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
