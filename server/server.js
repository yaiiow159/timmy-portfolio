const express = require('express');
const { json, urlencoded } = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
// gzip 壓縮回應，減少傳輸量；rate-limit 防止 API 被濫用
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { existsSync, mkdirSync } = require('fs');

const env = require('./config/env');
const logger = require('./config/logger');
const prisma = require('./lib/prisma');
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const projectsRoutes = require('./routes/projects');
const contactRoutes = require('./routes/contact');
const uploadsRoutes = require('./routes/uploads');
const adminRoutes = require('./routes/admin');
const filesRouter = require('./routes/files');
const activityRoutes = require('./routes/activity');

const app = express();

// 所有回應啟用 gzip 壓縮，降低 JSON/HTML 的網路傳輸量
app.use(compression());

// 每 15 分鐘最多 200 次 API 請求，防止暴力攻擊或爬蟲
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', apiLimiter);

const corsOrigins = env.corsOrigins;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Accept-Language'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
  })
);

app.options('*', cors());

app.use(urlencoded({ extended: true, limit: '10mb' }));
app.use(
  json({
    limit: '10mb',
    type: ['application/json', 'text/plain'],
    charset: 'utf-8'
  })
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'data:'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:', 'http:'],
        mediaSrc: ["'self'", 'data:', 'blob:', 'https:', 'http:'],
        connectSrc: ["'self'", 'https:', 'http:', 'ws:', 'wss:']
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false
  })
);

const uploadDirs = [env.uploads.root, env.uploads.images, env.uploads.videos, env.uploads.files];

uploadDirs.forEach((dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/files', filesRouter);
app.use('/api/activities', activityRoutes);

if (env.nodeEnv === 'production') {
  // 雜湊命名的靜態資源設 1 年快取 + immutable，避免不必要的重新驗證
  app.use(express.static(path.join(__dirname, '../client/dist'), {
    maxAge: '1y',
    immutable: true,
    setHeaders(res, filePath) {
      // index.html 不能長期快取，否則部署新版後使用者無法取得最新 HTML
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));

  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
      res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
    } else {
      res.status(404).json({ msg: 'API endpoint not found' });
    }
  });
} else {
  app.use((req, res) => {
    res.status(404).json({ msg: 'Route not found' });
  });
}

app.use((err, req, res, next) => {
  logger.error('Server error:', err);
  res.status(500).json({ msg: 'Server Error' });
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

const PORT = env.port;

app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

module.exports = app;
