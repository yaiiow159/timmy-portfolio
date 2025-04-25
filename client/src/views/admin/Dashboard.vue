<template>
  <div class="admin-dashboard min-h-screen bg-primary dark:bg-primary-dark p-6 space-y-6">
    <div class="bg-secondary dark:bg-secondary-dark p-6 rounded-lg shadow-sm">
      <h1 class="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
        {{ t('admin.dashboardTitle') }}
      </h1>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-secondary dark:bg-secondary-dark rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-text-secondary dark:text-text-secondary-dark text-sm font-medium">
              {{ t('admin.totalPosts') }}
            </p>
            <h2 class="text-3xl font-bold text-text-primary dark:text-text-primary-dark mt-2">
              {{ stats.posts }}
            </h2>
          </div>
          <div class="bg-accent/10 dark:bg-accent-light/10 p-4 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent dark:text-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-secondary dark:bg-secondary-dark rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-text-secondary dark:text-text-secondary-dark text-sm font-medium">
              {{ t('admin.totalProjects') }}
            </p>
            <h2 class="text-3xl font-bold text-text-primary dark:text-text-primary-dark mt-2">
              {{ stats.projects }}
            </h2>
          </div>
          <div class="bg-accent/10 dark:bg-accent-light/10 p-4 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent dark:text-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-secondary dark:bg-secondary-dark rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-text-secondary dark:text-text-secondary-dark text-sm font-medium">
              {{ t('admin.totalComments') }}
            </p>
            <h2 class="text-3xl font-bold text-text-primary dark:text-text-primary-dark mt-2">
              {{ stats.comments }}
            </h2>
          </div>
          <div class="bg-accent/10 dark:bg-accent-light/10 p-4 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent dark:text-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-secondary dark:bg-secondary-dark rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-6">
        {{ t('admin.recentActivity') }}
      </h2>
      
      <div v-if="recentActivity.length === 0" class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-text-secondary dark:text-text-secondary-dark mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-text-secondary dark:text-text-secondary-dark">
          {{ t('admin.noRecentActivity') }}
        </p>
      </div>
      
      <div v-else class="space-y-4">
      </div>
    </div>
    
    <div class="bg-secondary dark:bg-secondary-dark rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-6">
        {{ t('admin.quickActions') }}
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <router-link 
          to="/admin/posts/new" 
          class="flex items-center justify-center px-6 py-4 bg-primary dark:bg-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-accent dark:text-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="text-text-primary dark:text-text-primary-dark font-medium">
            {{ t('admin.newPost') }}
          </span>
        </router-link>
        
        <router-link 
          to="/admin/projects" 
          class="flex items-center justify-center px-6 py-4 bg-primary dark:bg-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-accent dark:text-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span class="text-text-primary dark:text-text-primary-dark font-medium">
            {{ t('admin.manageProjects') }}
          </span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useActivityStore } from '@/store/activityStore'
import { useNotificationStore } from '@/store/notificationStore'
import { useAuthStore } from '@/store/authStore'
import type { Activity } from '@/types/activity'
import api from '@/services/api'

const { t } = useI18n()
const activityStore = useActivityStore()
const notificationStore = useNotificationStore()
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
    
    await activityStore.fetchActivities()
    recentActivity.value = activityStore.activities.slice(0, 5)
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error)
    notificationStore.addNotification({
      type: 'error',
      message: t('errors.general.message'),
      duration: 5000
    })
  }
})
</script>
