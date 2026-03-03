const BlogPost = require('../models/blogPostModel');

// @desc    Fetch all blog posts
// @route   GET /api/blogs
// @access  Public
const getBlogPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find({}); // find({}) gets all documents
    res.status(200).json(posts);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getBlogPosts };