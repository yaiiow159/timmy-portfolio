<template>
  <section class="resume-section mb-8 md:mb-12 tech-card p-5 md:p-6" :class="customClass">
    <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 tech-title">{{ title }}</h2>
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
