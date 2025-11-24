const express = require('express');
const { json, urlencoded } = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
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
  app.use(express.static(path.join(__dirname, '../client/dist')));

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
