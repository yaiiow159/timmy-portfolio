const { Router } = require('express');
const router = Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        skip,
        take: parseInt(limit),
        orderBy: {
          date: 'desc'
        }
      }),
      prisma.activity.count()
    ]);

    res.json({
      activities,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ 
      error: 'Failed to fetch activities',
      message: error.message 
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { type, title, description, userName, targetId, targetType } = req.body;
    
    if (!type || !title || !description || !userName) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Type, title, description, and userName are required'
      });
    }
    
    const activity = await prisma.activity.create({
      data: {
        type,
        title,
        description,
        userName,
        targetId,
        targetType
      }
    });
    
    res.status(201).json(activity);
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ 
      error: 'Failed to create activity',
      message: error.message 
    });
  }
});

module.exports = router; 