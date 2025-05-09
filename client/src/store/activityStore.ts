import { defineStore } from 'pinia'
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

export const useActivityStore = defineStore('activity', {
  state: () => ({
    activities: [] as Activity[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchActivities(params: ActivityPaginationParams = {}): Promise<ActivityPaginatedResponse> {
      this.loading = true
      this.error = null
      try {
        const response = await api.get<ActivityResponse>('/activities', {
          params
        })
        
        this.activities = response.data.activities
        
        return {
          activities: response.data.activities,
          pagination: response.data.pagination || {
            total: response.data.activities.length,
            page: params.page || 1,
            limit: params.limit || 10,
            pages: Math.ceil(response.data.activities.length / (params.limit || 10))
          }
        }
      } catch (error) {
        console.error('Error fetching activities:', error)
        this.error = 'Failed to fetch activities'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createActivity(activity: Omit<Activity, 'id' | 'date'>) {
      try {
        const response = await api.post<Activity>('/activities', activity)
        return response.data
      } catch (error) {
        this.error = '無法創建活動記錄'
        throw error
      }
    }
  }
})