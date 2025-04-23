import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database initialization...');

    const adminEmail = 'examyou076@gmail.com';
    const adminPassword = 'timmy0728';
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        username: 'timmy',
        password: hashedPassword,
        role: 'ADMIN'
      },
    });

    console.log('Admin user created:', admin);
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

