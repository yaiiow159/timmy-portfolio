<template>
  <div class="recent-activity bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
      {{ t('activity.recentActivity') }}
    </h2>
    
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
    
    <div v-else-if="error" class="text-red-500 text-center py-4">
      {{ t('activity.errorLoading') }}
    </div>
    
    <div v-else-if="activities.length === 0" class="text-center py-4 text-gray-600 dark:text-gray-400">
      {{ t('activity.noActivities') }}
    </div>
    
    <ul v-else class="space-y-4">
      <li v-for="activity in activities" :key="activity.id" 
          class="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <icon-component :type="getActivityIcon(activity.type)" />
            </div>
          </div>
          
          <div class="ml-4 flex-grow">
            <div class="flex items-center justify-between">
              <p class="font-medium text-gray-900 dark:text-white">
                {{ activity.title }}
              </p>
              <span class="text-sm text-gray-500">
                {{ formatDate(activity.date) }}
              </span>
            </div>
            
            <p v-if="activity.description" class="mt-1 text-gray-600 dark:text-gray-400">
              {{ activity.description }}
            </p>
            
            <router-link 
              v-if="activity.targetId && activity.targetType"
              :to="getActivityLink(activity)"
              class="mt-2 inline-flex items-center text-sm text-primary hover:text-primary-dark"
            >
              {{ t('activity.viewDetails') }}
              <icon-component name="arrow-right" class="ml-1 w-4 h-4" />
            </router-link>
          </div>
        </div>
      </li>
    </ul>
    
    <div v-if="activities.length > 0" class="mt-6 flex justify-center">
      <button 
        v-if="hasMore"
        @click="loadMore"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        :disabled="loadingMore"
      >
        {{ loadingMore ? t('activity.loading') : t('activity.loadMore') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useActivityStore } from '../../store/activityStore'
import type { Activity } from '../../types/activity'
import IconComponent from '../common/IconComponent.vue'
import { formatDate } from '@/utils/dateUtils'

const { t } = useI18n()
const activityStore = useActivityStore()

const activities = ref<Activity[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const error = ref(false)
const page = ref(1)
const limit = 5
const hasMore = ref(false)

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'post_create':
      return 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
    case 'post_update':
      return 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
    case 'post_comment':
      return 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
    case 'project_create':
      return 'M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z'
    case 'project_update':
      return 'M9 13h6m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    case 'user_register':
      return 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
    case 'user_login':
      return 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
    default:
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
}

const getActivityLink = (activity: Activity) => {
  switch (activity.targetType) {
    case 'post':
      return `/blog/${activity.targetId}`
    case 'project':
      return `/projects/${activity.targetId}`
    default:
      return '#'
  }
}

const loadActivities = async (isLoadMore = false) => {
  try {
    if (isLoadMore) {
      loadingMore.value = true
    } else {
      loading.value = true
    }
    
    const response = await activityStore.fetchActivities({
      page: page.value,
      limit
    })
    
    if (isLoadMore) {
      activities.value.push(...response.activities)
    } else {
      activities.value = response.activities
    }
    
    hasMore.value = page.value * limit < response.pagination.total
  } catch (err) {
    console.error('Error loading activities:', err)
    error.value = true
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const loadMore = async () => {
  page.value++
  await loadActivities(true)
}

onMounted(() => {
  loadActivities()
})
</script>