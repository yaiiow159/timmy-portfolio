import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import zhTW from '../locales/zh-TW.json'
import zhCN from '../locales/zh-CN.json'
import ja from '../locales/ja.json'

const messages = {
  en,
  'zh-TW': zhTW,
  'zh-CN': zhCN,
  ja
}

export const availableLocales = [
  { code: 'en', name: 'English' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'zh-CN', name: '简体中文' },
  { code: 'ja', name: '日本語' }
]

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages
})

export default i18n
