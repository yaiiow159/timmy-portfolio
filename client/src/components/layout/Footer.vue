<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/store/themeStore'

const { t } = useI18n()
const themeStore = useThemeStore()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="relative overflow-hidden py-8 mt-8 bg-primary/10 dark:bg-dark-300/30 backdrop-blur-sm">
    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 dark:to-dark-400/20 z-0"></div>
    
    <div class="container relative z-10 mx-auto px-6">
      <div class="flex flex-wrap justify-between">
        <div class="w-full md:w-auto mb-6 md:mb-0">
          <h3 class="text-xl font-bold mb-3 text-accent">Timmy</h3>
          <p class="text-text-secondary mb-4 leading-relaxed max-w-md">
            {{ t('footer.developerDescription') }}
          </p>
        </div>
        
        <div class="w-full md:w-auto mb-6 md:mb-0 md:mx-4">
          <h3 class="text-xl font-bold mb-3 text-accent">{{ t('contact.title') }}</h3>
          <div class="flex flex-wrap gap-4">
            <a href="mailto:examyou076@gmail.com" 
               class="flex items-center space-x-2 text-text-secondary hover:text-accent hover:scale-105 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Mail</span>
            </a>
            
            <a href="https://github.com/yaiiow159" target="_blank" 
               class="flex items-center space-x-2 text-text-secondary hover:text-accent hover:scale-105 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </a>
            
            <a href="https://www.linkedin.com/in/timmy-chung-46a132289" target="_blank" 
               class="flex items-center space-x-2 text-text-secondary hover:text-accent hover:scale-105 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span>LinkedIn</span>
            </a>
            
            <a href="#" 
               class="flex items-center space-x-2 text-text-secondary hover:text-accent hover:scale-105 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.819 4.588 8.845 10.56 9.608.386.083.922.258 1.056.593.121.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.049-3.856 2.049-5.993zm-18.452 2.25h-1.147v-4.596h1.147v4.596zm2.874 0h-1.147v-4.596h1.147v4.596zm2.873 0h-1.147v-4.596h1.147v4.596zm2.874 0h-1.147v-4.596h1.147v4.596z"/>
              </svg>
              <span>Line</span>
            </a>
          </div>
        </div>
      </div>
      
      <div class="mt-6 pt-4 border-t border-primary/10 dark:border-dark-200/10 flex flex-col md:flex-row justify-between items-center">
        <p class="text-text-secondary text-sm mb-2 md:mb-0">{{ t('footer.copyright').replace('2025', currentYear.toString()) }}</p>
        
        <div class="flex items-center space-x-3">
          <p class="text-sm text-text-secondary">{{ t('footer.madeWith') }} <span class="text-accent">✨</span></p>
          
          <button @click="themeStore.toggleDarkMode"
                  class="ml-3 p-1.5 rounded-full hover:bg-primary/10 dark:hover:bg-dark-200/20 transition-all duration-300"
                  :aria-label="themeStore.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'">
            <svg v-if="themeStore.isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>
