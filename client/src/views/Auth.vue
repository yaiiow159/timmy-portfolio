<template>
  <div class="auth-page min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2 gradient-text">
          {{ t('auth.welcomeBack') }}
        </h1>
        <p class="mt-2 text-text-secondary dark:text-text-secondary-light text-lg">
          {{ t('auth.accountAccess') }}
        </p>
      </div>
      
      <transition name="fade" mode="out-in">
        <login-form 
          v-if="mode === 'login'" 
          @login-success="handleAuthSuccess" 
          @switch-mode="mode = 'register'"
        />
        <register-form 
          v-else 
          @register-success="handleAuthSuccess" 
          @switch-mode="mode = 'login'"
        />
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import RegisterForm from '../components/RegisterForm.vue'
import { useNotificationStore } from '../store/notificationStore'

const { t } = useI18n()
const router = useRouter()
const notificationStore = useNotificationStore()
const mode = ref<'login' | 'register'>('login')

function handleAuthSuccess() {
  notificationStore.addNotification({
    type: 'success',
    message: t('auth.successMessage'),
    duration: 5000
  })
  
  router.push('/')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.gradient-text {
  @apply bg-clip-text text-transparent bg-gradient-to-r;
  @apply dark:from-blue-400 dark:to-purple-400;
  @apply from-blue-600 to-purple-600;
}
</style>
