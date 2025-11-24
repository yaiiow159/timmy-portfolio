const express = require('express');
const nodemailer = require('nodemailer');
const prisma = require('../lib/prisma');

const router = express.Router();

// @route   POST api/contact
// @desc    Send contact message
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ msg: 'Please include name, email and message' });
  }
  
  try {
    await prisma.contact.create({
      data: { name, email, message }
    });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: `${ email }`,
  subject: `新的聯絡訊息 - 來自 ${name}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .email-container {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
        }
        .header {
          background-color: #4169E1;
          color: white;
          padding: 20px;
          border-radius: 8px 8px 0 0;
          text-align: center;
        }
        .content {
          background-color: white;
          padding: 20px;
          border-radius: 0 0 8px 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .field {
          margin-bottom: 15px;
        }
        .label {
          font-weight: bold;
          color: #666;
        }
        .message-box {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 4px;
          margin-top: 5px;
        }
        .timestamp {
          color: #888;
          font-size: 0.9em;
          text-align: right;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h2>New Contact Message</h2>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">👤 Receiver</div>
            ${name}
          </div>
          <div class="field">
            <div class="label">📧 Email</div>
            <a href="mailto:${email}">${email}</a>
          </div>
          <div class="field">
            <div class="label">💌 Message</div>
            <div class="message-box">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <div class="timestamp">
            Received at ${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}
          </div>
        </div>
      </div>
    </body>
    </html>
  `
});
    res.json({ msg: 'Message sent successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
