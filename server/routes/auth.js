const express = require('express');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const prisma = require('../lib/prisma');
const { handleSuccess, handleError } = require('../utils/responseHandler');
const { generateToken } = require('../utils/jwtHelper');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedName = typeof name === 'string' ? name.trim() : '';
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  // 基本欄位驗證，避免空白資料或格式錯誤的帳號進入資料庫
  if (!normalizedName) return res.status(400).json({ msg: 'Name is required' });
  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({ msg: 'Valid email is required' });
  }
  if (!password || password.length < 8) {
    return res.status(400).json({ msg: 'Password must be at least 8 characters' });
  }

  try {
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          { name: normalizedName }
        ]
      }
    });

    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await prisma.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
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
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({ msg: 'Valid email is required' });
  }
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ msg: 'Password is required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
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

    // 憑證仍有效但帳號已不存在時回 401，讓前端立即清理過期登入狀態
    if (!user) return res.status(401).json({ msg: 'User not found' });
    
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
