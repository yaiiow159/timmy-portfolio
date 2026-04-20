<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-10 sm:py-12 px-4 sm:px-6">
    <div class="text-center max-w-lg mx-auto w-full">
      <h1 class="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-accent mb-3 sm:mb-4 leading-none">{{ t('notFound.title') }}</h1>
      <h2 class="text-xl sm:text-2xl md:text-3xl font-semibold text-text-primary mb-4 sm:mb-6">{{ t('notFound.heading') }}</h2>
      <p class="text-text-secondary mb-8 max-w-md mx-auto">
        {{ t('notFound.description') }}
      </p>
      <button 
        @click="goHome" 
        class="px-6 py-3 bg-accent hover:bg-accent-light text-white font-medium rounded-lg transition-colors inline-flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
        </svg>
        {{ t('notFound.backToHome') }}
      </button>
    </div>
  </div>
</template>
