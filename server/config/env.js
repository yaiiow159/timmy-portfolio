const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const parseOrigins = (origins) => {
  if (!origins) return ['http://localhost:3000'];
  return origins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const uploadsRoot = path.join(__dirname, '../uploads');

// 啟動即中止可避免服務在錯誤密鑰狀態下簽發不可驗證的憑證
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not set in environment variables.');
  process.exit(1);
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  corsOrigins: parseOrigins(process.env.CORS_ORIGIN),
  jwtSecret: process.env.JWT_SECRET,
  uploads: {
    root: uploadsRoot,
    images: path.join(uploadsRoot, 'images'),
    videos: path.join(uploadsRoot, 'videos'),
    files: path.join(uploadsRoot, 'files')
  }
};
