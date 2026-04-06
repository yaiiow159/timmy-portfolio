const express = require('express');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const { handleSuccess, handleError, handleBadRequest, handleNotFound } = require('../utils/responseHandler');

const router = express.Router();

const getFolderName = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'images';
  if (mimetype.startsWith('video/')) return 'videos';
  return 'files';
};

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
      fileName: result.public_id.split('/').pop(),
      filePath: result.secure_url,
      publicId: result.public_id
    }, 201);
  } catch (err) {
    handleError(res, err);
  }
});

router.delete('/:publicId', auth, async (req, res) => {
  try {
    const publicId = req.params.publicId;
    
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') return handleSuccess(res, { msg: 'File deleted' });
    return handleNotFound(res, 'File not found or could not be deleted');
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
