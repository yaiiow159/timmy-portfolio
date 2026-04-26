const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const prisma = require('../lib/prisma');
const { handleSuccess, handleError } = require('../utils/responseHandler');

const router = express.Router();

const MAX_LIMIT = 100;

function mapListPost(post) {
  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    author: post.author,
    date: post.date,
    tags: post.tags,
    coverImage: post.coverImage,
    content: '',
    comments: [],
    commentsCount: post._count.comments
  };
}

router.get('/', async (req, res) => {
  try {
    const mode = req.query.mode || 'full';
    const listMode = mode === 'list' || mode === 'summary';

    let page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 10;
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;

    const search = req.query.search || '';
    const tag = req.query.tag || '';
    const ALLOWED_SORT_FIELDS = ['date', 'title', 'author', 'comments'];
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
          { excerpt: { contains: search, mode: 'insensitive' } },
          { author: { contains: search, mode: 'insensitive' } }
        ]
      });
    }
    if (tag) {
      conditions.push({ tags: { has: tag } });
    }
    const where = conditions.length > 0 ? { AND: conditions } : {};

    let orderBy;
    if (sortBy === 'comments') {
      orderBy = { comments: { _count: sortOrder } };
    } else {
      orderBy = { [sortBy]: sortOrder };
    }

    if (listMode) {
      const posts = await prisma.post.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          excerpt: true,
          author: true,
          date: true,
          tags: true,
          coverImage: true,
          _count: { select: { comments: true } }
        }
      });

      const total = await prisma.post.count({ where });

      handleSuccess(res, {
        posts: posts.map(mapListPost),
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } else {
      const posts = await prisma.post.findMany({
        where,
        orderBy,
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
    }
  } catch (err) {
    handleError(res, err);
  }
});

router.get('/tags', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      select: { tags: true }
    });
    const tagSet = new Set(posts.flatMap(p => p.tags));
    handleSuccess(res, [...tagSet].sort());
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

/**
 * 相鄰文章：依 date 大至小、同時刻以 id 次序穩定；newer=較新、older=較舊
 */
router.get('/:id/prev-next', async (req, res) => {
  try {
    const { id } = req.params;
    const current = await prisma.post.findUnique({
      where: { id },
      select: { id: true, date: true },
    });
    if (!current) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    const [newer, older] = await Promise.all([
      prisma.post.findFirst({
        where: {
          OR: [
            { date: { gt: current.date } },
            { AND: [{ date: current.date }, { id: { gt: current.id } }] },
          ],
        },
        orderBy: [{ date: 'asc' }, { id: 'asc' }],
        select: { id: true, title: true },
      }),
      prisma.post.findFirst({
        where: {
          OR: [
            { date: { lt: current.date } },
            { AND: [{ date: current.date }, { id: { lt: current.id } }] },
          ],
        },
        orderBy: [{ date: 'desc' }, { id: 'desc' }],
        select: { id: true, title: true },
      }),
    ]);
    handleSuccess(res, { newer, older });
  } catch (err) {
    handleError(res, err);
  }
});

router.get('/:id/related', async (req, res) => {
  try {
    const { id } = req.params;
    let limit = parseInt(req.query.limit, 10) || 3;
    if (limit < 1) limit = 3;
    if (limit > 10) limit = 10;

    const current = await prisma.post.findUnique({
      where: { id },
      select: { tags: true }
    });

    if (!current) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const selectList = {
      id: true,
      title: true,
      excerpt: true,
      author: true,
      date: true,
      tags: true,
      coverImage: true,
      _count: { select: { comments: true } }
    };

    let posts;
    if (current.tags.length > 0) {
      posts = await prisma.post.findMany({
        where: {
          id: { not: id },
          tags: { hasSome: current.tags }
        },
        orderBy: { date: 'desc' },
        take: limit,
        select: selectList
      });
    } else {
      posts = await prisma.post.findMany({
        where: { id: { not: id } },
        orderBy: { date: 'desc' },
        take: limit,
        select: selectList
      });
    }

    handleSuccess(res, posts.map(mapListPost));
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

    await prisma.comment.create({
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
