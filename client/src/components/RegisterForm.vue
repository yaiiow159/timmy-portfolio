<template>
  <div class="register-form tech-card p-8 relative overflow-hidden">
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
    <h2 class="tech-title text-3xl font-bold mb-8 text-center">{{ t('auth.register') }}</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="mb-6">
        <label class="block text-text-secondary mb-2 font-semibold text-sm uppercase tracking-wide" for="name">
          {{ t('auth.name') }}
        </label>
        <input 
          v-model="form.name"
          type="text" 
          id="name"
          class="tech-input w-full"
          :placeholder="t('auth.namePlaceholder')"
          required
        >
      </div>
      
      <div class="mb-6">
        <label class="block text-text-secondary mb-2 font-semibold text-sm uppercase tracking-wide" for="email">
          {{ t('auth.email') }}
        </label>
        <input 
          v-model="form.email"
          type="email" 
          id="email"
          class="tech-input w-full"
          :placeholder="t('auth.emailPlaceholder')"
          required
        >
      </div>
      
      <div class="mb-6">
        <label class="block text-text-secondary mb-2 font-semibold text-sm uppercase tracking-wide" for="password">
          {{ t('auth.password') }}
        </label>
        <input 
          v-model="form.password"
          type="password" 
          id="password"
          class="tech-input w-full"
          :placeholder="t('auth.passwordPlaceholder')"
          required
          minlength="6"
        >
      </div>
      
      <div class="mb-6">
        <label class="block text-text-secondary mb-2 font-semibold text-sm uppercase tracking-wide" for="confirm-password">
          {{ t('auth.confirmPassword') }}
        </label>
        <input 
          v-model="form.confirmPassword"
          type="password" 
          id="confirm-password"
          class="tech-input w-full"
          :placeholder="t('auth.confirmPasswordPlaceholder')"
          required
        >
        <p v-if="passwordMismatch" class="text-red-500 text-sm mt-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ t('auth.passwordMismatch') }}
        </p>
      </div>
      
      <div v-if="authStore.error" class="mb-6 p-4 bg-red-900/20 border-2 border-red-500 text-red-500 rounded-xl font-medium flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ authStore.error }}
      </div>
      
      <button 
        type="submit"
        class="tech-button w-full py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 tech-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        :disabled="authStore.isLoading || passwordMismatch ? true : false"
      >
        <span v-if="authStore.isLoading">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ t('auth.registering') }}
        </span>
        <span v-else>{{ t('auth.register') }}</span>
      </button>
      
      <div class="mt-8 text-center">
        <p class="text-text-secondary text-lg">
          {{ t('auth.haveAccount') }} 
          <a @click="$emit('switch-mode')" class="text-accent hover:text-tech-purple cursor-pointer font-semibold transition-colors duration-300 underline-offset-4 hover:underline">
            {{ t('auth.login') }}
          </a>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useAuthStore } from '../store/authStore'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

const emit = defineEmits(['register-success', 'switch-mode'])

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const passwordMismatch = computed(() => {
  return form.password && form.confirmPassword && form.password !== form.confirmPassword
})

async function handleSubmit() {
  if (passwordMismatch.value) {
    return
  }
  
  const success = await authStore.register({
    name: form.name,
    email: form.email,
    password: form.password
  })
  
  if (success) {
    emit('register-success')
    router.push('/admin')
  }
}
</script>
