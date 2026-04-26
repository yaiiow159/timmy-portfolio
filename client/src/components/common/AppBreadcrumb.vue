<script setup lang="ts">
export type BreadcrumbItem = {
  label: string
  to?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<template>
  <nav
    class="app-breadcrumb mb-4 flex flex-wrap items-center gap-1.5 text-sm"
    aria-label="breadcrumb"
  >
    <template v-for="(item, index) in items" :key="index">
      <span v-if="index > 0" class="text-text-secondary select-none" aria-hidden="true">/</span>
      <component
        :is="item.to ? 'router-link' : 'span'"
        :to="item.to"
        :class="[
          item.to
            ? 'text-accent hover:underline font-medium'
            : 'text-text-primary font-medium truncate max-w-[min(100%,18rem)] sm:max-w-md',
        ]"
      >
        {{ item.label }}
      </component>
    </template>
  </nav>
</template>

<style scoped>
.app-breadcrumb {
  /* 讓最後一節在長標題時仍可點到上一層，避免擠成整行無斷行 */
  row-gap: 0.25rem;
}
</style>
