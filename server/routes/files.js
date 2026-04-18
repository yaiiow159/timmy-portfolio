const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const { handleSuccess, handleError, handleBadRequest } = require('../utils/responseHandler');
const { getFolderName } = require('../utils/uploadHelpers');

const router = express.Router();

router.get('/', adminAuth, async (req, res) => {
  try {
    const cloudinaryResourcesResponse = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500
    });
    
    const files = cloudinaryResourcesResponse.resources.map(resource => {
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

router.post('/', adminAuth, upload.single('file'), async (req, res) => {
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

    const uploadResponse = await uploadPromise;
    
    handleSuccess(res, {
      name: req.file.originalname,
      path: uploadResponse.public_id,
      size: uploadResponse.bytes,
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      type: uploadResponse.format,
      folder: folder
    }, 201);
  } catch (error) {
    handleError(res, error, 'Error uploading file');
  }
});

router.delete('/batch', adminAuth, async (req, res) => {
  try {
    const { files } = req.body;
    
    if (!Array.isArray(files) || files.length === 0) return handleBadRequest(res, 'Invalid files array');

    const settledResults = await Promise.allSettled(files.map(async (publicId) => {
      try {
        const deleteResponse = await cloudinary.uploader.destroy(publicId);
        return { 
          status: deleteResponse.result === 'ok' ? 'success' : 'failed',
          filename: publicId,
          result: deleteResponse
        };
      } catch (error) {
        return { 
          status: 'failed', 
          filename: publicId,
          error: error.message 
        };
      }
    }));
    
    const successCount = settledResults.filter(r => r.status === 'fulfilled' && r.value.status === 'success').length;
    const failCount = files.length - successCount;
    
    handleSuccess(res, {
      message: `Successfully deleted ${successCount} files. Failed to delete ${failCount} files.`,
      results: settledResults.map(r => r.status === 'fulfilled' ? r.value : { status: 'failed', error: r.reason })
    });
  } catch (error) {
    handleError(res, error, 'Error batch deleting files');
  }
});

router.delete('/:publicId', adminAuth, async (req, res) => {
  try {
    const publicId = req.params.publicId;
    
    const deleteResponse = await cloudinary.uploader.destroy(publicId);
    
    if (deleteResponse.result === 'ok') return handleSuccess(res, { message: 'File deleted successfully' });
    return res.status(404).json({ message: 'File not found or could not be deleted' });
  } catch (error) {
    handleError(res, error, 'Error deleting file');
  }
});

module.exports = router;