const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const prisma = require('../lib/prisma');
const { handleSuccess, handleError } = require('../utils/responseHandler');

const router = express.Router();

router.get('/stats', adminAuth, async (req, res) => {
  try {
    // 三個 count 互不依賴，並行執行可將延遲從 3×RTT 降為 1×RTT
    const [postsCount, projectsCount, commentsCount] = await Promise.all([
      prisma.post.count(),
      prisma.project.count(),
      prisma.comment.count()
    ]);
    
    handleSuccess(res, { postsCount, projectsCount, commentsCount });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
