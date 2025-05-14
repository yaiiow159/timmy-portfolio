<template>
  <div class="login-form bg-white dark:bg-dark-200 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-dark-300">
    <h2 class="text-2xl font-bold mb-8 text-center gradient-text">{{ t('auth.login') }}</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2 text-lg font-medium" for="email">
          {{ t('auth.email') }}
        </label>
        <input 
          v-model="form.email"
          type="email" 
          id="email"
          class="w-full px-4 py-3 border border-gray-300 dark:border-dark-400 rounded-lg 
                 bg-gray-50 dark:bg-dark-300 
                 text-gray-900 dark:text-gray-100 
                 text-lg focus:ring-2 focus:ring-accent/50 focus:border-accent 
                 dark:focus:ring-accent-light/50 dark:focus:border-accent-light
                 transition-colors"
          :placeholder="t('auth.emailPlaceholder')"
          required
        >
      </div>
      
      <div class="mb-8">
        <label class="block text-gray-700 dark:text-gray-300 mb-2 text-lg font-medium" for="password">
          {{ t('auth.password') }}
        </label>
        <input 
          v-model="form.password"
          type="password" 
          id="password"
          class="w-full px-4 py-3 border border-gray-300 dark:border-dark-400 rounded-lg 
                 bg-gray-50 dark:bg-dark-300 
                 text-gray-900 dark:text-gray-100 
                 text-lg focus:ring-2 focus:ring-accent/50 focus:border-accent 
                 dark:focus:ring-accent-light/50 dark:focus:border-accent-light
                 transition-colors"
          :placeholder="t('auth.passwordPlaceholder')"
          required
        >
      </div>
      
      <div v-if="authStore.error" class="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-center">
        {{ authStore.error }}
      </div>
      
      <button 
        type="submit"
        class="w-full bg-accent dark:bg-accent-light hover:bg-accent-light dark:hover:bg-accent 
               text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] 
               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent dark:focus:ring-accent-light
               disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        :disabled="authStore.isLoading"
      >
        <span v-if="authStore.isLoading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ t('auth.loggingIn') }}
        </span>
        <span v-else>{{ t('auth.login') }}</span>
      </button>
      
      <div class="mt-6 text-center">
        <p class="text-gray-600 dark:text-gray-400 text-lg">
          {{ t('auth.noAccount') }} 
          <a @click="$emit('switch-mode')" 
             class="text-accent dark:text-accent-light hover:text-accent-light dark:hover:text-accent 
                    cursor-pointer font-medium transition-colors">
            {{ t('auth.register') }}
          </a>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useAuthStore } from '../store/authStore'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

const emit = defineEmits(['login-success', 'switch-mode'])

const form = reactive({
  email: '',
  password: ''
})

async function handleSubmit() {
  const success = await authStore.login(form)
  
  if (success) {
    emit('login-success')
  }
}
</script>

<style scoped>
.gradient-text {
  @apply bg-clip-text text-transparent bg-gradient-to-r;
  @apply dark:from-blue-400 dark:to-purple-400;
  @apply from-blue-600 to-purple-600;
}
</style>
