<template>
  <section class="resume-section mb-12 bg-secondary rounded-lg p-6 shadow-lg" :class="customClass">
    <h2 class="text-2xl font-bold mb-6 text-accent">{{ title }}</h2>
    <div>
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  customClass?: string
}>()
</script>
