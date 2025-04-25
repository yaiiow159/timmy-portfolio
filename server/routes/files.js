const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');
const auth = require('../middleware/auth');
const winston = require('winston');

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

const uploadsDir = path.join(__dirname, '../../uploads');
const imageDir = path.join(uploadsDir, 'images');
const videoDir = path.join(uploadsDir, 'videos');
const fileDir = path.join(uploadsDir, 'files');

async function ensureUploadsDirs() {
  try {
    await fs.access(uploadsDir);
    await fs.access(imageDir);
    await fs.access(videoDir);
    await fs.access(fileDir);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(uploadsDir, { recursive: true });
      await fs.mkdir(imageDir, { recursive: true });
      await fs.mkdir(videoDir, { recursive: true });
      await fs.mkdir(fileDir, { recursive: true });
    }
  }
}

ensureUploadsDirs();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = uploadsDir;
    if (file.mimetype.startsWith('image/')) {
      uploadPath = imageDir;
    } else if (file.mimetype.startsWith('video/')) {
      uploadPath = videoDir;
    } else {
      uploadPath = fileDir;
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

const router = express.Router();

async function getFilesFromDir(dir, subPath = '') {
  const files = await fs.readdir(dir);
  const fileList = await Promise.all(files.map(async (filename) => {
    const filePath = path.join(dir, filename);
    const stats = await fs.stat(filePath);
    const relativePath = path.join(subPath, filename).replace(/\\/g, '/'); 
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.BASE_URL || ''
      : 'http://localhost:5000';
    
    return {
      name: filename,
      path: relativePath,
      size: stats.size,
      url: `${baseUrl}/uploads/${relativePath}`,
      type: path.extname(filename).slice(1)
    };
  }));
  return fileList;
}

router.get('/', auth, async (req, res) => {
  try {
    await ensureUploadsDirs(); 
    
    const [imageFiles, videoFiles, otherFiles] = await Promise.all([
      getFilesFromDir(imageDir, 'images'),
      getFilesFromDir(videoDir, 'videos'),
      getFilesFromDir(fileDir, 'files')
    ]);
    
    const allFiles = [...imageFiles, ...videoFiles, ...otherFiles];
    res.json(allFiles);
  } catch (error) {
    console.error('Error reading files:', error);
    res.status(500).json({ message: 'Error fetching files' });
  }
});

router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const subPath = req.file.mimetype.startsWith('image/') ? 'images' :
                   req.file.mimetype.startsWith('video/') ? 'videos' : 'files';
    
    const relativePath = path.join(subPath, req.file.filename).replace(/\\/g, '/');
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.BASE_URL || ''
      : 'http://localhost:5000';

    res.json({
      name: req.file.originalname,
      path: relativePath,
      size: req.file.size,
      url: `${baseUrl}/uploads/${relativePath}`,
      type: path.extname(req.file.originalname).slice(1)
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

router.delete('/batch', auth, async (req, res) => {
  try {
    const { files } = req.body;
    
    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ message: 'Invalid files array' });
    }

    const results = await Promise.allSettled(files.map(async (filename) => {
      try {
        const decodedFilename = decodeURIComponent(filename);
        const [category, ...filenameParts] = decodedFilename.split('/');
        const actualFilename = filenameParts.join('/');
        
        let targetDir;
        switch(category) {
          case 'images':
            targetDir = imageDir;
            break;
          case 'videos':
            targetDir = videoDir;
            break;
          case 'files':
            targetDir = fileDir;
            break;
          default:
            throw new Error('Invalid file category');
        }
        
        const filepath = path.join(targetDir, actualFilename);
        await fs.access(filepath);
        await fs.unlink(filepath);
        
        logger.info(`File deleted successfully: ${filename}`);
        return { filename, status: 'success' };
      } catch (error) {
        logger.error(`Error deleting file ${filename}:`, error);
        return { filename, status: 'error', message: error.message };
      }
    }));

    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failureCount = results.filter(r => r.status === 'rejected').length;
    
    logger.info(`Batch deletion completed. Success: ${successCount}, Failed: ${failureCount}`);
    
    res.json({
      message: `Deleted ${successCount} files, failed to delete ${failureCount} files`,
      results: results.map(r => r.value || r.reason)
    });
  } catch (error) {
    logger.error('Error in batch deletion:', error);
    res.status(500).json({ message: 'Error processing batch deletion' });
  }
});

router.delete('/:filename', auth, async (req, res) => {
  try {
    const filename = decodeURIComponent(req.params.filename);
    const [category, ...filenameParts] = filename.split('/');
    const actualFilename = filenameParts.join('/');
    
    let targetDir;
    switch(category) {
      case 'images':
        targetDir = imageDir;
        break;
      case 'videos':
        targetDir = videoDir;
        break;
      case 'files':
        targetDir = fileDir;
        break;
      default:
        logger.warn(`Invalid file category attempted: ${category}`);
        return res.status(400).json({ message: 'Invalid file category' });
    }
    
    const filepath = path.join(targetDir, actualFilename);
    try {
      await fs.access(filepath);
      await fs.unlink(filepath);
      logger.info(`File deleted successfully: ${filename}`);
      return res.json({ message: 'File deleted successfully' });
    } catch (error) {
      if (error.code === 'ENOENT') {
        logger.warn(`File not found: ${filename}`);
        return res.status(404).json({ message: 'File not found' });
      }
      throw error;
    }
  } catch (error) {
    logger.error(`Error deleting file ${req.params.filename}:`, error);
    res.status(500).json({ message: 'Error deleting file' });
  }
});

module.exports = router; 