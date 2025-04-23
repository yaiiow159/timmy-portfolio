# 🚀 Backend - Node.js Application

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

</div>

## 📋 Overview

The backend is built with Node.js and Express, using PostgreSQL as the database and Prisma as the ORM. It provides a RESTful API for the portfolio website.

## 🚀 Features

- 🔐 Authentication & Authorization
- 📝 Blog Management
- 🎯 Project Management
- 📧 Email Notifications
- 📊 Analytics
- 🔍 Search Functionality
- 📄 File Uploads
- 🌐 CORS Support

## 💻 Development

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- PostgreSQL 14.x or higher
- Docker (optional)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/timmy_portfolio?schema=public"
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

3. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

4. Start development server:
```bash
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests

## 🏗️ Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── app.js           # Express application
│   └── server.js        # Server entry point
├── prisma/              # Prisma schema and migrations
├── tests/               # Test files
├── .eslintrc.js         # ESLint configuration
├── .prettierrc          # Prettier configuration
├── package.json         # Project dependencies
└── docker-compose.yml   # Docker configuration
```

## 📦 Dependencies

- Express - Web framework
- Prisma - ORM
- PostgreSQL - Database
- JWT - Authentication
- Nodemailer - Email notifications
- Winston - Logging
- Jest - Testing
- ESLint - Linting
- Prettier - Code formatting

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|:---------|:------------|:--------|
| `PORT` | Server port | 5000 |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | JWT secret key | - |
| `NODE_ENV` | Environment | development |

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details. 