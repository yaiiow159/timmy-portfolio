const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const prisma = require('../lib/prisma');
const { handleSuccess, handleError } = require('../utils/responseHandler');
const { normalizeImageUrl } = require('../utils/imageUrlNormalizer');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        orderBy: { date: 'desc' },
        skip,
        take: limit
      }),
      prisma.project.count()
    ]);

    handleSuccess(res, { projects, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
  } catch (err) {
    handleError(res, err);
  }
});

router.get('/featured', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        featured: true
      },
      take: 3,
      orderBy: {
        date: 'desc'
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        technologies: true,
        liveUrl: true,
        codeUrl: true,
        projectType: true,
        vcsType: true,
        platformType: true
      }
    });
    
    handleSuccess(res, projects);
  } catch (err) {
    handleError(res, err, 'Failed to fetch featured projects');
  }
});

router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    if (type !== 'work' && type !== 'personal') return res.status(400).json({ msg: 'Invalid project type' });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const where = { projectType: type };
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: limit
      }),
      prisma.project.count({ where })
    ]);

    handleSuccess(res, { projects, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
  } catch (err) {
    handleError(res, err, 'Failed to fetch projects');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: req.params.id
      }
    });
    
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    handleSuccess(res, project);
  } catch (err) {
    handleError(res, err);
  }
});

router.post('/', adminAuth, async (req, res) => {
  try {
    const imageUrl = normalizeImageUrl(req.body.imageUrl);

    const project = await prisma.project.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        technologies: req.body.technologies,
        imageUrl: imageUrl,
        liveUrl: req.body.liveUrl || null,
        codeUrl: req.body.codeUrl || null,
        featured: req.body.featured || false,
        projectType: req.body.projectType || 'personal',
        vcsType: req.body.vcsType || 'github',
        platformType: req.body.platformType || 'web'
      }
    });
    
    handleSuccess(res, project, 201);
  } catch (err) {
    handleError(res, err);
  }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const imageUrl = normalizeImageUrl(req.body.imageUrl);

    const project = await prisma.project.update({
      where: {
        id: req.params.id
      },
      data: {
        title: req.body.title,
        description: req.body.description,
        technologies: req.body.technologies,
        imageUrl: imageUrl,
        liveUrl: req.body.liveUrl,
        codeUrl: req.body.codeUrl,
        featured: req.body.featured,
        projectType: req.body.projectType || 'personal',
        vcsType: req.body.vcsType || 'github',
        platformType: req.body.platformType || 'web'
      }
    });
    
    handleSuccess(res, project);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ msg: 'Project not found' });
    handleError(res, err);
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await prisma.project.delete({
      where: {
        id: req.params.id
      }
    });
    
    handleSuccess(res, { msg: 'Project removed' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ msg: 'Project not found' });
    handleError(res, err);
  }
});

module.exports = router;
