const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const winston = require('winston');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

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

const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

const router = express.Router();

function getFolderName(mimetype) {
  if (mimetype.startsWith('image/')) {
    return 'images';
  } else if (mimetype.startsWith('video/')) {
    return 'videos';
  } else {
    return 'files';
  }
}

// @route   GET api/files
// @desc    Get all files from Cloudinary
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching files from Cloudinary...');
    
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500
    });
    
    console.log(`Found ${result.resources.length} resources in Cloudinary`);
    
    const files = result.resources.map(resource => {
      const pathParts = resource.public_id.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const folderName = pathParts.length > 1 ? pathParts[pathParts.length - 2] : 'root';
      
      return {
        name: fileName,
        path: resource.public_id,
        size: resource.bytes,
        url: resource.secure_url,
        publicId: resource.public_id,
        type: resource.format,
        folder: folderName
      };
    });
    
    res.json(files);
  } catch (error) {
    logger.error('Error fetching files from Cloudinary:', error);
    console.error('Cloudinary API Error:', error);
    
    console.log('Cloudinary Config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'undefined',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'undefined'
    });
    
    const errorMessage = error.message || 'Error fetching files';
    const statusCode = error.http_code || 500;
    
    res.status(statusCode).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'production' ? undefined : error
    });
  }
});

// @route   POST api/files
// @desc    Upload a file to Cloudinary
// @access  Private
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const folder = getFolderName(req.file.mimetype);
    
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `portfolio/${folder}`,
          resource_type: 'auto',
          public_id: `${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    const result = await uploadPromise;
    
    res.json({
      name: req.file.originalname,
      path: result.public_id,
      size: result.bytes,
      url: result.secure_url,
      publicId: result.public_id,
      type: result.format,
      folder: folder
    });
  } catch (error) {
    logger.error('Error uploading file to Cloudinary:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

// @route   DELETE api/files/batch
// @desc    Delete multiple files from Cloudinary
// @access  Private
router.delete('/batch', auth, async (req, res) => {
  try {
    const { files } = req.body;
    
    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ message: 'Invalid files array' });
    }

    const results = await Promise.allSettled(files.map(async (publicId) => {
      try {
        const result = await cloudinary.uploader.destroy(publicId);
        return { 
          status: result.result === 'ok' ? 'success' : 'failed',
          filename: publicId,
          result
        };
      } catch (error) {
        return { 
          status: 'failed', 
          filename: publicId,
          error: error.message 
        };
      }
    }));
    
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value.status === 'success').length;
    const failCount = files.length - successCount;
    
    res.json({
      message: `Successfully deleted ${successCount} files. Failed to delete ${failCount} files.`,
      results: results.map(r => r.status === 'fulfilled' ? r.value : { status: 'failed', error: r.reason })
    });
  } catch (error) {
    logger.error('Error batch deleting files from Cloudinary:', error);
    res.status(500).json({ message: 'Error batch deleting files' });
  }
});

// @route   DELETE api/files/:publicId
// @desc    Delete a file from Cloudinary
// @access  Private
router.delete('/:publicId', auth, async (req, res) => {
  try {
    const publicId = req.params.publicId;
    
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      return res.json({ message: 'File deleted successfully' });
    } else {
      return res.status(404).json({ message: 'File not found or could not be deleted' });
    }
  } catch (error) {
    logger.error('Error deleting file from Cloudinary:', error);
    res.status(500).json({ message: 'Error deleting file' });
  }
});

module.exports = router;