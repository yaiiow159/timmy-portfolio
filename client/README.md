# 🎨 Frontend - Vue.js Application

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-F7D336?style=for-the-badge&logo=vue.js&logoColor=black)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

</div>

<p align="center">
<i>Last updated: May 10, 2025</i>
</p>

## 📋 Overview

The frontend is built with Vue.js 3 and TypeScript, using Vite as the build tool and TailwindCSS for styling. It provides a modern, responsive user interface for the portfolio website with a focus on performance and user experience. Images are stored and served via Cloudinary for optimized delivery and performance.

## 🚀 Features

- 📱 **Responsive Design** - Optimized for all device sizes
- 🎨 **Modern UI** with TailwindCSS
- 🔄 **Real-time Updates** using Vue's reactive system
- 📝 **Rich Text Blog Editor** with markdown support
- 🎯 **Interactive Project Showcase**
- 📧 **Contact Form** with validation
- 🔐 **Admin Dashboard** for content management
- 🌙 **Dark Mode** support
- 🌐 **i18n Support** for multiple languages (English, Traditional Chinese, Simplified Chinese)
- 🔍 **SEO Optimization** for better discoverability
- 🖼️ **Cloud Image Management** - Optimized image storage and delivery with Cloudinary
- 🚀 **Performance Optimized** - Lazy loading and code splitting
- 🧩 **Component Library** - Reusable UI components

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
- `npm run test:unit` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

## 🏗️ Project Structure

```
client/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable components
│   │   ├── blog/       # Blog-related components
│   │   ├── common/     # Shared UI components
│   │   ├── layout/     # Layout components
│   │   └── portfolio/  # Portfolio components
│   ├── composables/    # Vue composables
│   ├── locales/        # i18n translation files
│   │   ├── en.json     # English translations
│   │   ├── zh-TW.json  # Traditional Chinese translations
│   │   └── zh-CN.json  # Simplified Chinese translations
│   ├── views/          # Page components
│   │   ├── admin/      # Admin dashboard views
│   │   ├── blog/       # Blog-related views
│   │   └── portfolio/  # Portfolio-related views
│   ├── router/         # Vue Router configuration
│   ├── stores/         # Pinia stores
│   │   ├── auth.ts     # Authentication store
│   │   ├── blog.ts     # Blog store
│   │   └── portfolio.ts # Portfolio store
│   ├── styles/         # Global styles
│   ├── utils/          # Utility functions
│   ├── App.vue         # Root component
│   └── main.ts         # Application entry point
├── .eslintrc.js        # ESLint configuration
├── .prettierrc         # Prettier configuration
├── index.html          # HTML template
├── package.json        # Project dependencies
├── tailwind.config.js  # Tailwind configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## 📦 Dependencies

- **Vue.js 3** - Progressive JavaScript framework
- **Vue Router** - Official router for Vue.js
- **Pinia** - State management library
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Vue I18n** - Internationalization
- **VueUse** - Collection of Vue composition utilities
- **Marked** - Markdown parser
- **Highlight.js** - Syntax highlighting
- **Day.js** - Date manipulation library
- **Vee-Validate** - Form validation
- **Cloudinary** - Cloud image management

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|:---------|:------------|:--------|
| `VITE_API_URL` | Backend API URL | http://localhost:5000 |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | false |
| `VITE_I18N_LOCALE` | Default locale | en |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (optional) | - |

### Customization

The UI can be customized by modifying the following files:

- `tailwind.config.js` - TailwindCSS theme configuration
- `src/styles/variables.css` - CSS variables
- `src/assets/themes/` - Theme configuration files

## 🧪 Testing

This project uses Vitest for unit testing and Cypress for end-to-end testing.

```bash
# Run unit tests
npm run test:unit

# Run end-to-end tests
npm run test:e2e
```

## 🔄 Build and Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist` directory, which can be deployed to any static hosting service.

## 📱 Responsive Design

The application is fully responsive and optimized for the following breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🌐 Browser Support

The application is tested and supported on the following browsers:

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## 🐳 Docker Development

For Docker-based development, the frontend is configured to run in a container with hot reloading enabled. See the main project README for Docker setup instructions.

## 🔍 Known Issues and Workarounds

### Image Handling

The project uses Cloudinary for image storage. The database schema uses `imageUrl` as an array of strings (`String[]`), but some older code may reference `imageUrls`. The `portfolioStore.ts` includes normalization to handle both field names for backward compatibility.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
