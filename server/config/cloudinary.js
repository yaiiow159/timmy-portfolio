const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dn4rfjyva',
  api_key: process.env.CLOUDINARY_API_KEY || '831168614959354',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'YOSKTU893-FcGVSFQ6EAKZQK'
});

module.exports = cloudinary;
