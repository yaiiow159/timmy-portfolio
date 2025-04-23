<template>
  <div class="admin-layout min-h-screen bg-primary dark:bg-primary-light">
    <header class="bg-secondary dark:bg-secondary-light shadow-md">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center">
          <h1 class="text-xl font-bold text-text-primary dark:text-text-primary-light">
            {{ t('admin.dashboard') }}
          </h1>
        </div>
        
        <div class="flex items-center space-x-4">
          <span class="text-text-primary dark:text-text-primary-light">
            {{ authStore.user?.name }}
          </span>
          <button 
            @click="logout" 
            class="text-text-secondary dark:text-text-secondary-light hover:text-accent dark:hover:text-accent-light"
          >
            {{ t('admin.logout') }}
          </button>
        </div>
      </div>
    </header>
    
    <div class="container mx-auto px-4 py-6 flex flex-col md:flex-row">
      <aside class="w-full md:w-64 mb-6 md:mb-0 md:mr-6">
        <div class="bg-secondary dark:bg-secondary-light rounded-lg shadow-md p-4">
          <nav>
            <ul class="space-y-2">
              <li>
                <router-link 
                  :to="{ name: 'AdminDashboard' }" 
                  class="block px-4 py-2 rounded-md transition-colors"
                  :class="[$route.name === 'AdminDashboard' ? 'bg-accent text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700']"
                >
                  {{ t('admin.dashboard') }}
                </router-link>
              </li>
              <li>
                <router-link 
                  :to="{ name: 'AdminPosts' }" 
                  class="block px-4 py-2 rounded-md transition-colors"
                  :class="[$route.name === 'AdminPosts' || $route.name === 'AdminNewPost' || $route.name === 'AdminEditPost' ? 'bg-accent text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700']"
                >
                  {{ t('admin.posts') }}
                </router-link>
              </li>
              <li>
                <router-link 
                  :to="{ name: 'AdminProjects' }" 
                  class="block px-4 py-2 rounded-md transition-colors"
                  :class="[$route.name === 'AdminProjects' ? 'bg-accent text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700']"
                >
                  {{ t('admin.projects') }}
                </router-link>
              </li>
              <li>
                <router-link 
                  :to="{ name: 'Home' }" 
                  class="block px-4 py-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {{ t('admin.viewSite') }}
                </router-link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      
      <!-- Main Content -->
      <main class="flex-1 bg-secondary dark:bg-secondary-light rounded-lg shadow-md p-6">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
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

function logout() {
  authStore.logout()
  notificationStore.addNotification({
    type: 'info',
    message: t('auth.logoutSuccess'),
    duration: 3000
  })
  router.push('/')
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
