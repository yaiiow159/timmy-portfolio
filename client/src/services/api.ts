import axios from 'axios'
import { useLanguageStore } from '../store/languageStore'
import { useNotificationStore } from '../store/notificationStore'

// 在開發和生產環境中都使用相對路徑
const baseURL = '/api'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 10000
})

api.interceptors.request.use(config => {
  const languageStore = useLanguageStore()
  if (config.headers) {
    config.headers['Accept-Language'] = languageStore.currentLanguage
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    const notificationStore = useNotificationStore()
    const errorMessage = error.response?.data?.msg ?? 'An error occurred'
    
    notificationStore.addNotification({
      type: 'error',
      message: errorMessage,
      duration: 5000
    })
    
    return Promise.reject(new Error(errorMessage))
  }
)

// 靜態檔案路徑處理
export function getStaticUrl(path: string): string {
  return path // 使用相對路徑，Vite 代理會處理轉發
}

export default api
