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

/** 修正資料庫或上傳流程中誤存的雙重副檔名（例如 *.png.png），否則 Cloudinary 會 404 */
export function normalizeCloudinaryDeliveryUrl(url: string): string {
  if (!url.includes('res.cloudinary.com')) return url
  return url.replace(/\.(png|jpe?g|webp|gif)\.\1(?=$|[?#])/i, '.$1')
}

/** 文章 HTML / Markdown 內文中的 Cloudinary 連結一併修正 */
export function normalizeCloudinaryUrlsInString(text: string): string {
  if (!text.includes('res.cloudinary.com')) return text
  return text.replace(/(?:https?:)?\/\/res\.cloudinary\.com[^"'\\\s>]*/gi, (match) => {
    const absolute = match.startsWith('//') ? `https:${match}` : match
    return normalizeCloudinaryDeliveryUrl(absolute)
  })
}

export function getStaticUrl(path: string): string {
  let resolved: string
  if (path.startsWith('http://') || path.startsWith('https://')) {
    resolved = path
  } else if (path.startsWith('//res.cloudinary.com')) {
    resolved = `https:${path}`
  } else if (path.startsWith('/uploads/') || path.startsWith('uploads/')) {
    resolved = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  } else {
    resolved = path
  }
  return normalizeCloudinaryDeliveryUrl(resolved)
}

export default api
