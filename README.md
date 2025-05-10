# 🌟 Timmy's Portfolio - Modern Full-Stack Web Application

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

</div>

<p align="center">
A modern, responsive portfolio website with blog functionality, built using Vue.js, Node.js, and PostgreSQL. Containerized with Docker for easy deployment and scalability. Uses Cloudinary for optimized image storage and delivery.
</p>

<p align="center">
<i>Last updated: May 10, 2025</i>
</p>

---

## 📋 Table of Contents

- [💻 System Requirements](#-system-requirements)
- [🏗️ Project Structure](#️-project-structure)
- [✨ Key Features](#-key-features)
- [🚀 Development Setup](#-development-setup)
  - [🖥️ Frontend Development](#️-frontend-development)
  - [⚙️ Backend Development](#️-backend-development)
  - [🐳 Docker Development](#-docker-development)
- [🌐 Production Deployment](#-production-deployment)
  - [📜 Using Deployment Scripts](#-using-deployment-scripts)
  - [🛠️ Manual Deployment](#️-manual-deployment)
  - [⚙️ Environment Configuration](#️-environment-configuration)
- [🔄 CI/CD Integration](#-cicd-integration)
- [🧪 Testing](#-testing)
- [📝 License](#-license)
- [❓ FAQ](#-faq)

---

## 💻 System Requirements

<table>
  <tr>
    <td>✅ Node.js 18.x or higher</td>
    <td>✅ npm 9.x or higher</td>
  </tr>
  <tr>
    <td>✅ PostgreSQL 16.x (if not using Docker)</td>
    <td>✅ Docker and Docker Compose (recommended)</td>
  </tr>
</table>

---

## 🏗️ Project Structure

```
timmy-portfolio/
├── client/                 # Vue.js Frontend Application
│   ├── public/             # Static Assets
│   ├── src/                # Source Code
│   │   ├── assets/         # Images, fonts, etc.
│   │   ├── components/     # Reusable components
│   │   ├── composables/    # Vue composables
│   │   ├── views/          # Page components
│   │   ├── router/         # Vue Router configuration
│   │   ├── stores/         # Pinia stores
│   │   └── utils/          # Utility functions
│   └── package.json        # Frontend Dependencies
├── server/                 # Node.js Backend Application
│   ├── prisma/             # Database Models & Migrations
│   ├── routes/             # API Routes
│   ├── middleware/         # Express middleware
│   ├── scripts/            # Script Files
│   └── package.json        # Backend Dependencies
├── docker-compose.yml      # Docker Compose Configuration
├── docker-compose.dev.yml  # Development Docker Configuration
├── Dockerfile.frontend     # Frontend Production Docker Configuration
├── Dockerfile.backend      # Backend Production Docker Configuration
├── Dockerfile.frontend.dev # Frontend Development Docker Configuration
├── Dockerfile.backend.dev  # Backend Development Docker Configuration
├── start-dev.ps1           # Windows Development Script
├── deploy.sh               # Linux/macOS Deployment Script
└── deploy.ps1              # Windows Deployment Script
```

## ✨ Key Features

- 📱 **Responsive Design** - Optimized for all device sizes
- 🎨 **Modern UI** - Built with TailwindCSS for a clean, modern look
- 📝 **Blog System** - Create, edit, and publish blog posts with rich text editing
- 🔐 **Authentication** - Secure user authentication and authorization
- 🎯 **Project Showcase** - Display your projects with detailed information
- 📧 **Contact Form** - Allow visitors to reach out via a contact form
- 📊 **Admin Dashboard** - Manage content through an intuitive admin interface
- 🌐 **SEO Optimized** - Structured for better search engine visibility
- 🔄 **Real-time Updates** - Dynamic content updates without page reloads
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 🖼️ **Cloud Image Management** - Optimized image storage and delivery with Cloudinary
- 🔍 **Full-text Search** - Search functionality for blog posts and projects
- 🌍 **Multilingual Support** - i18n integration with English and Chinese (Traditional and Simplified)

---

## 🚀 Development Setup

### 🖥️ Frontend Development

<details>
<summary><b>Click to expand detailed steps</b></summary>

1. Navigate to frontend directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file and set API URL:

```
VITE_API_URL=http://localhost:5000
```

4. Start development server:

```bash
npm run dev
```

The frontend application will run at http://localhost:3000.

</details>

### ⚙️ Backend Development

<details>
<summary><b>Click to expand detailed steps</b></summary>

1. Navigate to backend directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file and set environment variables:

```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/timmy_portfolio?schema=public
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your_jwt_secret_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_RECIPIENT=your-email@gmail.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Set up database:

```bash
npx prisma db push
```

5. Initialize database:

```bash
node scripts/init-db.js
```

6. Start development server:

```bash
npm run dev
```

The backend API will run at http://localhost:5000.

</details>

### 🐳 Docker Development

<details>
<summary><b>Click to expand detailed steps</b></summary>

Using Docker is the simplest way to develop, avoiding environment configuration issues.

1. Make sure you have Docker and Docker Compose installed on your system.

2. Run the development script in the project root directory:

```bash
# Windows
.\start-dev.ps1
```

Or manually run Docker Compose:

```bash
# Development environment
docker-compose -f docker-compose.dev.yml up -d

# Production-like environment
docker-compose up -d
```

3. The services will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - PostgreSQL: localhost:5432

4. If you encounter database schema issues, you can run:

```bash
docker-compose exec backend npx prisma db push
```

This will synchronize the Prisma schema with the database without creating migration files.

</details>

---

## 🌐 Production Deployment

### 📜 Using Deployment Scripts

<details>
<summary><b>Click to expand detailed steps</b></summary>

1. Ensure Docker and Docker Compose are installed.

2. Modify environment files for production:
   - `server/.env`: Set production database connection, email configuration, etc.
   - `client/.env`: Set production API URL

3. Run the deployment script:

```bash
# Linux/macOS
./deploy.sh --production

# Windows
.\deploy.ps1 -Production
```

This will build and deploy the application in production mode.

</details>

### 🛠️ Manual Deployment

<details>
<summary><b>Click to expand detailed steps</b></summary>

#### Frontend Deployment

1. Navigate to frontend directory:

```bash
cd client
```

2. Build for production:

```bash
npm run build
```

3. Serve the built files using Nginx or another web server.

#### Backend Deployment

1. Navigate to backend directory:

```bash
cd server
```

2. Install production dependencies:

```bash
npm install --production
```

3. Start the server:

```bash
npm start
```

Or use a process manager like PM2:

```bash
pm2 start server.js --name timmy-portfolio-backend
```

</details>

### ⚙️ Environment Configuration

<details>
<summary><b>Click to expand configuration details</b></summary>

#### Frontend Environment Variables

| Variable | Description | Default |
|:---------|:------------|:--------|
| `VITE_API_URL` | Backend API URL | http://localhost:5000 |

#### Backend Environment Variables

| Variable | Description | Required |
|:---------|:------------|:---------|
| `PORT` | Server port | Yes |
| `NODE_ENV` | Environment | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `CORS_ORIGIN` | Allowed CORS origin | Yes |
| `JWT_SECRET` | JWT secret key | Yes |
| `EMAIL_HOST` | SMTP host | For email |
| `EMAIL_PORT` | SMTP port | For email |
| `EMAIL_SECURE` | Use TLS | For email |
| `EMAIL_USER` | SMTP username | For email |
| `EMAIL_PASS` | SMTP password | For email |
| `EMAIL_RECIPIENT` | Contact form recipient | For email |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |

</details>

## 🔄 CI/CD Integration

This project is configured for continuous integration and deployment using GitHub Actions. Each push to the main branch triggers automated tests and deployment to the staging environment.

## 🧪 Testing

<details>
<summary><b>Click to expand testing information</b></summary>

### Frontend Tests

```bash
cd client
npm run test
```

### Backend Tests

```bash
cd server
npm run test
```

</details>

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## ❓ FAQ

<details>
<summary><b>How do I reset the admin password?</b></summary>

Run the password reset script:

```bash
cd server
node scripts/reset-password.js
```

</details>

<details>
<summary><b>How do I backup the database?</b></summary>

If using Docker:

```bash
docker exec -t timmy-portfolio-db pg_dump -U postgres timmy_portfolio > backup.sql
```

If using local PostgreSQL:

```bash
pg_dump -U postgres timmy_portfolio > backup.sql
```

</details>

<details>
<summary><b>How do I restore the database?</b></summary>

If using Docker:

```bash
docker exec -i timmy-portfolio-db psql -U postgres timmy_portfolio < backup.sql
```

If using local PostgreSQL:

```bash
psql -U postgres timmy_portfolio < backup.sql
```

</details>

<details>
<summary><b>How do I handle database schema changes?</b></summary>

For development environments, you can use Prisma's db push to synchronize schema changes:

```bash
npx prisma db push
```

For production environments, it's recommended to use migrations:

```bash
npx prisma migrate dev --name describe_your_changes
npx prisma migrate deploy
```

If you encounter migration issues, you can reset the database (development only):

```bash
npx prisma migrate reset
```

</details>

<details>
<summary><b>How do I update the Docker containers?</b></summary>

Pull the latest code changes, then rebuild and restart the containers:

```bash
git pull
docker-compose down
docker-compose build
docker-compose up -d
```

</details>
