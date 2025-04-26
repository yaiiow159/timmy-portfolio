# 🚀 Backend - Node.js Application

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

</div>

## 📋 Overview

The backend is built with Node.js and Express, using PostgreSQL as the database and Prisma as the ORM. It provides a RESTful API for the portfolio website with robust authentication, data validation, and error handling. Images are stored and served via Cloudinary for optimized delivery and performance.

## 🚀 Features

- 🔐 **Authentication & Authorization** - Secure JWT-based authentication
- 📝 **Blog Management** - Create, read, update, and delete blog posts
- 🎯 **Project Management** - Manage portfolio projects
- 📧 **Email Notifications** - Send emails via SMTP
- 📊 **Analytics** - Track page views and user engagement
- 🔍 **Search Functionality** - Full-text search for blog posts
- 📄 **File Uploads** - Store and serve images and documents via Cloudinary
- 🌐 **CORS Support** - Secure cross-origin requests
- 🔒 **Rate Limiting** - Prevent abuse and DDoS attacks
- 📝 **Logging** - Comprehensive logging for debugging and monitoring

## 💻 Development

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- PostgreSQL 16.x or higher
- Docker (optional but recommended)

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
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
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

- `npm run dev` - Start development server with hot reload
- `npm run start` - Start production server
- `npm run build` - Build for production (if using TypeScript)
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run migrate` - Run Prisma migrations
- `npm run seed` - Seed the database

## 🏗️ Project Structure

```
server/
├── middleware/          # Express middleware
│   ├── auth.js          # Authentication middleware
│   └── validation.js    # Request validation middleware
├── prisma/              # Prisma schema and migrations
│   ├── schema.prisma    # Database schema
│   ├── migrations/      # Migration files
│   └── seed.js          # Database seed script
├── routes/              # API routes
│   ├── auth.js          # Authentication routes
│   ├── blog.js          # Blog routes
│   ├── projects.js      # Project routes
│   ├── contact.js       # Contact form routes
│   ├── uploads.js       # File upload routes with Cloudinary integration
│   └── index.js         # Route aggregator
├── config/              # Configuration files
│   └── cloudinary.js    # Cloudinary configuration
├── scripts/             # Utility scripts
│   └── init-db.js       # Database initialization
├── .env                 # Environment variables
├── .env.dev             # Development environment variables
├── .env.production      # Production environment variables
├── package.json         # Project dependencies
└── server.js            # Server entry point
```

## 📦 Dependencies

- **Express** - Web framework
- **Prisma** - ORM for database access
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email sending
- **Multer** - File uploads
- **Cloudinary** - Cloud image storage and management
- **Streamifier** - Stream conversion for Cloudinary uploads
- **Winston** - Logging
- **Joi** - Request validation
- **Cors** - CORS middleware
- **Helmet** - Security headers
- **Express-rate-limit** - Rate limiting

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|:---------|:------------|:---------|
| `PORT` | Server port | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | JWT secret key | Yes |
| `JWT_EXPIRES_IN` | JWT expiration time | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |
| `CORS_ORIGIN` | Allowed CORS origins | Yes |
| `EMAIL_HOST` | SMTP host | For email |
| `EMAIL_PORT` | SMTP port | For email |
| `EMAIL_SECURE` | Use TLS | For email |
| `EMAIL_USER` | SMTP username | For email |
| `EMAIL_PASS` | SMTP password | For email |
| `LOG_LEVEL` | Winston log level | No |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |

## 🔒 API Security

The API implements several security measures:

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Security headers with Helmet
- Input validation with Joi
- SQL injection protection with Prisma

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run specific test suite
npm run test:auth
npm run test:blog
npm run test:projects
```

## 📝 API Documentation

API documentation is available at `/api-docs` when running the server in development mode.

### Main Endpoints

| Method | Endpoint | Description | Auth Required |
|:-------|:---------|:------------|:--------------|
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/register` | User registration | No |
| GET | `/api/blog` | Get all blog posts | No |
| GET | `/api/blog/:id` | Get blog post by ID | No |
| POST | `/api/blog` | Create blog post | Yes |
| PUT | `/api/blog/:id` | Update blog post | Yes |
| DELETE | `/api/blog/:id` | Delete blog post | Yes |
| GET | `/api/projects` | Get all projects | No |
| POST | `/api/contact` | Send contact message | No |
| POST | `/api/uploads` | Upload file to Cloudinary | Yes |
| DELETE | `/api/uploads/:publicId` | Delete file from Cloudinary | Yes |

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.