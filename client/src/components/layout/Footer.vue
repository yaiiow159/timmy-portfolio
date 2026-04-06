<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/store/themeStore'

const { t } = useI18n()
const router = useRouter()
const themeStore = useThemeStore()
const currentYear = new Date().getFullYear()

const quickLinks = [
  { name: 'Home', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Portfolio', path: '/portfolio', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { name: 'Blog', path: '/blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  { name: 'Resume', path: '/resume', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { name: 'Contact', path: '/contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
]

const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/yaiiow159', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/timmy-chung-46a132289', icon: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' },
  { name: 'Email', url: 'mailto:examyou076@gmail.com', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', stroke: true }
]
</script>

<template>
  <footer class="relative overflow-hidden py-16 mt-20 bg-gradient-to-b from-secondary to-primary tech-grid-bg border-t border-accent/10">
    <!-- Tech decoration elements -->
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
    <div class="tech-decoration circle-1 opacity-30"></div>
    <div class="tech-decoration circle-2 opacity-30"></div>
    
    <div class="container relative z-10 mx-auto px-6 md:px-8">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <!-- Brand Section -->
        <div class="lg:col-span-1">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-tech-purple flex items-center justify-center mr-3 shadow-lg shadow-accent/30">
              <span class="text-white font-bold text-xl">T</span>
            </div>
            <h3 class="tech-title text-2xl font-bold">Timmy</h3>
          </div>
          <p class="text-text-secondary leading-relaxed mb-6">
            {{ t('footer.developerDescription') }}
          </p>
          <div class="flex items-center space-x-2 text-sm text-text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Taipei, Taiwan</span>
          </div>
        </div>
        
        <!-- Quick Links -->
        <div class="lg:col-span-1">
          <h4 class="text-lg font-bold mb-6 text-accent flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {{ t('footer.quickLinks') || 'Quick Links' }}
          </h4>
          <ul class="space-y-3">
            <li v-for="link in quickLinks" :key="link.path">
              <button
                @click="router.push(link.path)"
                class="flex items-center text-text-secondary hover:text-accent transition-all duration-300 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="link.icon" />
                </svg>
                <span>{{ t(`nav.${link.name.toLowerCase()}`) }}</span>
              </button>
            </li>
          </ul>
        </div>
        
        <!-- Tech Stack -->
        <div class="lg:col-span-1">
          <h4 class="text-lg font-bold mb-6 text-accent flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            {{ t('footer.techStack') || 'Tech Stack' }}
          </h4>
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 bg-gradient-to-r from-accent/10 to-tech-purple/10 text-accent text-xs rounded-full border border-accent/20 hover:border-accent/50 transition-all duration-300">Vue.js</span>
            <span class="px-3 py-1 bg-gradient-to-r from-accent/10 to-tech-purple/10 text-accent text-xs rounded-full border border-accent/20 hover:border-accent/50 transition-all duration-300">TypeScript</span>
            <span class="px-3 py-1 bg-gradient-to-r from-accent/10 to-tech-purple/10 text-accent text-xs rounded-full border border-accent/20 hover:border-accent/50 transition-all duration-300">Node.js</span>
            <span class="px-3 py-1 bg-gradient-to-r from-accent/10 to-tech-purple/10 text-accent text-xs rounded-full border border-accent/20 hover:border-accent/50 transition-all duration-300">Tailwind</span>
            <span class="px-3 py-1 bg-gradient-to-r from-accent/10 to-tech-purple/10 text-accent text-xs rounded-full border border-accent/20 hover:border-accent/50 transition-all duration-300">Prisma</span>
            <span class="px-3 py-1 bg-gradient-to-r from-accent/10 to-tech-purple/10 text-accent text-xs rounded-full border border-accent/20 hover:border-accent/50 transition-all duration-300">PostgreSQL</span>
          </div>
        </div>
        
        <!-- Social Links -->
        <div class="lg:col-span-1">
          <h4 class="text-lg font-bold mb-6 text-accent flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            {{ t('footer.connect') || 'Connect' }}
          </h4>
          <div class="flex flex-wrap gap-3">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.url"
              :target="social.url.startsWith('http') ? '_blank' : '_self'"
              :aria-label="social.name"
              class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/10 to-tech-purple/10 flex items-center justify-center text-accent hover:bg-gradient-to-br hover:from-accent hover:to-tech-purple hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-2xl tech-glow border border-accent/20 hover:border-accent"
            >
              <svg v-if="social.stroke" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="social.icon" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path :d="social.icon" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <div class="pt-8 border-t border-accent/10">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center space-x-4">
            <p class="text-text-secondary text-sm">
              © {{ currentYear }} <span class="text-accent font-semibold">Timmy</span>. {{ t('footer.allRightsReserved') || 'All rights reserved.' }}
            </p>
          </div>
          
          <div class="flex items-center space-x-6">
            <button
              @click="themeStore.toggleDarkMode"
              class="tech-button p-2.5 rounded-xl transition-all duration-300 transform hover:scale-110 tech-glow"
              :aria-label="themeStore.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              <svg v-if="themeStore.isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.tech-decoration {
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(var(--accent-rgb), 0.1), transparent);
  border-radius: 50%;
  animation: tech-float 6s ease-in-out infinite;
}

.circle-1 {
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}

.circle-2 {
  bottom: 20%;
  right: 10%;
  animation-delay: 3s;
}

@keyframes tech-float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}
</style>
