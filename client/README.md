# 🌟 Timmy's Portfolio Website

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

**A modern, multilingual personal portfolio website built with Vue 3, TypeScript, and Node.js**

</div>

## ✨ Features

<div align="center">
  <table>
    <tr>
      <td align="center">🌐</td>
      <td>Multilingual support (English, Traditional Chinese, Simplified Chinese, Japanese)</td>
    </tr>
    <tr>
      <td align="center">🌙</td>
      <td>Dark mode with smooth transitions</td>
    </tr>
    <tr>
      <td align="center">📝</td>
      <td>Blog with Markdown support and code highlighting</td>
    </tr>
    <tr>
      <td align="center">🖼️</td>
      <td>Portfolio showcase with beautiful animations</td>
    </tr>
    <tr>
      <td align="center">📄</td>
      <td>Resume display with download option</td>
    </tr>
    <tr>
      <td align="center">📬</td>
      <td>Contact form with email notifications</td>
    </tr>
    <tr>
      <td align="center">📱</td>
      <td>Responsive design for all devices</td>
    </tr>
    <tr>
      <td align="center">⚡</td>
      <td>Modern UI with smooth animations</td>
    </tr>
    <tr>
      <td align="center">🐳</td>
      <td>Docker support for easy deployment</td>
    </tr>
  </table>
</div>

## 🛠️ Tech Stack

<div align="center">
  <h3>Frontend</h3>
  <p>
    <img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D" alt="Vue.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  </p>
  
  <h3>Backend</h3>
  <p>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  </p>
  
  <h3>DevOps</h3>
  <p>
    <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
    <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm" />
    <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git" />
  </p>
</div>

## 📂 Project Structure

```
timmy-portfolio/
├── client/              # Frontend code
│   ├── public/          # Static assets
│   └── src/             # Vue source code
│       ├── assets/      # Images, fonts, etc.
│       ├── components/  # Vue components
│       │   ├── blog/    # Blog-related components
│       │   ├── common/  # Shared components
│       │   ├── layout/  # Layout components
│       │   ├── portfolio/ # Portfolio-related components
│       │   ├── resume/  # Resume-related components
│       │   └── contact/ # Contact-related components
│       ├── i18n/        # Internationalization
│       ├── locales/     # Translation files
│       ├── router/      # Vue Router configuration
│       ├── services/    # API services
│       ├── store/       # Pinia stores
│       ├── utils/       # Utility functions
│       └── views/       # Page components
├── server/              # Backend code
│   ├── config/          # Server configuration
│   ├── middleware/      # Express middleware
│   ├── prisma/          # Prisma schema and migrations
│   ├── routes/          # API routes
│   └── scripts/         # Database scripts
└── docker-compose.yml   # Docker configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- PostgreSQL (local or cloud service)
- Docker and Docker Compose (optional, for containerized deployment)

### Installation

<details>
<summary><b>📝 Local Development</b></summary>
<br>

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/timmy-portfolio.git
   cd timmy-portfolio
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd client
   npm install
   
   # Install backend dependencies
   cd ../server
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the server directory:
   ```
   PORT=5000
   DATABASE_URL="postgresql://username:password@localhost:5432/timmy_portfolio?schema=public"
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # Seed the database
   node scripts/init-db.js
   ```

5. **Start the development servers**
   ```bash
   # Start backend
   cd server
   npm run dev
   
   # Start frontend (in a separate terminal)
   cd client
   npm run dev
   ```

6. **Open your browser** and navigate to `http://localhost:5173`

</details>

<details>
<summary><b>🐳 Docker Deployment</b></summary>
<br>

1. **Make sure Docker and Docker Compose are installed** on your system

2. **Start the application**
   ```bash
   docker-compose up
   ```

3. **Access the application** at `http://localhost:3000`

</details>

### Building for Production

```bash
cd client
npm run build
```

This will create a `dist` directory with the compiled frontend assets. The backend is configured to serve these static files in production mode.

## 🌐 Deployment

The application can be deployed using:

- **Docker** (recommended)
- Any hosting service that supports Node.js and PostgreSQL:
  - Vercel
  - Netlify
  - Heroku
  - DigitalOcean
  - AWS

## 👨‍💼 Admin Access

To access the admin dashboard:

1. Navigate to `/auth` in your browser
2. Log in with the default admin credentials:
   - **Email**: `admin@example.com`
   - **Password**: `admin123` (change this in production)
3. After login, you'll be redirected to the admin dashboard at `/admin`

## 📸 Screenshots

<div align="center">
  <img src="https://via.placeholder.com/800x400?text=Homepage" alt="Homepage" width="80%" />
  <p><em>Homepage with dark mode</em></p>
  
  <br />
  
  <div>
    <img src="https://via.placeholder.com/400x300?text=Blog" alt="Blog" width="48%" />
    <img src="https://via.placeholder.com/400x300?text=Portfolio" alt="Portfolio" width="48%" />
  </div>
  <p><em>Blog and Portfolio pages</em></p>
  
  <br />
  
  <img src="https://via.placeholder.com/800x400?text=Admin+Dashboard" alt="Admin Dashboard" width="80%" />
  <p><em>Admin Dashboard</em></p>
</div>

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

<div align="center">
  <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D" alt="Vue.js" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" /></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
  <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" /></a>
  <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" /></a>
  <a href="https://greensock.com/gsap/"><img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" /></a>
</div>

---

<div align="center">
  <p>Made with ❤️ by Timmy</p>
</div>
