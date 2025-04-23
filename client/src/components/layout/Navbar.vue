<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/store/themeStore.ts'
import { useLanguageStore } from '@/store/languageStore.ts'
import type { SupportedLanguage } from '@/store/languageStore.ts'
import { availableLocales } from '@/i18n'

const { t } = useI18n()
const router = useRouter()
const themeStore = useThemeStore()
const languageStore = useLanguageStore()

const isMenuOpen = ref(false)
const isLanguageMenuOpen = ref(false)

const currentLanguage = computed(() => {
  return availableLocales.find(locale => locale.code === languageStore.currentLanguage)?.name || 'English'
})

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    isLanguageMenuOpen.value = false
  }
}

function toggleLanguageMenu() {
  isLanguageMenuOpen.value = !isLanguageMenuOpen.value
}

function changeLanguage(lang: SupportedLanguage) {
  languageStore.setLanguage(lang)
  isLanguageMenuOpen.value = false
}

function navigateTo(path: string) {
  router.push(path)
  isMenuOpen.value = false
}
</script>

<template>
  <header class="fixed w-full top-0 z-50 bg-secondary shadow-md">
    <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
      <!-- Logo -->
      <div class="flex items-center">
        <router-link to="/" class="text-2xl font-bold text-accent hover:text-accent-light transition-colors">
          Timmy
        </router-link>
      </div>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-8">
        <router-link 
          v-for="item in ['home', 'blog', 'portfolio', 'resume', 'contact']" 
          :key="item"
          :to="`/${item === 'home' ? '' : item}`"
          class="text-text-primary hover:text-accent transition-colors"
          active-class="text-accent font-semibold"
        >
          {{ t(`nav.${item}`) }}
        </router-link>
        
        <!-- Language Selector -->
        <div class="relative">
          <button 
            @click="toggleLanguageMenu" 
            class="flex items-center space-x-1 text-text-primary hover:text-accent transition-colors"
          >
            <span>{{ currentLanguage }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div 
            v-if="isLanguageMenuOpen" 
            class="absolute right-0 mt-2 w-48 bg-secondary rounded-md shadow-lg py-1 z-50 animate-fade-in"
          >
            <button 
              v-for="locale in availableLocales" 
              :key="locale.code"
              @click="changeLanguage(locale.code as SupportedLanguage)"
              class="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-accent hover:text-white transition-colors"
              :class="{ 'bg-accent/20': locale.code === languageStore.currentLanguage }"
            >
              {{ locale.name }}
            </button>
          </div>
        </div>
        
        <!-- Theme Toggle -->
        <button 
          @click="themeStore.toggleDarkMode" 
          class="text-text-primary hover:text-accent transition-colors"
          aria-label="Toggle dark mode"
        >
          <svg v-if="themeStore.isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </div>
      
      <!-- Mobile Menu Button -->
      <div class="md:hidden flex items-center space-x-4">
        <!-- Theme Toggle -->
        <button 
          @click="themeStore.toggleDarkMode" 
          class="text-text-primary hover:text-accent transition-colors"
          aria-label="Toggle dark mode"
        >
          <svg v-if="themeStore.isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
        
        <button 
          @click="toggleMenu" 
          class="text-text-primary hover:text-accent transition-colors"
          aria-label="Toggle menu"
        >
          <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </nav>
    
    <!-- Mobile Menu -->
    <div 
      v-if="isMenuOpen" 
      class="md:hidden bg-secondary shadow-lg animate-fade-in"
    >
      <div class="px-4 py-2 space-y-2">
        <button 
          v-for="item in ['home', 'blog', 'portfolio', 'resume', 'contact']" 
          :key="item"
          @click="navigateTo(`/${item === 'home' ? '' : item}`)"
          class="block w-full text-left py-2 text-text-primary hover:text-accent transition-colors"
          :class="{ 'text-accent font-semibold': $route.path === `/${item === 'home' ? '' : item}` }"
        >
          {{ t(`nav.${item}`) }}
        </button>
        
        <!-- Language Selector -->
        <div class="py-2">
          <div class="font-semibold mb-1 text-text-secondary">{{ currentLanguage }}</div>
          <div class="space-y-1">
            <button 
              v-for="locale in availableLocales" 
              :key="locale.code"
              @click="changeLanguage(locale.code as SupportedLanguage)"
              class="block w-full text-left pl-2 py-1 text-sm text-text-primary hover:bg-accent hover:text-white transition-colors rounded"
              :class="{ 'bg-accent/20': locale.code === languageStore.currentLanguage }"
            >
              {{ locale.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
  
  <!-- Spacer to prevent content from being hidden under fixed navbar -->
  <div class="h-16"></div>
</template>
