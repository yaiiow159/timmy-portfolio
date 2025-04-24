import jwt from 'jsonwebtoken';
import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default function auth(req, res, next) {
  logger.info('Auth middleware triggered', { headers: req.headers });
  
  const token = req.header('x-auth-token');
  logger.info('Received token:', { token: token ? '***' : 'none' });

  if (!token) {
    logger.warn('No token provided');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    logger.debug('JWT_SECRET exists:', { exists: !!process.env.JWT_SECRET });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info('Token decoded successfully', { userId: decoded.user.id });
    req.user = decoded.user;
    next();
  } catch (err) {
    logger.error('Token verification failed:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
