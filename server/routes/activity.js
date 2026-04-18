const { Router } = require('express');
const router = Router();
const prisma = require('../lib/prisma');
const adminAuth = require('../middleware/adminAuth');
const { handleSuccess, handleError, handleBadRequest } = require('../utils/responseHandler');

router.get('/', async (req, res) => {
  try {
    const parsedLimit = Math.max(1, parseInt(req.query.limit) || 10);
    const parsedPage = Math.max(1, parseInt(req.query.page) || 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        skip,
        take: parsedLimit,
        orderBy: { date: 'desc' }
      }),
      prisma.activity.count()
    ]);

    // 統一分頁回應格式可降低前端狀態管理額外分支與相容成本
    handleSuccess(res, {
      activities,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        pages: Math.ceil(total / parsedLimit)
      }
    });
  } catch (error) {
    handleError(res, error, 'Failed to fetch activities');
  }
});

// 建立活動紀錄前再驗證管理角色，可避免一般帳號偽造後台操作軌跡
router.post('/', adminAuth, async (req, res) => {
  try {
    const { type, title, description, userName, targetId, targetType } = req.body;

    if (!type || !title || !description || !userName) {
      return handleBadRequest(res, 'Type, title, description, and userName are required');
    }

    const activity = await prisma.activity.create({
      data: { type, title, description, userName, targetId, targetType }
    });

    handleSuccess(res, activity, 201);
  } catch (error) {
    handleError(res, error, 'Failed to create activity');
  }
});

module.exports = router;
