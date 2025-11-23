const dotenv = require('dotenv')

dotenv.config()

const requiredEnvVars = ['ADMIN_EMAIL', 'ADMIN_PASSWORD']

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

if (missingEnvVars.length > 0) {
  console.warn(
    `[admin config] Missing environment variables: ${missingEnvVars.join(
      ', '
    )}. Admin seeding will be skipped.`
  )
}

module.exports = {
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  adminName: process.env.ADMIN_NAME || 'Admin',
  missingAdminEnvVars: missingEnvVars
}
