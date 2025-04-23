# 🌟 Timmy's Portfolio - Modern Full-Stack Web Application

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

</div>

<p align="center">
A modern, responsive portfolio website with blog functionality, built using Vue.js, Node.js, and PostgreSQL. Containerized with Docker for easy deployment.
</p>

---

## 📋 Table of Contents

- [💻 System Requirements](#-system-requirements)
- [🏗️ Project Structure](#️-project-structure)
- [🚀 Development Setup](#-development-setup)
  - [🖥️ Frontend Development](#️-frontend-development)
  - [⚙️ Backend Development](#️-backend-development)
  - [🐳 Docker Development](#-docker-development)
- [🌐 Production Deployment](#-production-deployment)
  - [📜 Using Deployment Scripts](#-using-deployment-scripts)
  - [🛠️ Manual Deployment](#️-manual-deployment)
  - [⚙️ Environment Configuration](#️-environment-configuration)
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
│   └── package.json        # Frontend Dependencies
├── server/                 # Node.js Backend Application
│   ├── prisma/             # Database Models & Migrations
│   ├── routes/             # API Routes
│   ├── scripts/            # Script Files
│   └── package.json        # Backend Dependencies
├── docker-compose.yml      # Docker Configuration
├── Dockerfile.frontend     # Frontend Docker Configuration
├── Dockerfile.backend      # Backend Docker Configuration
├── deploy.sh               # Linux/macOS Deployment Script
└── deploy.ps1              # Windows Deployment Script
```

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
```

4. Set up database:

```bash
npx prisma migrate dev
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

1. Run in the project root directory:

```bash
# Linux/macOS
./deploy.sh

# Windows
.\deploy.ps1
```

Or manually run Docker Compose:

```bash
docker-compose up -d
```

This will start the frontend, backend, and database services. The frontend will run at http://localhost:3000, and the backend API at http://localhost:5000.

</details>

---

## 🌐 Production Deployment

### 📜 Using Deployment Scripts

<details>
<summary><b>Click to expand detailed steps</b></summary>

1. Ensure Docker and Docker Compose are installed.

2. Modify environment files for production:
   - `server/.env`: Set production database connection, email configuration, etc.
   - `client/.env`: Set correct API URL

3. Run deployment script:

```bash
# Linux/macOS
./deploy.sh

# Windows
.\deploy.ps1
```

</details>

### 🛠️ Manual Deployment

<details>
<summary><b>Click to expand frontend deployment steps</b></summary>

#### Frontend Deployment

1. Navigate to frontend directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Build production version:

```bash
npm run build
```

4. Deploy the files from the `dist` directory to your web server.

</details>

<details>
<summary><b>Click to expand backend deployment steps</b></summary>

#### Backend Deployment

1. Navigate to backend directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables in `.env` file.

4. Run database migrations:

```bash
npx prisma migrate deploy
```

5. Start the server:

```bash
npm start
```

</details>

---

## ❓ FAQ

<details>
<summary><b>Common Issues and Solutions</b></summary>

1. **Database Connection Issues**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in .env file
   - Verify database credentials

2. **Docker Container Issues**
   - Check container logs: `docker-compose logs [service]`
   - Ensure all required ports are available
   - Verify network connectivity between containers

3. **Prisma Migration Issues**
   - Run `npx prisma generate` after schema changes
   - Check migration history: `npx prisma migrate status`
   - Reset database if needed: `npx prisma migrate reset`

</details>

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Made with ❤️ by Timmy
</div>
