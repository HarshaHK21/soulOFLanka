const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, authorizeRoles } = require('../middleware/auth'); // Import auth middleware

// @route   GET /api/products
// @desc    Get all products (Publicly accessible for display, or Admin for management)
// @access  Public (or Private for admin panel) - For admin panel, we will use auth
router.get('/', auth, authorizeRoles('admin'), async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID (Admin only)
// @access  Private (Admin)
router.get('/:id', auth, authorizeRoles('admin'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Product not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/products
// @desc    Add a new product (Admin only)
// @access  Private (Admin)
router.post('/', auth, authorizeRoles('admin'), async (req, res) => {
    const { name, category, price, stock, description, imageUrl } = req.body;

    try {
        let product = await Product.findOne({ name });
        if (product) {
            return res.status(400).json({ msg: 'Product with this name already exists' });
        }

        product = new Product({
            name,
            category,
            price,
            stock,
            description,
            imageUrl
        });

        await product.save();
        res.status(201).json({ msg: 'Product added successfully', product });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/products/:id
// @desc    Update product details (Admin only)
// @access  Private (Admin)
router.put('/:id', auth, authorizeRoles('admin'), async (req, res) => {
    const { name, category, price, stock, description, imageUrl } = req.body;

    const productFields = {};
    if (name) productFields.name = name;
    if (category) productFields.category = category;
    if (price !== undefined) productFields.price = price;
    if (stock !== undefined) productFields.stock = stock;
    if (description !== undefined) productFields.description = description;
    if (imageUrl !== undefined) productFields.imageUrl = imageUrl;

    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        if (name && name !== product.name) {
            const existingProduct = await Product.findOne({ name });
            if (existingProduct) {
                return res.status(400).json({ msg: 'Another product with this name already exists' });
            }
        }

        product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: productFields },
            { new: true, runValidators: true }
        );

        res.json({ msg: 'Product updated successfully', product });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Product not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
// @access  Private (Admin)
router.delete('/:id', auth, authorizeRoles('admin'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Product not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
