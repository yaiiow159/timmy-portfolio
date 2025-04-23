const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting database initialization...');

  const adminEmail = process.env.ADMIN_EMAIL || 'examyou076@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'timmy0728';
  
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingUser) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    await prisma.user.create({
      data: {
        username: 'timmy',
        email: adminEmail,
        password: hashedPassword
      }
    });
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }

  console.log('Database initialization completed');
}

main()
  .catch((e) => {
    console.error('Error during database initialization:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
