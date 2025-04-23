# 🎨 Frontend - Vue.js Application

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

## 📋 Overview

The frontend is built with Vue.js 3, using Vite as the build tool and TailwindCSS for styling. It provides a modern, responsive user interface for the portfolio website.

## 🚀 Features

- 📱 Responsive Design
- 🎨 Modern UI with TailwindCSS
- 🔄 Real-time Updates
- 📝 Blog System
- 🎯 Project Showcase
- 📧 Contact Form
- 🔐 Admin Dashboard

## 💻 Development

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
VITE_API_URL=http://localhost:5000
```

3. Start development server:
```bash
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🏗️ Project Structure

```
client/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable components
│   ├── composables/    # Vue composables
│   ├── layouts/        # Page layouts
│   ├── pages/          # Page components
│   ├── router/         # Vue Router configuration
│   ├── stores/         # Pinia stores
│   ├── styles/         # Global styles
│   ├── utils/          # Utility functions
│   ├── App.vue         # Root component
│   └── main.js         # Application entry point
├── .eslintrc.js        # ESLint configuration
├── .prettierrc         # Prettier configuration
├── index.html          # HTML template
├── package.json        # Project dependencies
└── vite.config.js      # Vite configuration
```

## 📦 Dependencies

- Vue.js 3 - Progressive JavaScript framework
- Vue Router - Official router for Vue.js
- Pinia - State management library
- TailwindCSS - Utility-first CSS framework
- Axios - HTTP client
- Vue I18n - Internationalization
- VueUse - Collection of Vue composition utilities

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|:---------|:------------|:--------|
| `VITE_API_URL` | Backend API URL | http://localhost:5000 |

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
