<template>
  <div 
    class="mb-12"
    :class="{ 'text-center': centered }"
  >
    <h2 class="text-3xl md:text-4xl font-bold mb-4 text-text-primary relative inline-block">
      {{ title }}
      <span 
        v-if="withLine" 
        class="absolute -bottom-2 left-0 h-1 bg-accent"
        :class="{ 'w-full': centered, 'w-1/2': !centered }"
      ></span>
    </h2>
    <p v-if="subtitle" class="text-lg text-text-secondary max-w-2xl" :class="{ 'mx-auto': centered }">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  centered?: boolean
  withLine?: boolean
}>()
</script>
