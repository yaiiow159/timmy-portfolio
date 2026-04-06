<template>
  <div class="admin-dashboard min-h-screen bg-gradient-to-b from-primary to-secondary tech-grid-bg">
    <div class="container mx-auto px-4 py-8">

      <!-- Header -->
      <div class="dashboard-header tech-card p-8 mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="tech-title text-4xl font-bold mb-4">
              {{ t('admin.dashboardTitle') }}
            </h1>
            <p class="text-text-secondary text-lg">
              {{ t('admin.welcomeBack') }}
            </p>
          </div>
          <div class="hidden md:block">
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-accent/20 to-accent-light/20 flex items-center justify-center tech-glow">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div class="stat-card tech-card p-8 transition-all duration-300 hover:-translate-y-2 tech-glow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-secondary text-sm font-semibold uppercase tracking-wider mb-3">
                {{ t('admin.totalPosts') }}
              </p>
              <h2 class="text-5xl font-bold text-text-primary mb-2">
                {{ stats.posts }}
              </h2>
              <p class="text-sm text-text-secondary">
                +12% 較上月
              </p>
            </div>
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center tech-glow">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="stat-card tech-card p-8 transition-all duration-300 hover:-translate-y-2 tech-glow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-secondary text-sm font-semibold uppercase tracking-wider mb-3">
                {{ t('admin.totalProjects') }}
              </p>
              <h2 class="text-5xl font-bold text-text-primary mb-2">
                {{ stats.projects }}
              </h2>
              <p class="text-sm text-text-secondary">
                +8% 較上月
              </p>
            </div>
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center tech-glow">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="stat-card tech-card p-8 transition-all duration-300 hover:-translate-y-2 tech-glow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-secondary text-sm font-semibold uppercase tracking-wider mb-3">
                {{ t('admin.totalComments') }}
              </p>
              <h2 class="text-5xl font-bold text-text-primary mb-2">
                {{ stats.comments }}
              </h2>
              <p class="text-sm text-text-secondary">
                +25% 較上月
              </p>
            </div>
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center tech-glow">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="tech-card p-8 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="tech-title text-2xl font-bold">
            {{ t('admin.recentActivity') }}
          </h2>
          <span class="text-sm text-accent font-medium px-3 py-1 rounded-full bg-accent/10">最近 7 天</span>
        </div>

        <div v-if="recentActivity.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-text-secondary mb-4 tech-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-text-secondary">
            {{ t('admin.noRecentActivity') }}
          </p>
        </div>

        <div v-else class="space-y-4">
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="tech-card p-8">
        <h2 class="tech-title text-2xl font-bold mb-6">
          {{ t('admin.quickActions') }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <router-link
            to="/admin/posts/new"
            class="quick-action-card group flex flex-col items-center justify-center px-6 py-8 bg-gradient-to-br from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-blue-500/20"
          >
            <div class="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span class="text-text-primary dark:text-text-primary-dark font-semibold text-center">
              {{ t('admin.newPost') }}
            </span>
          </router-link>

          <router-link
            to="/admin/projects"
            class="quick-action-card group flex flex-col items-center justify-center px-6 py-8 bg-gradient-to-br from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-purple-500/20"
          >
            <div class="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <span class="text-text-primary dark:text-text-primary-dark font-semibold text-center">
              {{ t('admin.manageProjects') }}
            </span>
          </router-link>

          <router-link
            to="/admin/posts"
            class="quick-action-card group flex flex-col items-center justify-center px-6 py-8 bg-gradient-to-br from-green-500/10 to-green-600/10 hover:from-green-500/20 hover:to-green-600/20 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-green-500/20"
          >
            <div class="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span class="text-text-primary dark:text-text-primary-dark font-semibold text-center">
              {{ t('admin.managePosts') }}
            </span>
          </router-link>

          <router-link
            to="/admin/files"
            class="quick-action-card group flex flex-col items-center justify-center px-6 py-8 bg-gradient-to-br from-orange-500/10 to-orange-600/10 hover:from-orange-500/20 hover:to-orange-600/20 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-orange-500/20"
          >
            <div class="w-14 h-14 rounded-full bg-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="text-text-primary dark:text-text-primary-dark font-semibold text-center">
              {{ t('admin.fileManagement') }}
            </span>
          </router-link>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useActivityStore } from '@/store/activityStore'
import { useAuthStore } from '@/store/authStore'
import type { Activity } from '@/types/activity'
import api from '@/services/api'
import { handleError, ErrorContext } from '@/utils/errorHandler'

const { t } = useI18n()
const activityStore = useActivityStore()
const authStore = useAuthStore()

const stats = ref({
  posts: 0,
  projects: 0,
  comments: 0
})

const recentActivity = ref<Activity[]>([])

onMounted(async () => {
  try {
    const response = await api.get('/admin/stats', {
      headers: {
        'x-auth-token': authStore.token
      }
    })
    stats.value = {
      posts: response.data.postsCount,
      projects: response.data.projectsCount,
      comments: response.data.commentsCount
    }

    try {
      await activityStore.fetchActivities()
      recentActivity.value = activityStore.activities.slice(0, 5)
    } catch (activityError) {
      console.error('Error fetching activities:', activityError)
      handleError(activityError, {
        context: ErrorContext.ADMIN,
        showNotification: true,
        customMessage: t('errors.activities.fetch') || '無法獲取最近活動'
      })
    }
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error)
    handleError(error, {
      context: ErrorContext.ADMIN,
      showNotification: true,
      customMessage: t('errors.general.message') || '發生錯誤，請稍後再試'
    })
  }
})
</script>
