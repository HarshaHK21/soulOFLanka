const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth, authorizeRoles } = require('../middleware/auth'); // Import auth middleware

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/', auth, authorizeRoles('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Get all users, but exclude password field
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (Admin only)
// @access  Private (Admin)
router.get('/:id', auth, authorizeRoles('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') { // Handle invalid ObjectId format
            return res.status(400).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/users
// @desc    Add a new user (Admin only)
// @access  Private (Admin)
router.post('/', auth, authorizeRoles('admin'), async (req, res) => {
    const { username, email, password, role, agentLicense } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }

        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'Username already taken' });
        }

        if (role === 'agent' && !agentLicense) {
            return res.status(400).json({ msg: 'Business name is required for agent role' });
        }

        user = new User({
            username,
            email,
            password,
            role: role || 'user',
            ...(role === 'agent' && { agentLicense }),
            isVerified: true // Admins can add verified users directly
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        res.status(201).json({ msg: 'User added successfully', user: user.toObject({ getters: true, versionKey: false }) });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/users/:id
// @desc    Update user details (Admin only)
// @access  Private (Admin)
router.put('/:id', auth, authorizeRoles('admin'), async (req, res) => {
    const { username, email, role, agentLicense, isVerified } = req.body;

    // Build user object
    const userFields = {};
    if (username) userFields.username = username;
    if (email) userFields.email = email;
    if (role) userFields.role = role;
    if (agentLicense !== undefined) userFields.agentLicense = agentLicense; // Allow clearing businessName
    if (isVerified !== undefined) userFields.isVerified = isVerified;

    try {
        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check for duplicate email/username if they are being updated
        if (email && email !== user.email) {
            const existingEmailUser = await User.findOne({ email });
            if (existingEmailUser) {
                return res.status(400).json({ msg: 'Email already in use by another user' });
            }
        }
        if (username && username !== user.username) {
            const existingUsernameUser = await User.findOne({ username });
            if (existingUsernameUser) {
                return res.status(400).json({ msg: 'Username already taken by another user' });
            }
        }

        // Handle password change if provided (optional for admin update)
        // This route doesn't handle password changes directly for security reasons.
        // A separate route for admin to reset password might be better.
        // If you want to allow password change here, you'd need to hash it.

        user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: userFields },
            { new: true, runValidators: true } // Return the updated document and run schema validators
        ).select('-password'); // Exclude password from response

        res.json({ msg: 'User updated successfully', user });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/users/:id
// @desc    Delete a user (Admin only)
// @access  Private (Admin)
router.delete('/:id', auth, authorizeRoles('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Prevent admin from deleting themselves (optional but recommended)
        if (req.user.id === req.params.id) {
            return res.status(400).json({ msg: 'Cannot delete your own admin account via this route' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
