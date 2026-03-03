const express = require('express');
const router = express.Router();
const { getBlogPosts } = require('../controllers/blogController');

// Route to get all blog posts
router.get('/', getBlogPosts);

module.exports = router;