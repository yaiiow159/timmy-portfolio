import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDarkMode = ref(true)
  
  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
    updateTheme()
    localStorage.setItem('dark-mode', isDarkMode.value.toString())
  }
  
  function updateTheme() {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
  }
  
  function initTheme() {
    const savedTheme = localStorage.getItem('dark-mode')
    if (savedTheme !== null) {
      isDarkMode.value = savedTheme === 'true'
    } else {
      // Check for system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDarkMode.value = prefersDark
    }
    updateTheme()
  }
  
  return {
    isDarkMode,
    toggleDarkMode,
    initTheme
  }
})
