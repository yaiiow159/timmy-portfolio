const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = { user: { id: userId } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });
};

module.exports = { generateToken };
