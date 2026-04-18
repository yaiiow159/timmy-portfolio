const multer = require('multer');
const path = require('path');

// 同時檢查副檔名與媒體型別可降低偽裝檔案格式繞過上傳限制的風險
const allowedExtensions = /\.(jpeg|jpg|png|gif|webp|mp4|webm|pdf|doc|docx|txt|md)$/;
const allowedMimetypes = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'video/mp4', 'video/webm',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain', 'text/markdown'
];

const fileFilter = (req, file, cb) => {
  const isValidExt = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const isValidMime = allowedMimetypes.includes(file.mimetype);

  if (isValidExt && isValidMime) {
    return cb(null, true);
  }
  cb(new Error('Unsupported file type'));
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter
});

module.exports = upload;
