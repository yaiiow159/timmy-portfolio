<script setup lang="ts">
import { onMounted, computed } from 'vue'
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
import { useThemeStore } from '@/store/themeStore'
import { useLanguageStore } from '@/store/languageStore'

const themeStore = useThemeStore()
const languageStore = useLanguageStore()

const themeClasses = computed(() => {
  return themeStore.isDarkMode 
    ? 'bg-primary text-text-primary dark' 
    : 'bg-primary text-text-primary light'
})

const bgGradientClass = computed(() => {
  return themeStore.isDarkMode
    ? 'bg-gradient-radial from-dark-300 to-black'
    : 'bg-gradient-radial from-gray-100 to-white'
})

onMounted(() => {
  themeStore.initTheme()
  languageStore.initLanguage()
})
</script>

<template>
  <div class="min-h-screen flex flex-col" :class="themeClasses">
    <div class="fixed inset-0 opacity-50 z-[-1]" :class="bgGradientClass"></div>
    
    <Navbar />
    
    <main class="flex-grow container-custom py-8">
      <router-view v-slot="{ Component, route }">
        <transition :name="(route.meta.transition as string) || 'fade-in'" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <Footer />
  </div>
</template>
