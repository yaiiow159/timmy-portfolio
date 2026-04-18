const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const prisma = require('../lib/prisma');
const { handleSuccess, handleError } = require('../utils/responseHandler');

const router = express.Router();

router.get('/stats', adminAuth, async (req, res) => {
  try {
    const postsCount = await prisma.post.count();
    const projectsCount = await prisma.project.count();
    const commentsCount = await prisma.comment.count();
    
    handleSuccess(res, { postsCount, projectsCount, commentsCount });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
