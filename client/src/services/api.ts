import axios from 'axios'
import { API_BASE_URL } from '../config/api'

let currentLanguage = 'en'

export function updateApiLanguage(lang: string) {
  currentLanguage = lang
}

type UnauthorizedHandler = () => void
let unauthorizedHandler: UnauthorizedHandler | null = null

export function registerUnauthorizedHandler(fn: UnauthorizedHandler): void {
  unauthorizedHandler = fn
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
    let token: string | null = null
    try {
      token = localStorage.getItem('auth-token')
    } catch (storageError) {
      console.warn('Failed to read auth token from localStorage:', storageError)
    }
    if (token) {
      config.headers['x-auth-token'] = token
    }
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem('auth-token')
      } catch (storageError) {
        console.warn('Failed to remove auth token from localStorage:', storageError)
      }
      unauthorizedHandler?.()
    }
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
