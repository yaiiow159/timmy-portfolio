import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Get environment variables with fallbacks
const API_URL = process.env.VITE_API_URL || 'http://localhost:5000'

export default defineConfig({
  plugins: [vue()],
  
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
        changeOrigin: true
      },
      '/uploads': {
        target: API_URL,
        changeOrigin: true
      }
    },
    allowedHosts: [
      '2437-2407-4b00-2c00-e70-7198-acf9-c943-545b.ngrok-free.app'
    ]
  },

  
  define: {
    'process.env': {}
  },
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'axios'],
        }
      }
    }
  }
})
