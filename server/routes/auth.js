const express = require('express');
const bcrypt = require('bcryptjs');
<<<<<<< Updated upstream
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const prisma = require('../lib/prisma');
=======
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const { handleSuccess, handleError } = require('../utils/responseHandler');
const { generateToken } = require('../utils/jwtHelper');
>>>>>>> Stashed changes

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { name }
        ]
      }
    });

    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    const token = await generateToken(user.id);
    handleSuccess(res, { token }, 201);
  } catch (err) {
    handleError(res, err, 'Server error');
  }
});

router.post('/health', (req, res) => {
  handleSuccess(res, { msg: 'Server is running' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = await generateToken(user.id);
    handleSuccess(res, { token });
  } catch (err) {
    handleError(res, err, 'Server error');
  }
});

router.get('/user', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    
    handleSuccess(res, user);
  } catch (err) {
    handleError(res, err);
  }
});

router.post('/refresh', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true
      }
    });

    if (!user) return res.status(404).json({ msg: 'User not found' });

    const token = await generateToken(user.id);
    handleSuccess(res, { token });
  } catch (err) {
    handleError(res, err, 'Error refreshing token');
  }
});

module.exports = router;
