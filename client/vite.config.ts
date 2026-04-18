import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const API_URL = process.env.VITE_API_URL || 'http://backend-dev:5000'

export default defineConfig({
  plugins: [vue()],
  
  base: '/',
  
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  
  server: {
    host: true, 
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: API_URL,
        changeOrigin: true,
        secure: false
      }
    },
  },
  
  define: {
    'process.env': {}
  },
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'axios'],
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
})
