<template>
  <div class="auth-page min-h-screen bg-primary dark:bg-primary-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-text-primary dark:text-text-primary-light">
          {{ t('auth.welcomeBack') }}
        </h1>
        <p class="mt-2 text-text-secondary dark:text-text-secondary-light">
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
  
  // Redirect to admin dashboard or home page
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
</style>
