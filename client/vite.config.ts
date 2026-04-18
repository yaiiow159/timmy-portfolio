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
    // production 不產生 sourcemap，避免暴露原始碼結構並減少部署體積
    sourcemap: process.env.NODE_ENV !== 'production',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // 核心框架獨立打包，提高快取命中率
          vendor: ['vue', 'vue-router', 'pinia', 'axios'],
          // markdown 解析與語法高亮僅在文章頁使用，延遲載入減少首屏體積
          markdown: ['marked', 'highlight.js'],
          // GSAP 動畫庫體積較大，單獨拆出避免阻塞主包
          animation: ['gsap'],
          // i18n 語言包與核心邏輯分離，便於語系檔案獨立快取
          i18n: ['vue-i18n'],
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
})
