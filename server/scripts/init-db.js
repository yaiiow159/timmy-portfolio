const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const winston = require('winston');
const { adminEmail, adminPassword, adminName, missingAdminEnvVars } = require('../config/admin');

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

const prisma = new PrismaClient();

async function main() {
  try {
    logger.info('Starting database initialization...');

    if (!adminEmail || !adminPassword) {
      logger.warn(
        `Skipping admin user creation; missing required credentials: ${missingAdminEnvVars.join(', ') || 'ADMIN_EMAIL/ADMIN_PASSWORD'}`
      );
      logger.info('Database initialization completed (admin seed skipped)');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        name: adminName,
        password: hashedPassword,
        role: 'ADMIN'
      },
    });

    logger.info('Admin user created:', admin);
    logger.info('Database initialization completed');
  } catch (error) {
    logger.error('Error during database initialization:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    logger.error('Database initialization error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
