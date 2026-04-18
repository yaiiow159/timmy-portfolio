<template>
  <div class="min-h-screen bg-gradient-to-br from-primary to-secondary tech-grid-bg">
    <div class="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50 z-50"></div>
    
    <div class="flex">
      <div class="w-72 min-h-screen bg-gradient-to-b from-secondary/95 to-primary/95 backdrop-blur-xl border-r border-accent/20 shadow-2xl relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none"></div>
        
        <div class="relative p-8 border-b border-accent/10">
          <div class="flex items-center mb-2">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-tech-purple flex items-center justify-center mr-4 shadow-lg shadow-accent/30 tech-glow">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 class="tech-title text-2xl font-bold">Admin</h1>
              <p class="text-xs text-text-secondary">Management System</p>
            </div>
          </div>
        </div>
        
        <nav class="relative mt-6 px-4 space-y-2">
          <router-link 
            to="/admin" 
            exact-active-class="admin-nav-active"
            class="admin-nav-item group"
          >
            <div class="admin-nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span>{{ t('admin.dashboard') }}</span>
            <div class="admin-nav-indicator"></div>
          </router-link>
          
          <router-link 
            to="/admin/posts" 
            active-class="admin-nav-active"
            class="admin-nav-item group"
          >
            <div class="admin-nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <span>{{ t('admin.posts') }}</span>
            <div class="admin-nav-indicator"></div>
          </router-link>
          
          <router-link 
            to="/admin/projects" 
            active-class="admin-nav-active"
            class="admin-nav-item group"
          >
            <div class="admin-nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <span>{{ t('admin.projects') }}</span>
            <div class="admin-nav-indicator"></div>
          </router-link>
          
          <router-link 
            to="/admin/files" 
            active-class="admin-nav-active"
            class="admin-nav-item group"
          >
            <div class="admin-nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span>{{ t('admin.files') }}</span>
            <div class="admin-nav-indicator"></div>
          </router-link>
          
          <div class="my-4 border-t border-accent/10"></div>
          
          <router-link 
            to="/" 
            class="admin-nav-item group"
          >
            <div class="admin-nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span>{{ t('admin.viewSite') }}</span>
            <div class="admin-nav-indicator"></div>
          </router-link>
          
          <button 
            @click="logout" 
            class="admin-nav-item group w-full"
          >
            <div class="admin-nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <span>{{ t('admin.logout') }}</span>
            <div class="admin-nav-indicator"></div>
          </button>
        </nav>
      </div>
      
      <div class="flex-1 overflow-auto p-8">
        <router-view v-slot="{ Component }">
          <transition
            name="page-fade"
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
.admin-nav-item {
  @apply flex items-center px-4 py-3.5 text-text-secondary rounded-xl transition-all duration-300 relative overflow-hidden;
  @apply hover:text-accent hover:translate-x-1;
}

.admin-nav-item:hover {
  background: linear-gradient(to right, rgba(var(--accent-rgb), 0.1), rgba(var(--tech-purple-rgb), 0.1));
  box-shadow: 0 10px 15px -3px rgba(var(--accent-rgb), 0.1);
}

.admin-nav-icon {
  @apply mr-3 p-2 rounded-lg transition-all duration-300;
  background: linear-gradient(to bottom right, rgba(var(--accent-rgb), 0.05), rgba(var(--tech-purple-rgb), 0.05));
}

.admin-nav-item:hover .admin-nav-icon {
  background: linear-gradient(to bottom right, rgba(var(--accent-rgb), 0.2), rgba(var(--tech-purple-rgb), 0.2));
  box-shadow: 0 10px 15px -3px rgba(var(--accent-rgb), 0.2);
}

.admin-nav-indicator {
  @apply absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-accent to-tech-purple rounded-r-full;
  @apply opacity-0 transform -translate-x-full transition-all duration-300;
}

.admin-nav-active {
  @apply text-accent border-l-2 border-accent;
  background: linear-gradient(to right, rgba(var(--accent-rgb), 0.15), rgba(var(--tech-purple-rgb), 0.15));
  box-shadow: 0 10px 15px -3px rgba(var(--accent-rgb), 0.2);
}

.admin-nav-active .admin-nav-indicator {
  @apply opacity-100 translate-x-0;
}

.admin-nav-active .admin-nav-icon {
  background: linear-gradient(to bottom right, rgba(var(--accent-rgb), 0.2), rgba(var(--tech-purple-rgb), 0.2));
  box-shadow: 0 10px 15px -3px rgba(var(--accent-rgb), 0.3);
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.3s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
