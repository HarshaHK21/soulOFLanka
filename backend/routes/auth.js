// backend/routes/auth.js (Update this file)

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Function to generate a random 6-digit OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// @route   POST /api/auth/register
// @desc    Register a new user (user or vendor)
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password, role, businessName } = req.body;
    try {
        // Check if user with this email already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }
        // Check if username already exists
        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'Username already taken' });
        }
        // Validate businessName for vendors
        if (role === 'vendor' && !businessName) {
            return res.status(400).json({ msg: 'Business name is required for vendor registration' });
        }

        // Generate OTP
        const otp = generateOtp();
        const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes from now

        // Create new user instance
        user = new User({
            username,
            email,
            password,
            role: role || 'user',
            ...(role === 'vendor' && { businessName }),
            otp, // Store OTP
            otpExpires, // Store OTP expiration
            isVerified: false // User is not verified yet
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();

        // --- Send Welcome Email with OTP ---
        const subject = 'Welcome to Soul of Sri Lanka! Your Verification Code';
        const text = `Dear ${username},\n\nWelcome to Soul of Sri Lanka! We're thrilled to have you join our community.\n\nYour One-Time Password (OTP) for email verification is: ${otp}\n\nThis OTP is valid for 10 minutes. Please use it to verify your account.\n\nBest regards,\nYour Soul of Sri Lanka Team`;
        
        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #0056b3;">Welcome to Soul of Sri Lanka!</h2>
                <p>Dear ${username},</p>
                <p>We're thrilled to have you join our community!</p>
                <p>To complete your registration and verify your email, please use the following One-Time Password (OTP):</p>
                <h3 style="color: #28a745; text-align: center; margin: 20px 0; padding: 10px; background-color: #e9ecef; border-radius: 5px;">${otp}</h3>
                <p>This OTP is valid for 10 minutes.</p>
                <p>Please enter this code on the verification page to activate your account. If you did not request this, please ignore this email.</p>
                <p style="margin-top: 30px; font-size: 0.9em; color: #666;">
                    Best regards,<br>
                    The Soul of Sri Lanka Team
                </p>
            </div>
        `;
        
        const emailResult = await sendEmail(email, subject, text, html);
        if (emailResult.success) {
            console.log('Welcome and OTP email sent successfully to:', email);
        } else {
            console.error('Failed to send welcome and OTP email to:', email, emailResult.error);
            // Decide if registration should fail if email fails.
            // For now, it will continue, but log the error.
        }
        // -------------------------

        // Generate JWT token for immediate login after registration (optional, can wait for verification)
        const payload = {
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                isVerified: user.isVerified // Include verification status in token
            },
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role, businessName: user.businessName, isVerified: user.isVerified } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP for user registration
// @access  Public
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'User not found.' });
        }

        if (user.isVerified) {
            return res.status(400).json({ msg: 'Email already verified.' });
        }

        // Check if OTP matches and is not expired
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            // Clear OTP fields to prevent reuse or further attempts with expired/incorrect OTP
            user.otp = null;
            user.otpExpires = null;
            await user.save(); // Save the cleared OTP fields
            return res.status(400).json({ msg: 'Invalid or expired OTP.' });
        }

        // Mark user as verified and clear OTP fields
        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.json({ msg: 'Email successfully verified!' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/resend-otp
// @desc    Resend OTP to user
// @access  Public
router.post('/resend-otp', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        if (user.isVerified) {
            return res.status(400).json({ msg: 'Email already verified. No need to resend OTP.' });
        }

        // Generate new OTP
        const otp = generateOtp();
        const otpExpires = Date.now() + 10 * 60 * 1000; // New OTP valid for 10 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send new OTP email
        const subject = 'Soul of Sri Lanka: Your New Verification Code';
        const text = `Dear ${user.username},\n\nHere is your new One-Time Password (OTP) for email verification: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nBest regards,\nYour Soul of Sri Lanka Team`;
        
        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #0056b3;">Soul of Sri Lanka: New Verification Code</h2>
                <p>Dear ${user.username},</p>
                <p>You requested a new One-Time Password (OTP). Please use the following code to verify your email:</p>
                <h3 style="color: #28a745; text-align: center; margin: 20px 0; padding: 10px; background-color: #e9ecef; border-radius: 5px;">${otp}</h3>
                <p>This OTP is valid for 10 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
                <p style="margin-top: 30px; font-size: 0.9em; color: #666;">
                    Best regards,<br>
                    The Soul of Sri Lanka Team
                </p>
            </div>
        `;

        const emailResult = await sendEmail(user.email, subject, text, html);
        if (emailResult.success) {
            console.log('New OTP email sent successfully to:', user.email);
            res.json({ msg: 'OTP resent successfully.' });
        } else {
            console.error('Failed to resend OTP email to:', user.email, emailResult.error);
            res.status(500).json({ msg: 'Failed to resend OTP. Please try again later.' });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// ... (your existing login route below this)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Add a check for email verification status before login
        if (!user.isVerified) {
            return res.status(403).json({ msg: 'Please verify your email address before logging in. A new OTP has been sent to your email.' });
            // Optionally, resend OTP here automatically
            // const otp = generateOtp();
            // const otpExpires = Date.now() + 10 * 60 * 1000;
            // user.otp = otp;
            // user.otpExpires = otpExpires;
            // await user.save();
            // await sendEmail(user.email, 'Verify Your Email for Soul of Sri Lanka', `Your OTP is: ${otp}`, `<p>Your OTP is: <strong>${otp}</strong></p>`);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                isVerified: user.isVerified // Ensure this is included in the payload
            },
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role, businessName: user.businessName, isVerified: user.isVerified } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;