const express = require('express');
const nodemailer = require('nodemailer');
const prisma = require('../lib/prisma');
const { handleSuccess, handleError, handleBadRequest } = require('../utils/responseHandler');

const router = express.Router();

// 先做字元跳脫可避免郵件模板渲染時被注入惡意標記
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) return handleBadRequest(res, 'Please include name, email and message');
  
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

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      // 通知寄給網站擁有者，而非回覆給訪客
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `新的聯絡訊息 - 來自 ${safeName}`,
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
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #666; }
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
                <div class="label">👤 Sender</div>
                ${safeName}
              </div>
              <div class="field">
                <div class="label">📧 Email</div>
                <a href="mailto:${safeEmail}">${safeEmail}</a>
              </div>
              <div class="field">
                <div class="label">💌 Message</div>
                <div class="message-box">${safeMessage}</div>
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

    handleSuccess(res, { msg: 'Message sent successfully' }, 201);
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
