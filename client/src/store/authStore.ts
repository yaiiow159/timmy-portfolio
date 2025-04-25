import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'
import { useNotificationStore } from './notificationStore'
import { useI18n } from 'vue-i18n'

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'user'
  date: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth-token'))
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const notificationStore = useNotificationStore()
  const { t } = useI18n()
  
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  
  async function loadUser() {
    if (!token.value) return
    
    isLoading.value = true
    
    try {
      const response = await api.get('/auth/user', {
        headers: {
          'x-auth-token': token.value
        }
      })
      user.value = response.data
    } catch (err: any) {
      console.error('Error loading user:', err)
      if (err.response?.status === 401) {
        notificationStore.addNotification({
          type: 'error',
          message: t('errors.auth.sessionExpired'),
          duration: 5000
        })
        logout()
      }
    } finally {
      isLoading.value = false
    }
  }
  
  async function refreshToken() {
    try {
      const response = await api.post('/auth/refresh', {}, {
        headers: {
          'x-auth-token': token.value
        }
      })
      token.value = response.data.token
      localStorage.setItem('auth-token', response.data.token)
      return true
    } catch (err) {
      console.error('Token refresh error:', err)
      logout()
      return false
    }
  }
  
  async function login(credentials: LoginCredentials) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.post('/auth/login', credentials)
      token.value = response.data.token
      localStorage.setItem('auth-token', response.data.token)
      await loadUser()
      return true
    } catch (err: any) {
      console.error('Login error:', err)
      error.value = err.response?.data?.msg ?? t('errors.auth.loginFailed')
      notificationStore.addNotification({
        type: 'error',
        message: error.value,
        duration: 5000
      })
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  async function register(data: RegisterData) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.post('/auth/register', data)
      token.value = response.data.token
      localStorage.setItem('auth-token', response.data.token)
      await loadUser()
      notificationStore.addNotification({
        type: 'success',
        message: t('auth.registerSuccess'),
        duration: 3000
      })
      return true
    } catch (err: any) {
      console.error('Registration error:', err)
      error.value = err.response?.data?.msg ?? t('errors.auth.registerFailed')
      notificationStore.addNotification({
        type: 'error',
        message: error.value,
        duration: 5000
      })
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('auth-token')
    notificationStore.addNotification({
      type: 'info',
      message: t('auth.logoutSuccess'),
      duration: 3000
    })
  }
  
  let refreshInterval: number | null = null
  
  function startTokenRefresh() {
    if (refreshInterval) return
    
    refreshInterval = window.setInterval(async () => {
      if (token.value) {
        await refreshToken()
      }
    }, 15 * 60 * 1000)
  }
  
  function stopTokenRefresh() {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }
  
  if (token.value) {
    loadUser()
    startTokenRefresh()
  }
  
  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    loadUser,
    refreshToken
  }
})
