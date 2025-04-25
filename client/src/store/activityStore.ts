import { defineStore } from 'pinia'
import api from '@/services/api'
import type { Activity, ActivityResponse } from '@/types/activity'

export const useActivityStore = defineStore('activity', {
  state: () => ({
    activities: [] as Activity[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchActivities() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get<ActivityResponse>('/activities')
        this.activities = response.data.activities
      } catch (error) {
        console.error('Error fetching activities:', error)
        this.error = 'Failed to fetch activities'
      } finally {
        this.loading = false
      }
    },

    async createActivity(activity: Omit<Activity, 'id' | 'date'>) {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        throw new Error('Authentication required')
      }

      try {
        const response = await api.post<Activity>('/activities', activity, {
          headers: {
            'x-auth-token': authStore.token
          }
        })
        return response.data
      } catch (error) {
        this.error = '無法創建活動記錄'
        throw error
      }
    }
  }
}) 