const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const auth = require('../middleware/auth');

// @route   GET api/posts
// @desc    Get all posts with pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'date';
    const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';
    
    const skip = (page - 1) * limit;
    
    // Build search filter
    const where = search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ]
    } : {};
    
    const posts = await prisma.post.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: limit,
      include: {
        comments: true
      }
    });
    
    const total = await prisma.post.count({ where });
    
    res.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: req.params.id
      },
      include: {
        comments: true
      }
    });
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const post = await prisma.post.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        excerpt: req.body.excerpt,
        author: req.body.author || 'Timmy',
        tags: req.body.tags || [],
        coverImage: req.body.coverImage || null
      }
    });
    
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/:id
// @desc    Update a post
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await prisma.post.update({
      where: {
        id: req.params.id
      },
      data: {
        title: req.body.title,
        content: req.body.content,
        excerpt: req.body.excerpt,
        author: req.body.author,
        tags: req.body.tags,
        coverImage: req.body.coverImage
      },
      include: {
        comments: true
      }
    });
    
    res.json(post);
  } catch (err) {
    console.error(err.message);
    
    if (err.code === 'P2025') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    await prisma.post.delete({
      where: {
        id: req.params.id
      }
    });
    
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.code === 'P2025') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts/:id/comments
// @desc    Add comment to a post
// @access  Public
router.post('/:id/comments', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: req.params.id
      }
    });
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    const comment = await prisma.comment.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        content: req.body.content,
        postId: req.params.id
      }
    });
    
    const comments = await prisma.comment.findMany({
      where: {
        postId: req.params.id
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
