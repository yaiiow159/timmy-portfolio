<script setup lang="ts">
import MainLayout from './components/layout/MainLayout.vue'
import NotificationSystem from './components/NotificationSystem.vue'
import { useAuthStore } from './store/authStore'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(async () => {
  // 重新整理後先還原登入身份，可避免首屏短暫誤判為未登入造成閃爍
  if (authStore.token) {
    try {
      await authStore.loadUser()
    } catch {
      // 身分失效已在狀態層統一處理，這裡僅避免重複拋錯干擾首屏渲染
    }
  }
})
</script>

<template>
  <MainLayout />
  <NotificationSystem />
</template>

<style>
</style>
