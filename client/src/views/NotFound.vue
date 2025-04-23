<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-accent mb-4">404</h1>
      <h2 class="text-3xl font-semibold text-text-primary mb-6">Page Not Found</h2>
      <p class="text-text-secondary mb-8 max-w-md mx-auto">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <button 
        @click="goHome" 
        class="px-6 py-3 bg-accent hover:bg-accent-light text-white font-medium rounded-lg transition-colors inline-flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
        </svg>
        Back to Home
      </button>
    </div>
  </div>
</template>
