<script setup lang="ts">
import MainLayout from './components/layout/MainLayout.vue'
import NotificationSystem from './components/NotificationSystem.vue'
import { useAuthStore } from './store/authStore'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(() => {
  if (authStore.token) {
    authStore.loadUser()
  }
})
</script>

<template>
  <MainLayout />
  <NotificationSystem />
</template>

<style>
</style>
