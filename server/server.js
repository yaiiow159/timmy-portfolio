import express from 'express';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import winston from 'winston';
import authRoutes from './routes/auth.js';
import postsRoutes from './routes/posts.js';
import projectsRoutes from './routes/projects.js';
import contactRoutes from './routes/contact.js';
import uploadsRoutes from './routes/uploads.js';
import adminRoutes from './routes/admin.js';
import filesRouter from './routes/files.js';
import activityRoutes from './routes/activity.js';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();
config();

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Accept-Language'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

app.options('*', cors());

app.use(express.json({ limit: '10mb' }));

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
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (error) {
  logger.error('Error creating uploads directory:', error);
}

[uploadsDir, imageDir, videoDir, fileDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res, path, stat) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

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
