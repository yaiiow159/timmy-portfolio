<template>
  <div class="min-h-screen bg-primary dark:bg-primary-dark">
    <div class="flex">
      <div class="w-64 min-h-screen bg-secondary dark:bg-secondary-dark border-r border-gray-200 dark:border-gray-800">
        <div class="p-6">
          <h1 class="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
            {{ t('admin.dashboard') }}
          </h1>
        </div>
        
        <nav class="mt-6 px-4">
          <router-link 
            to="/admin" 
            exact-active-class="bg-accent/10 dark:bg-accent-light/10 text-accent dark:text-accent-light"
            class="flex items-center px-4 py-3 text-text-primary dark:text-text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors mb-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {{ t('admin.dashboard') }}
          </router-link>
          
          <router-link 
            to="/admin/posts" 
            active-class="bg-accent/10 dark:bg-accent-light/10 text-accent dark:text-accent-light"
            class="flex items-center px-4 py-3 text-text-primary dark:text-text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors mb-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            {{ t('admin.posts') }}
          </router-link>
          
          <router-link 
            to="/admin/projects" 
            active-class="bg-accent/10 dark:bg-accent-light/10 text-accent dark:text-accent-light"
            class="flex items-center px-4 py-3 text-text-primary dark:text-text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors mb-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            {{ t('admin.projects') }}
          </router-link>
          
          <router-link 
            to="/admin/files" 
            active-class="bg-accent/10 dark:bg-accent-light/10 text-accent dark:text-accent-light"
            class="flex items-center px-4 py-3 text-text-primary dark:text-text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors mb-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
            </svg>
            {{ t('admin.files') }}
          </router-link>
          
          <router-link 
            to="/" 
            class="flex items-center px-4 py-3 text-text-primary dark:text-text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors mb-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {{ t('admin.viewSite') }}
          </router-link>
          
          <button 
            @click="logout" 
            class="w-full flex items-center px-4 py-3 text-text-primary dark:text-text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {{ t('admin.logout') }}
          </button>
        </nav>
      </div>
      
      <div class="flex-1 overflow-auto bg-primary dark:bg-primary-dark p-6">
        <router-view v-slot="{ Component }">
          <transition
            name="fade"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

async function logout() {
  try {
    authStore.logout()
    notificationStore.addNotification({
      type: 'success',
      message: t('auth.logoutSuccess'),
      duration: 3000
    })
    router.push('/auth')
  } catch (error) {
    console.error('Logout error:', error)
    notificationStore.addNotification({
      type: 'error',
      message: t('auth.logoutError'),
      duration: 3000
    })
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
