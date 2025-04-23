import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// @route   GET api/admin/stats
// @desc    Get admin dashboard stats
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const postsCount = await prisma.post.count();
    const projectsCount = await prisma.project.count();
    const commentsCount = await prisma.comment.count();
    
    res.json({
      postsCount,
      projectsCount,
      commentsCount
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
