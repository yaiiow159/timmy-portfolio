const jwt = require('jsonwebtoken');
const env = require('../config/env');
const prisma = require('../lib/prisma');

// 額外向資料庫驗證角色可防止一般帳號僅靠有效憑證冒用管理權限
async function adminAuth(req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  let decoded;
  try {
    decoded = jwt.verify(token, env.jwtSecret);
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }

  req.user = decoded.user;

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const normalizedRole = typeof user?.role === 'string' ? user.role.toUpperCase() : '';
    if (!user || normalizedRole !== 'ADMIN') {
      return res.status(403).json({ msg: 'Admin access required' });
    }

    next();
  } catch (err) {
    return res.status(500).json({ msg: 'Server Error' });
  }
}

module.exports = adminAuth;
