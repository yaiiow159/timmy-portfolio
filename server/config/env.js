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

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  corsOrigins: parseOrigins(process.env.CORS_ORIGIN),
  uploads: {
    root: uploadsRoot,
    images: path.join(uploadsRoot, 'images'),
    videos: path.join(uploadsRoot, 'videos'),
    files: path.join(uploadsRoot, 'files')
  }
};
