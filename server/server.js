const express = require('express');
const { json } = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const { PrismaClient } = require('@prisma/client');
const { config } = require('dotenv');
const { existsSync, mkdirSync } = require('fs');
const { fileURLToPath } = require('url');
const winston = require('winston');
const { format, transports } = winston;
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const projectsRoutes = require('./routes/projects');
const contactRoutes = require('./routes/contact');
const uploadsRoutes = require('./routes/uploads');
const adminRoutes = require('./routes/admin');
const filesRouter = require('./routes/files');
const activityRoutes = require('./routes/activity');

const logger = winston.createLogger({
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple()
  }));
}

const prisma = new PrismaClient();
config();

const app = express();

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',') 
  : ['http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
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
}));

app.options('*', cors());

app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(json({ 
  limit: '10mb',
  type: ['application/json', 'text/plain'],
  charset: 'utf-8'
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https: data:"],
      imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
      mediaSrc: ["'self'", "data:", "blob:", "https:", "http:"],
      connectSrc: ["'self'", "https:", "http:", "ws:", "wss:"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false,
}));

const uploadsDir = path.join(__dirname, '../uploads');
const imageDir = path.join(uploadsDir, 'images');
const videoDir = path.join(uploadsDir, 'videos');
const fileDir = path.join(uploadsDir, 'files');

try {
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }
} catch (error) {
  logger.error('Error creating uploads directory:', error);
}

[uploadsDir, imageDir, videoDir, fileDir].forEach(dir => {
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

if (process.env.NODE_ENV === 'production') {
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

module.exports = app;
