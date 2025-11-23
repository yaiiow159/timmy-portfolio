const dotenv = require('dotenv')

dotenv.config()

const requiredEnvVars = ['ADMIN_EMAIL', 'ADMIN_PASSWORD']

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
})

module.exports = {
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  adminName: process.env.ADMIN_NAME || 'Admin'
}
