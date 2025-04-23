import axios from 'axios'
import { useLanguageStore } from '../store/languageStore'
import { useNotificationStore } from '../store/notificationStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
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
    const errorMessage = error.response?.data?.msg || 'An error occurred'
    
    notificationStore.addNotification({
      type: 'error',
      message: errorMessage,
      duration: 5000
    })
    
    return Promise.reject(error)
  }
)

export default api
