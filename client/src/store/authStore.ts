import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

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
    } catch (err) {
      console.error('Error loading user:', err)
      logout()
    } finally {
      isLoading.value = false
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
      error.value = err.response?.data?.msg || '登入失敗'
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
      return true
    } catch (err: any) {
      console.error('Registration error:', err)
      error.value = err.response?.data?.msg || '註冊失敗'
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('auth-token')
  }
  
  if (token.value) {
    loadUser()
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
    loadUser
  }
})
