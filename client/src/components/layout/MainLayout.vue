<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
import { useThemeStore } from '@/store/themeStore'
import { useLanguageStore } from '@/store/languageStore'

const themeStore = useThemeStore()
const languageStore = useLanguageStore()
const route = useRoute()

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
      <router-view v-slot="{ Component }">
        <!-- 不使用 mode="out-in"：先卸載再掛載時，若離場動畫或片段根節點異常，會出現整頁空白 -->
        <transition name="page-fade">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
    </main>
    
    <Footer />
  </div>
</template>

<style scoped>
</style>
