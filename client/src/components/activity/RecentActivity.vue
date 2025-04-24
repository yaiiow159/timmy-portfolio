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
import IconComponent from '../common/IconComponent.vue'
import { formatDate } from '@/utils/dateUtils'
import { useActivityStore } from '@/store/activityStore'
import type { Activity } from '@/types/activity'

const { t } = useI18n()
const activityStore = useActivityStore()

const activities = ref<Activity[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const error = ref(false)
const page = ref(1)
const hasMore = ref(true)
const limit = 10

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'POST_CREATED':
      return 'document'
    case 'PROJECT_ADDED':
      return 'code'
    case 'COMMENT_ADDED':
      return 'chat'
    default:
      return 'bell'
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