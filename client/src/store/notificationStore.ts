import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string | null
  duration?: number
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  const timerIds = new Map<string, ReturnType<typeof setTimeout>>()

  function addNotification(notification: Omit<Notification, 'id'>) {
    const id = Date.now().toString()
    const newNotification = { ...notification, id }
    
    notifications.value.push(newNotification)
    
    if (notification.duration) {
      // 保留計時器參照可在手動關閉時同步清除，避免延遲回呼誤刪其他通知
      const timerId = setTimeout(() => {
        removeNotification(id)
      }, notification.duration)
      timerIds.set(id, timerId)
    }
    
    return id
  }

  function removeNotification(id: string) {
    const timerId = timerIds.get(id)
    if (timerId !== undefined) {
      clearTimeout(timerId)
      timerIds.delete(id)
    }
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  function clearNotifications() {
    timerIds.forEach((timerId) => clearTimeout(timerId))
    timerIds.clear()
    notifications.value = []
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications
  }
})
