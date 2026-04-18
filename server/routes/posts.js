const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const prisma = require('../lib/prisma');
const { handleSuccess, handleError } = require('../utils/responseHandler');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const tag = req.query.tag || '';
    const ALLOWED_SORT_FIELDS = ['date', 'title', 'author'];
    const rawSortBy = req.query.sortBy || 'date';
    const sortBy = ALLOWED_SORT_FIELDS.includes(rawSortBy) ? rawSortBy : 'date';
    const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';
    
    const skip = (page - 1) * limit;
    
    const conditions = [];
    if (search) {
      conditions.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } }
        ]
      });
    }
    if (tag) {
      // 使用陣列包含查詢可避免模糊比對誤命中相似標籤
      conditions.push({ tags: { has: tag } });
    }
    const where = conditions.length > 0 ? { AND: conditions } : {};
    
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
    
    handleSuccess(res, {
      posts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    handleError(res, err);
  }
});

router.get('/latest', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      take: 3,
      orderBy: {
        date: 'desc'
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        coverImage: true,
        date: true,
        author: true,
        tags: true
      }
    });
    
    handleSuccess(res, posts);
  } catch (err) {
    handleError(res, err, 'Failed to fetch latest posts');
  }
});

router.get('/list', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        date: 'desc'
      },
      include: {
        comments: true
      }
    });
    
    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      commentsCount: post.comments.length
    }));
    
    handleSuccess(res, formattedPosts);
  } catch (err) {
    handleError(res, err);
  }
});

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
    
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    handleSuccess(res, post);
  } catch (err) {
    handleError(res, err);
  }
});

router.post('/', adminAuth, async (req, res) => {
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
    
    handleSuccess(res, post, 201);
  } catch (err) {
    handleError(res, err, 'Error creating post');
  }
});

router.put('/:id', adminAuth, async (req, res) => {
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
    
    handleSuccess(res, post);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ msg: 'Post not found' });
    handleError(res, err);
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await prisma.post.delete({
      where: {
        id: req.params.id
      }
    });
    
    handleSuccess(res, { msg: 'Post removed' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ msg: 'Post not found' });
    handleError(res, err);
  }
});

router.post('/:id/comments', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: req.params.id
      }
    });
    
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    
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
    
    handleSuccess(res, comments, 201);
  } catch (err) {
    handleError(res, err);
  }
});


module.exports = router;
