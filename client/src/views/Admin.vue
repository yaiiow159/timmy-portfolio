<template>
  <div class="min-h-screen bg-slate-50">
    <!-- 頂部導航欄 -->
    <nav class="bg-white shadow-sm border-b border-slate-200">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-slate-800">
              {{ t('admin.dashboard') }}
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <button
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-slate-500 hover:text-slate-700"
              @click="logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {{ t('admin.logout') }}
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="flex h-[calc(100vh-4rem)]">
      <!-- 側邊欄 -->
      <div class="w-64 bg-white border-r border-slate-200">
        <nav class="mt-5 px-2">
          <router-link
            :to="{ name: 'AdminDashboard' }"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1"
            :class="[$route.name === 'AdminDashboard' ? 'bg-blue-500 text-white' : 'text-slate-700 hover:bg-slate-100']"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {{ t('admin.dashboard') }}
          </router-link>

          <router-link
            :to="{ name: 'AdminPosts' }"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1"
            :class="[$route.name === 'AdminPosts' || $route.name === 'AdminNewPost' || $route.name === 'AdminEditPost' ? 'bg-blue-500 text-white' : 'text-slate-700 hover:bg-slate-100']"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.586-1.414l-4.5-4.5A2 2 0 0015.5 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2z" />
            </svg>
            {{ t('admin.posts') }}
          </router-link>

          <router-link
            :to="{ name: 'AdminProjects' }"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1"
            :class="[$route.name === 'AdminProjects' ? 'bg-blue-500 text-white' : 'text-slate-700 hover:bg-slate-100']"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ t('admin.projects') }}
          </router-link>

          <a
            href="/"
            target="_blank"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {{ t('admin.viewSite') }}
          </a>
        </nav>
      </div>

      <!-- 主要內容區 -->
      <div class="flex-1 overflow-auto bg-slate-50 p-6">
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
    await authStore.logout()
    notificationStore.addNotification({
      type: 'success',
      message: t('auth.logoutSuccess'),
      duration: 3000
    })
    router.push('/login')
  } catch (error) {
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
