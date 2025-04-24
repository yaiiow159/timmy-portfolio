import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import upload from '../middleware/upload.js';
import auth from '../middleware/auth.js';
import fs from 'fs';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// @route   POST api/uploads
// @desc    Upload a file
// @access  Private
router.post('/', auth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const fileType = req.file.mimetype.startsWith('image/') ? 'images' : 
                    req.file.mimetype.startsWith('video/') ? 'videos' : 'files';
    
    const filePath = `/uploads/${fileType}/${req.file.filename}`;
    
    res.json({
      fileName: req.file.filename,
      filePath: filePath
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   DELETE api/uploads/:filename
// @desc    Delete a file
// @access  Private
router.delete('/:filename', auth, (req, res) => {
  try {
    const filename = req.params.filename;
    const directories = [
      path.join(__dirname, '../../uploads/images'),
      path.join(__dirname, '../../uploads/videos'),
      path.join(__dirname, '../../uploads/files')
    ];
    
    for (const dir of directories) {
      const filePath = path.join(dir, filename);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return res.json({ msg: 'File deleted' });
      }
    }
    
    return res.status(404).json({ msg: 'File not found' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

export default router;
