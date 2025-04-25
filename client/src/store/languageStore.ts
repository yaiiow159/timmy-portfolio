import { defineStore } from 'pinia'
import { ref } from 'vue'
import i18n from '../i18n'
import { updateApiLanguage } from '../services/api'

export type SupportedLanguage = 'en' | 'zh-TW' | 'zh-CN' | 'ja'

export const useLanguageStore = defineStore('language', () => {
  const currentLanguage = ref<SupportedLanguage>(i18n.global.locale.value as SupportedLanguage)
  
  function setLanguage(lang: SupportedLanguage) {
    currentLanguage.value = lang
    i18n.global.locale.value = lang
    localStorage.setItem('user-language', lang)
    document.querySelector('html')?.setAttribute('lang', lang)
    // Update the API language
    updateApiLanguage(lang)
  }
  
  function initLanguage() {
    const savedLanguage = localStorage.getItem('user-language')
    if (savedLanguage) {
      setLanguage(savedLanguage as SupportedLanguage)
    } else {
      const browserLang = navigator.language
      if (browserLang.startsWith('zh-TW')) {
        setLanguage('zh-TW')
      } else if (browserLang.startsWith('zh-CN') || browserLang.startsWith('zh')) {
        setLanguage('zh-CN')
      } else if (browserLang.startsWith('ja')) {
        setLanguage('ja')
      } else {
        setLanguage('en')
      }
    }
  }
  
  return {
    currentLanguage,
    setLanguage,
    initLanguage
  }
})
