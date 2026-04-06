const express = require('express');
const auth = require('../middleware/auth');
const prisma = require('../lib/prisma');
const { handleSuccess, handleError } = require('../utils/responseHandler');

const router = express.Router();

router.get('/stats', auth, async (req, res) => {
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
