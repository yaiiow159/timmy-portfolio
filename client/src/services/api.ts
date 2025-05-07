import axios from 'axios'
type NotificationType = 'error' | 'success' | 'info' | 'warning'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

let currentLanguage = 'en'

export function updateApiLanguage(lang: string) {
  currentLanguage = lang
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 10000
})

api.interceptors.request.use(config => {
  if (config.headers) {
    config.headers['Accept-Language'] = currentLanguage
  }
  return config
})

const defaultErrorMessages = {
  badRequest: '請求無效',
  unauthorized: '未經授權',
  forbidden: '禁止訪問',
  notFound: '資源未找到',
  validationError: '驗證錯誤',
  tooManyRequests: '請求過多',
  serverError: '伺服器錯誤',
  offline: '網絡離線',
  general: '發生錯誤，請稍後再試'
}

export function handleApiError(error: any) {
  let errorMessage = error.response?.data?.msg ?? defaultErrorMessages.general
  let errorType: NotificationType = 'error'
  
  switch (error.response?.status) {
    case 400:
      errorMessage = error.response.data.msg ?? defaultErrorMessages.badRequest
      break
    case 401:
      errorMessage = defaultErrorMessages.unauthorized
      break
    case 403:
      errorMessage = defaultErrorMessages.forbidden
      break
    case 404:
      errorMessage = defaultErrorMessages.notFound
      break
    case 422:
      errorMessage = error.response.data.msg ?? defaultErrorMessages.validationError
      break
    case 429:
      errorMessage = defaultErrorMessages.tooManyRequests
      break
    case 500:
      errorMessage = defaultErrorMessages.serverError
      break
    default:
      if (!navigator.onLine) {
        errorMessage = defaultErrorMessages.offline
      } else {
        errorMessage = defaultErrorMessages.general
      }
  }
  
  return {
    type: errorType,
    message: errorMessage,
    error
  }
}

api.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error)
  }
)

export function getStaticUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  if (path.startsWith('//res.cloudinary.com')) {
    return `https:${path}`
  }

  if (path.startsWith('/uploads/') || path.startsWith('uploads/')) {
    const baseUrl = import.meta.env.VITE_API_URL || ''
    return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
  }


  return path
}

export default api
