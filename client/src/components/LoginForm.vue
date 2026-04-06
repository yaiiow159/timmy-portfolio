<template>
  <div class="login-form tech-card p-10 relative overflow-hidden">
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
    <h2 class="tech-title text-4xl font-bold mb-10 text-center">{{ t('auth.login') }}</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <div>
        <label class="block text-text-secondary mb-3 font-semibold text-sm uppercase tracking-wide" for="email">
          {{ t('auth.email') }}
        </label>
        <input 
          v-model="form.email"
          type="email" 
          id="email"
          class="tech-input w-full text-lg"
          :placeholder="t('auth.emailPlaceholder')"
          required
        >
      </div>
      
      <div>
        <label class="block text-text-secondary mb-3 font-semibold text-sm uppercase tracking-wide" for="password">
          {{ t('auth.password') }}
        </label>
        <input 
          v-model="form.password"
          type="password" 
          id="password"
          class="tech-input w-full text-lg"
          :placeholder="t('auth.passwordPlaceholder')"
          required
        >
      </div>
      
<<<<<<< Updated upstream
      <div v-if="loginErrorMessage" class="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-center">
        {{ loginErrorMessage }}
=======
      <div v-if="authStore.error" class="p-4 bg-red-900/20 border-2 border-red-500 text-red-500 rounded-xl font-medium flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ authStore.error }}
>>>>>>> Stashed changes
      </div>
      
      <button 
        type="submit"
        class="tech-button w-full py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 tech-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
      
      <div class="mt-8 text-center">
        <p class="text-text-secondary text-lg">
          {{ t('auth.noAccount') }} 
          <a @click="$emit('switch-mode')" 
             class="text-accent hover:text-tech-purple cursor-pointer font-semibold transition-colors duration-300 underline-offset-4 hover:underline">
            {{ t('auth.register') }}
          </a>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useAuthStore } from '../store/authStore'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const authStore = useAuthStore()

const loginErrorMessage = computed(() => authStore.error ? t('errors.auth.loginFailed') : null)

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
</style>
