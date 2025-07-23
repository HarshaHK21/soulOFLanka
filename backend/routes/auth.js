const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // User model eka import karanna
const sendEmail = require('../utils/sendEmail'); // Email utility eka import karanna

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
        // Create new user instance
        user = new User({
            username,
            email,
            password, // Password will be hashed below
            role: role || 'user', // Default to 'user' if role is not provided
            ...(role === 'vendor' && { businessName }), // Conditionally add businessName
        });
        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        // Save user to database
        await user.save();

        // --- Send Welcome Email ---
        const subject = 'Welcome to Soul of Sri Lanka!';
        // Make sure to use backticks for template literals for 'text'
        const text = `Dear ${username},\n\nWelcome to Soul of Sri Lanka! We're thrilled to have you join our community.\n\nStart exploring amazing destinations and experiences in Sri Lanka.\n\nBest regards,\nYour Soul of Sri Lanka Team`;
        
        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #0056b3;">Welcome to Soul of Sri Lanka!</h2>
                <p>Dear ${username},</p>
                <p>We're thrilled to have you join our community!</p>
                <p>Your account has been successfully created with the email: <strong>${email}</strong></p>
                <p>Start exploring amazing destinations and experiences in Sri Lanka:</p>
                <p style="text-align: center; margin-top: 20px;">
                    <a href="${process.env.CLIENT_URL}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Explore Now</a>
                </p>
                <p style="margin-top: 30px; font-size: 0.9em; color: #666;">
                    Best regards,<br>
                    The Soul of Sri Lanka Team
                </p>
            </div>
        `;
        
        const emailResult = await sendEmail(email, subject, text, html);
        if (emailResult.success) {
            console.log('Welcome email sent successfully to:', email);
        } else {
            console.error('Failed to send welcome email to:', email, emailResult.error);
            // Email fail wunath registration process eka continue karanna puluwan.
        }
        // -------------------------

        // Generate JWT token for immediate login after registration
        const payload = {
            user: {
                id: user.id,
                username: user.username,
                role: user.role, // Include role in token payload
            },
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Get secret from .env
            { expiresIn: '1h' }, // Token expiration time
            (err, token) => {
                if (err) throw err;
                // Send back token and relevant user info
                res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role, businessName: user.businessName } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user exists by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        // Compare given password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        // Generate JWT token
        const payload = {
            user: {
                id: user.id,
                username: user.username,
                role: user.role, // Include role in token payload
            },
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                // Send back token and relevant user info including role and businessName
                res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role, businessName: user.businessName } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;