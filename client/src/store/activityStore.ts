import { defineStore } from 'pinia'
import api from '@/services/api'
import type { Activity, ActivityResponse } from '@/types/activity'
import { useAuthStore } from '@/store/authStore'

interface ActivityState {
  activities: Activity[]
  loading: boolean
  error: string | null
}

export const useActivityStore = defineStore('activity', {
  state: (): ActivityState => ({
    activities: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchActivities({ page = 1, limit = 10 } = {}) {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        throw new Error('Authentication required')
      }

      try {
        this.loading = true
        this.error = null
        const response = await api.get<ActivityResponse>('/activities', {
          params: { page, limit },
          headers: {
            'x-auth-token': authStore.token
          }
        })
        return response.data
      } catch (error) {
        this.error = '無法加載活動記錄'
        throw error
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