import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
import api, { registerUnauthorizedHandler } from '../services/api'
import i18n from '../i18n'
import router from '../router'
import { handleError, handleSuccess, ErrorContext } from '@/utils/errorHandler'

export interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'editor' | 'user'
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData extends LoginCredentials {
    name: string
}

const t = i18n.global.t

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('auth-token'))
    const user = ref<User | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const isAuthenticated = computed(() => !!token.value && !!user.value)
    const isAdmin = computed(() => user.value?.role === 'admin')

    let refreshInterval: number | null = null

    async function loadUser() {
        if (!token.value) return

        isLoading.value = true
        error.value = null

        try {
            const response = await api.get('/auth/user')
            // 先統一角色大小寫可避免後端格式差異影響前端權限判斷
            user.value = {
                ...response.data,
                role: response.data.role?.toLowerCase() ?? 'user'
            }
            
            if (user.value && !refreshInterval) {
                startTokenRefresh()
            }
            
            return user.value
        } catch (err: any) {
            console.error('Error loading user:', err)
            if (err.response?.status === 401) {
                logout()
                error.value = handleError(err, {
                    context: ErrorContext.AUTH,
                    showNotification: true,
                    customMessage: t('errors.auth.sessionExpired')
                })
            }
            return null
        } finally {
            isLoading.value = false
        }
    }

    async function refreshToken() {
        if (!token.value) return

        try {
            const response = await api.post('/auth/refresh', {})
            token.value = response.data.token
            localStorage.setItem('auth-token', response.data.token)
        } catch (err) {
            console.error('Error refreshing token:', err)
            logout()
        }
    }

    async function login(credentials: LoginCredentials) {
        isLoading.value = true
        error.value = null

        try {
            const response = await api.post('/auth/login', credentials)
            token.value = response.data.token
            localStorage.setItem('auth-token', response.data.token)
            
            const userData = await loadUser()
            
            if (userData) {
                handleSuccess(t('auth.loginSuccess'))
                router.push('/admin')
                return true
            }
            
            return false
        } catch (err: any) {
            console.error('Login error:', err)
            error.value = handleError(err, {
                context: ErrorContext.AUTH,
                showNotification: true,
                customMessage: err.response?.data?.msg || t('errors.auth.loginFailed')
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
            return true
        } catch (err: any) {
            console.error('Registration error:', err)
            error.value = handleError(err, {
                context: ErrorContext.AUTH,
                showNotification: true,
                customMessage: err.response?.data?.msg || t('errors.auth.registerFailed')
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
        
        if (refreshInterval) {
            clearInterval(refreshInterval)
            refreshInterval = null
        }
        handleSuccess(t('auth.logoutSuccess'))
    }

    function startTokenRefresh() {
        if (refreshInterval) {
            clearInterval(refreshInterval)
        }
        refreshInterval = window.setInterval(() => {
            refreshToken()
        }, 15 * 60 * 1000)
    }

    // 401 屬於被動失效情境，靜默清理可避免重複彈出登出提示干擾使用流程
    registerUnauthorizedHandler(() => {
        token.value = null
        user.value = null
        if (refreshInterval) {
            clearInterval(refreshInterval)
            refreshInterval = null
        }
    })

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
