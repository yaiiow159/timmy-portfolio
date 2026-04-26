<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
import ScrollToTop from './ScrollToTop.vue'
import GlobalSearchModal from '@/components/common/GlobalSearchModal.vue'
import { useThemeStore } from '@/store/themeStore'
import { useLanguageStore } from '@/store/languageStore'
import { useGlobalSearch } from '@/composables/useGlobalSearch'

const themeStore = useThemeStore()
const languageStore = useLanguageStore()
const route = useRoute()
const { open: openGlobalSearch } = useGlobalSearch()

function onKeyDownForGlobalSearch(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    const t = e.target
    if (
      t instanceof HTMLInputElement ||
      t instanceof HTMLTextAreaElement ||
      (t instanceof HTMLElement && t.isContentEditable)
    ) {
      return
    }
    e.preventDefault()
    openGlobalSearch()
  }
}

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
  window.addEventListener('keydown', onKeyDownForGlobalSearch)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDownForGlobalSearch)
})
</script>

<template>
  <div class="min-h-screen flex w-full max-w-full min-w-0 flex-col" :class="themeClasses">
    <div class="fixed inset-0 opacity-50 z-[-1]" :class="bgGradientClass"></div>
    
    <Navbar />
    
    <main class="flex-grow w-full max-w-full min-w-0 container-custom py-6 sm:py-8 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <router-view v-slot="{ Component }">
        <transition name="page-fade">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
    </main>
    
    <Footer />

    <ScrollToTop />

    <GlobalSearchModal />
  </div>
</template>

<style scoped>
</style>
