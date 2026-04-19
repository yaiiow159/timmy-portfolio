const path = require('path');
const express = require('express');
const upload = require('../middleware/upload');
const adminAuth = require('../middleware/adminAuth');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const { handleSuccess, handleError, handleBadRequest, handleNotFound } = require('../utils/responseHandler');
const { getFolderName } = require('../utils/uploadHelpers');

const router = express.Router();

router.post('/', adminAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return handleBadRequest(res, 'No file uploaded');

    const folder = getFolderName(req.file.mimetype);

    const uploadPromise = new Promise((resolve, reject) => {
      // 不含副檔名的 basename，避免 originalname 已帶 .png 時與 Cloudinary 格式後綴疊成 *.png.png
      const baseName = path.parse(req.file.originalname).name.replace(/\s+/g, '-');
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `portfolio/${folder}`,
          resource_type: 'auto',
          public_id: `${Date.now()}-${baseName}`
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

router.delete('/:publicId', adminAuth, async (req, res) => {
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
