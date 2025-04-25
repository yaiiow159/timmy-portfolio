import axios from 'axios'
import { useLanguageStore } from '../store/languageStore'
import { useNotificationStore } from '../store/notificationStore'
import { useI18n } from 'vue-i18n'

type NotificationType = 'error' | 'success' | 'info' | 'warning'

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
    const { t } = useI18n()
    
    let errorMessage = error.response?.data?.msg ?? t('errors.general.message')
    let errorType: NotificationType = 'error'
    
    switch (error.response?.status) {
      case 400:
        errorMessage = error.response.data.msg ?? t('errors.general.badRequest')
        break
      case 401:
        errorMessage = t('errors.auth.unauthorized')
        break
      case 403:
        errorMessage = t('errors.auth.forbidden')
        break
      case 404:
        errorMessage = t('errors.general.notFound')
        break
      case 422:
        errorMessage = error.response.data.msg ?? t('errors.general.validationError')
        break
      case 429:
        errorMessage = t('errors.general.tooManyRequests')
        break
      case 500:
        errorMessage = t('errors.general.serverError')
        break
      default:
        if (!navigator.onLine) {
          errorMessage = t('errors.general.offline')
        } else {
          errorMessage = t('errors.general.message')
        }
    }
    
    notificationStore.addNotification({
      type: errorType,
      message: errorMessage,
      duration: 5000
    })
    
    return Promise.reject(new Error(errorMessage))
  }
)

export function getStaticUrl(path: string): string {
  return path 
}

export default api
