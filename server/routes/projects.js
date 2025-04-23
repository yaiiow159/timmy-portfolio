import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// @route   GET api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        date: 'desc'
      }
    });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/projects/:id
// @desc    Get project by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: req.params.id
      }
    });
    
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/projects
// @desc    Create a project
// @access  Private (would require auth middleware in a real app)
router.post('/', async (req, res) => {
  try {
    const project = await prisma.project.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        technologies: req.body.technologies,
        imageUrl: req.body.imageUrl || null,
        liveUrl: req.body.liveUrl || null,
        codeUrl: req.body.codeUrl || null,
        featured: req.body.featured || false
      }
    });
    
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/projects/:id
// @desc    Update a project
// @access  Private (would require auth middleware in a real app)
router.put('/:id', async (req, res) => {
  try {
    const project = await prisma.project.update({
      where: {
        id: req.params.id
      },
      data: {
        title: req.body.title,
        description: req.body.description,
        technologies: req.body.technologies,
        imageUrl: req.body.imageUrl,
        liveUrl: req.body.liveUrl,
        codeUrl: req.body.codeUrl,
        featured: req.body.featured
      }
    });
    
    res.json(project);
  } catch (err) {
    console.error(err.message);
    
    if (err.code === 'P2025') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private (would require auth middleware in a real app)
router.delete('/:id', async (req, res) => {
  try {
    await prisma.project.delete({
      where: {
        id: req.params.id
      }
    });
    
    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.code === 'P2025') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    
    res.status(500).send('Server Error');
  }
});

export default router;
