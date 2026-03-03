const express = require('express');
const router = express.Router();
const Package = require('../models/Package');

// Create a package
router.post('/', async (req, res) => {
  try {
    const { name, description, price, createdBy } = req.body;
    const pkg = new Package({ name, description, price, createdBy });
    await pkg.save();
    res.status(201).json(pkg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all packages
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find().populate('createdBy', 'name email');
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
