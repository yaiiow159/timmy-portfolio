<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLanguageStore } from '@/store/languageStore.ts'
import type { SupportedLanguage } from '@/store/languageStore.ts'
import { availableLocales } from '@/i18n'

const languageStore = useLanguageStore()
const isOpen = ref(false)

const currentLanguage = computed(() => {
  return availableLocales.find(locale => locale.code === languageStore.currentLanguage)?.name || 'English'
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function changeLanguage(lang: SupportedLanguage) {
  languageStore.setLanguage(lang)
  isOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  const dropdown = document.getElementById('language-dropdown')
  
  if (isOpen.value && dropdown && !dropdown.contains(target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div id="language-dropdown" class="relative">
    <button 
      @click="toggleDropdown" 
      class="flex items-center space-x-1 text-text-primary hover:text-accent transition-colors"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      <span>{{ currentLanguage }}</span>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-4 w-4 transition-transform" 
        :class="{ 'rotate-180': isOpen }"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div 
        v-if="isOpen" 
        class="absolute right-0 mt-2 w-48 bg-secondary rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5"
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
    </transition>
  </div>
</template>
