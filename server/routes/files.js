const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const { handleSuccess, handleError, handleBadRequest } = require('../utils/responseHandler');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

const router = express.Router();

const getFolderName = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'images';
  if (mimetype.startsWith('video/')) return 'videos';
  return 'files';
};

router.get('/', auth, async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500
    });
    
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
    
    handleSuccess(res, files);
  } catch (error) {
    handleError(res, error, 'Error fetching files');
  }
});

router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return handleBadRequest(res, 'No file uploaded');

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
    
    handleSuccess(res, {
      name: req.file.originalname,
      path: result.public_id,
      size: result.bytes,
      url: result.secure_url,
      publicId: result.public_id,
      type: result.format,
      folder: folder
    }, 201);
  } catch (error) {
    handleError(res, error, 'Error uploading file');
  }
});

router.delete('/batch', auth, async (req, res) => {
  try {
    const { files } = req.body;
    
    if (!Array.isArray(files) || files.length === 0) return handleBadRequest(res, 'Invalid files array');

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
    
    handleSuccess(res, {
      message: `Successfully deleted ${successCount} files. Failed to delete ${failCount} files.`,
      results: results.map(r => r.status === 'fulfilled' ? r.value : { status: 'failed', error: r.reason })
    });
  } catch (error) {
    handleError(res, error, 'Error batch deleting files');
  }
});

router.delete('/:publicId', auth, async (req, res) => {
  try {
    const publicId = req.params.publicId;
    
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') return handleSuccess(res, { message: 'File deleted successfully' });
    return res.status(404).json({ message: 'File not found or could not be deleted' });
  } catch (error) {
    handleError(res, error, 'Error deleting file');
  }
});

module.exports = router;