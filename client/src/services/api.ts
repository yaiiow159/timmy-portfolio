import axios from 'axios'
import { API_BASE_URL } from '../config/api'
type NotificationType = 'error' | 'success' | 'info' | 'warning'

let currentLanguage = 'en'

export function updateApiLanguage(lang: string) {
  currentLanguage = lang
}

const api = axios.create({
  baseURL: API_BASE_URL,
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
    return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  }


  return path
}

export default api
