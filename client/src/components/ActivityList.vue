<template>
  <div class="activity-list">
    <div v-if="loading" class="loading">載入中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="activities.length === 0" class="empty">暫無活動記錄</div>
    <div v-else class="activities">
      <div v-for="activity in activities" :key="activity.id" class="activity-item">
        <div class="activity-time">{{ formatTime(activity.date) }}</div>
        <div class="activity-title">{{ activity.title }}</div>
        <div v-if="activity.description" class="activity-description">{{ activity.description }}</div>
        <div class="activity-user">由 {{ activity.userName }} 操作</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useActivityStore } from '@/store/activityStore'
import { storeToRefs } from 'pinia'

const activityStore = useActivityStore()
const { activities, loading, error } = storeToRefs(activityStore)

onMounted(() => {
  activityStore.fetchActivities()
})

const formatTime = (time: string) => {
  return new Date(time).toLocaleString()
}
</script>

<style scoped>
.activity-list {
  padding: 20px;
}

.loading, .error, .empty {
  text-align: center;
  padding: 20px;
  color: #666;
}

.activities {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.activity-time {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.activity-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.activity-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.activity-user {
  font-size: 14px;
  color: #999;
}
</style> 