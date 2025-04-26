const express = require('express');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const router = express.Router();

// @route   POST api/uploads
// @desc    Upload a file to Cloudinary
// @access  Private
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    let folder;
    if (req.file.mimetype.startsWith('image/')) {
      folder = 'images';
    } else if (req.file.mimetype.startsWith('video/')) {
      folder = 'videos';
    } else {
      folder = 'files';
    }

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
      fileName: result.public_id.split('/').pop(),
      filePath: result.secure_url,
      publicId: result.public_id
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   DELETE api/uploads/:publicId
// @desc    Delete a file from Cloudinary
// @access  Private
router.delete('/:publicId', auth, async (req, res) => {
  try {
    const publicId = req.params.publicId;
    
    // Delete the file from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      return res.json({ msg: 'File deleted' });
    } else {
      return res.status(404).json({ msg: 'File not found or could not be deleted' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
