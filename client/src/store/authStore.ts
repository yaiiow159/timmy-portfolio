import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
import api from '../services/api'
import {useNotificationStore} from './notificationStore'
import {useI18n} from 'vue-i18n'
import router from '../router'

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

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('auth-token'))
    const user = ref<User | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const { t } = useI18n()
    const notificationStore = useNotificationStore()

    const isAuthenticated = computed(() => !!token.value && !!user.value)
    const isAdmin = computed(() => user.value?.role === 'admin')

    async function loadUser() {
        if (!token.value) return

        isLoading.value = true
        error.value = null

        try {
            const response = await api.get('/auth/user', {
                headers: {
                    'x-auth-token': token.value
                }
            })
            user.value = response.data
            
            // Start token refresh if not already started
            if (user.value && !refreshInterval) {
                startTokenRefresh()
            }
            
            return user.value
        } catch (err: any) {
            console.error('Error loading user:', err)
            if (err.response?.status === 401) {
                logout()
                error.value = t('errors.auth.sessionExpired')
                notificationStore.addNotification({
                    type: 'error',
                    message: error.value || t('errors.auth.sessionExpired'),
                    duration: 5000
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
            const response = await api.post('/auth/refresh', {}, {
                headers: {
                    'x-auth-token': token.value
                }
            })
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
                notificationStore.addNotification({
                    type: 'success',
                    message: t('auth.loginSuccess'),
                    duration: 3000
                })
                
                router.push('/admin')
                
                return true
            }
            
            return false
        } catch (err: any) {
            console.error('Login error:', err)
            error.value = err.response?.data?.msg ?? t('errors.auth.loginFailed')
            notificationStore.addNotification({
                type: 'error',
                message: error.value || t('errors.auth.loginFailed'),
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
            return true
        } catch (err: any) {
            console.error('Registration error:', err)
            error.value = err.response?.data?.msg ?? t('errors.auth.registerFailed')
            notificationStore.addNotification({
                type: 'error',
                message: error.value || t('errors.auth.registerFailed'),
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
        
        if (refreshInterval) {
            clearInterval(refreshInterval)
            refreshInterval = null
        }
        notificationStore.addNotification({
            type: 'info',
            message: t('auth.logoutSuccess'),
            duration: 3000
        })
    }

    let refreshInterval: number | null = null

    function startTokenRefresh() {
        if (refreshInterval) {
            clearInterval(refreshInterval)
        }
        
        refreshInterval = window.setInterval(() => {
            refreshToken()
        }, 15 * 60 * 1000)
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
