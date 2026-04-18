const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = { user: { id: userId } };
    jwt.sign(
      payload,
      env.jwtSecret,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });
};

module.exports = { generateToken };
