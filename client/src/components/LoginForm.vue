<template>
  <div class="login-form bg-secondary dark:bg-secondary-light p-6 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-6 text-text-primary dark:text-text-primary-light">{{ t('auth.login') }}</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label class="block text-text-primary dark:text-text-primary-light mb-2" for="email">
          {{ t('auth.email') }}
        </label>
        <input 
          v-model="form.email"
          type="email" 
          id="email"
          class="w-full px-3 py-2 border rounded-lg bg-primary dark:bg-primary-light text-text-primary dark:text-text-primary-light"
          :placeholder="t('auth.emailPlaceholder')"
          required
        >
      </div>
      
      <div class="mb-6">
        <label class="block text-text-primary dark:text-text-primary-light mb-2" for="password">
          {{ t('auth.password') }}
        </label>
        <input 
          v-model="form.password"
          type="password" 
          id="password"
          class="w-full px-3 py-2 border rounded-lg bg-primary dark:bg-primary-light text-text-primary dark:text-text-primary-light"
          :placeholder="t('auth.passwordPlaceholder')"
          required
        >
      </div>
      
      <div v-if="authStore.error" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
        {{ authStore.error }}
      </div>
      
      <button 
        type="submit"
        class="w-full bg-accent hover:bg-accent-light text-white font-bold py-2 px-4 rounded-lg transition-colors"
        :disabled="authStore.isLoading"
      >
        <span v-if="authStore.isLoading">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ t('auth.loggingIn') }}
        </span>
        <span v-else>{{ t('auth.login') }}</span>
      </button>
      
      <div class="mt-4 text-center">
        <p class="text-text-secondary dark:text-text-secondary-light">
          {{ t('auth.noAccount') }} 
          <a @click="$emit('switch-mode')" class="text-accent hover:text-accent-light cursor-pointer">
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
    router.push('/admin')
  }
}
</script>
