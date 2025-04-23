import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import zhTW from '../locales/zh-TW.json'
import zhCN from '../locales/zh-CN.json'
import ja from '../locales/ja.json'

type LocaleCode = 'en' | 'zh-TW' | 'zh-CN' | 'ja'

const messages = {
  en,
  'zh-TW': zhTW,
  'zh-CN': zhCN,
  ja
}

export const availableLocales = [
  { code: 'en' as LocaleCode, name: 'English' },
  { code: 'zh-TW' as LocaleCode, name: '繁體中文' },
  { code: 'zh-CN' as LocaleCode, name: '简体中文' },
  { code: 'ja' as LocaleCode, name: '日本語' }
]

// 獲取瀏覽器語言設置
const getBrowserLocale = (): LocaleCode => {
  const navigatorLocale = navigator.language
  const localeCode = navigatorLocale.includes('-') ? navigatorLocale : 'en'
  return (availableLocales.find(locale => locale.code === localeCode)?.code || 'en') as LocaleCode
}

// 獲取存儲的語言設置或使用瀏覽器語言
const getStoredLocale = (): LocaleCode => {
  const storedLocale = localStorage.getItem('locale') as LocaleCode
  return storedLocale || getBrowserLocale()
}

const i18n = createI18n({
  legacy: false,
  locale: getStoredLocale(),
  fallbackLocale: 'en',
  messages,
  globalInjection: true,
  silentTranslationWarn: true,
})

// 監聽語言變化並保存到localStorage
export const setLocale = (locale: LocaleCode) => {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  document.querySelector('html')?.setAttribute('lang', locale)
}

export default i18n
