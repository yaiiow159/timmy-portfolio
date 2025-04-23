const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIRS = {
  images: path.join(__dirname, '../../uploads/images'),
  videos: path.join(__dirname, '../../uploads/videos'),
  files: path.join(__dirname, '../../uploads/files')
};

Object.values(UPLOAD_DIRS).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let uploadPath;
    
    if (file.mimetype.startsWith('image/')) {
      uploadPath = UPLOAD_DIRS.images;
    } else if (file.mimetype.startsWith('video/')) {
      uploadPath = UPLOAD_DIRS.videos;
    } else {
      uploadPath = UPLOAD_DIRS.files;
    }
    
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    // Create a safe filename with timestamp to avoid duplicates
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|webm|pdf|doc|docx|txt|md/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Unsupported file type!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

module.exports = upload;
