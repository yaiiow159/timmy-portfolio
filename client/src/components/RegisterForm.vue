<template>
  <div class="register-form bg-secondary dark:bg-secondary-light p-6 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-6 text-text-primary dark:text-text-primary-light">{{ t('auth.register') }}</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label class="block text-text-primary dark:text-text-primary-light mb-2" for="name">
          {{ t('auth.name') }}
        </label>
        <input 
          v-model="form.name"
          type="text" 
          id="name"
          class="w-full px-3 py-2 border rounded-lg bg-primary dark:bg-primary-light text-text-primary dark:text-text-primary-light"
          :placeholder="t('auth.namePlaceholder')"
          required
        >
      </div>
      
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
      
      <div class="mb-4">
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
          minlength="6"
        >
      </div>
      
      <div class="mb-6">
        <label class="block text-text-primary dark:text-text-primary-light mb-2" for="confirm-password">
          {{ t('auth.confirmPassword') }}
        </label>
        <input 
          v-model="form.confirmPassword"
          type="password" 
          id="confirm-password"
          class="w-full px-3 py-2 border rounded-lg bg-primary dark:bg-primary-light text-text-primary dark:text-text-primary-light"
          :placeholder="t('auth.confirmPasswordPlaceholder')"
          required
        >
        <p v-if="passwordMismatch" class="text-red-500 text-sm mt-1">
          {{ t('auth.passwordMismatch') }}
        </p>
      </div>
      
      <div v-if="authStore.error" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
        {{ authStore.error }}
      </div>
      
      <button 
        type="submit"
        class="w-full bg-accent hover:bg-accent-light text-white font-bold py-2 px-4 rounded-lg transition-colors"
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
      
      <div class="mt-4 text-center">
        <p class="text-text-secondary dark:text-text-secondary-light">
          {{ t('auth.haveAccount') }} 
          <a @click="$emit('switch-mode')" class="text-accent hover:text-accent-light cursor-pointer">
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
