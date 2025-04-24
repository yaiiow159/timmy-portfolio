const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 獲取最近活動列表
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        take: parseInt(limit),
        skip,
        orderBy: {
          date: 'desc'
        }
      }),
      prisma.activity.count()
    ]);

    res.json({
      activities,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 創建新活動記錄
router.post('/', async (req, res) => {
  try {
    const { type, title, description, userId, userName, targetId, targetType } = req.body;
    
    const activity = await prisma.activity.create({
      data: {
        type,
        title,
        description,
        userId,
        userName,
        targetId,
        targetType
      }
    });

    res.status(201).json(activity);
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 