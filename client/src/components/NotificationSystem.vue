<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col space-y-3 max-w-md">
    <transition-group name="notification">
      <div 
        v-for="notification in notificationStore.notifications" 
        :key="notification.id"
        :class="[
          'tech-notification p-4 rounded-xl shadow-xl flex items-start backdrop-blur-xl border',
          `tech-notification-${notification.type}`
        ]"
      >
        <div class="flex-shrink-0 mr-3">
          <div :class="[
            'w-8 h-8 rounded-lg flex items-center justify-center',
            `tech-notification-icon-${notification.type}`
          ]">
            <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else-if="notification.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <svg v-else-if="notification.type === 'info'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        
        <div class="flex-grow">
          <p class="text-sm font-medium">{{ notification.message }}</p>
        </div>
        
        <button 
          @click="notificationStore.removeNotification(notification.id)"
          class="ml-3 flex-shrink-0 text-text-secondary hover:text-text-primary focus:outline-none transition-colors duration-200 p-1 rounded-lg hover:bg-secondary/50"
          :aria-label="$t('common.close')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '../store/notificationStore'

const notificationStore = useNotificationStore()
</script>

<style scoped>
.tech-notification {
  min-width: 280px;
  max-width: 90vw;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.tech-notification-success {
  --notification-color: var(--tech-green);
  background: rgba(var(--tech-green-rgb), 0.1);
  border-color: rgba(var(--tech-green-rgb), 0.3);
  color: var(--notification-color);
}

.tech-notification-error {
  --notification-color: var(--tech-red);
  background: rgba(var(--tech-red-rgb), 0.1);
  border-color: rgba(var(--tech-red-rgb), 0.3);
  color: var(--notification-color);
}

.tech-notification-info {
  --notification-color: var(--accent);
  background: rgba(var(--accent-rgb), 0.1);
  border-color: rgba(var(--accent-rgb), 0.3);
  color: var(--notification-color);
}

.tech-notification-warning {
  --notification-color: var(--tech-orange);
  background: rgba(var(--tech-orange-rgb), 0.1);
  border-color: rgba(var(--tech-orange-rgb), 0.3);
  color: var(--notification-color);
}

.tech-notification-icon-success,
.tech-notification-icon-error,
.tech-notification-icon-info,
.tech-notification-icon-warning {
  background: rgba(var(--notification-color-rgb, var(--accent-rgb)), 0.2);
  color: var(--notification-color, var(--accent));
}

/* Transition animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
