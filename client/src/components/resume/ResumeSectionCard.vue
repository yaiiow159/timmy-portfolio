<template>
  <section
    class="resume-section group mb-8 overflow-hidden rounded-2xl border border-accent/12 bg-gradient-to-br from-[rgba(var(--bg-secondary-rgb),0.55)] to-[rgba(var(--bg-primary-rgb),0.28)] p-6 shadow-[0_20px_48px_-28px_rgba(0,0,0,0.55)] backdrop-blur-md transition-[box-shadow,border-color] duration-300 hover:border-accent/22 hover:shadow-[0_28px_56px_-26px_rgba(var(--accent-rgb),0.12)] md:mb-12 md:p-8"
    :class="customClass"
  >
    <div class="mb-6 flex items-center gap-4 md:mb-8">
      <span
        class="h-10 w-1 shrink-0 rounded-full bg-gradient-to-b from-accent via-tech-cyan to-tech-purple shadow-[0_0_14px_rgba(var(--accent-rgb),0.45)]"
        aria-hidden="true"
      />
      <h2 class="tech-title text-left text-xl font-bold md:text-2xl lg:text-3xl">{{ title }}</h2>
    </div>
    <div class="relative">
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

<style scoped>
:global(.light) .resume-section {
  border-color: rgba(124, 58, 237, 0.12);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.85) inset,
    0 18px 44px -22px rgba(109, 40, 217, 0.1);
}
:global(.light) .resume-section:hover {
  border-color: rgba(124, 58, 237, 0.2);
}
</style>
