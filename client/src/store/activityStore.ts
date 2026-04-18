import { defineStore } from 'pinia'
import { ref } from 'vue'
import i18n from '@/i18n'
import api from '@/services/api'
import type { Activity, ActivityResponse } from '@/types/activity'

export interface ActivityPaginationParams {
  page?: number
  limit?: number
}

export interface ActivityPaginatedResponse {
  activities: Activity[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

const t = i18n.global.t

export const useActivityStore = defineStore('activity', () => {
  const activities = ref<Activity[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchActivities(params: ActivityPaginationParams = {}): Promise<ActivityPaginatedResponse> {
    loading.value = true
    error.value = null

    try {
      const response = await api.get<ActivityResponse>('/activities', { params })
      activities.value = response.data.activities

      const safeLimit = Math.max(1, params.limit || 10)
      return {
        activities: response.data.activities,
        pagination: response.data.pagination || {
          total: response.data.activities.length,
          page: params.page || 1,
          limit: safeLimit,
          pages: Math.ceil(response.data.activities.length / safeLimit)
        }
      }
    } catch (err) {
      console.error('Error fetching activities:', err)
      error.value = t('activity.errorLoading')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createActivity(activity: Omit<Activity, 'id' | 'date'>) {
    try {
      const response = await api.post<Activity>('/activities', activity)
      return response.data
    } catch (err) {
      console.error('Error creating activity:', err)
      error.value = t('activity.errorLoading')
      throw err
    }
  }

  return {
    activities,
    loading,
    error,
    fetchActivities,
    createActivity
  }
})
