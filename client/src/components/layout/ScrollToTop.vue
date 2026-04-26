<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

/** 略過首屏即顯示，避免干擾閱讀 */
const SCROLL_THRESHOLD_PX = 400

const isVisible = ref(false)

function updateVisibility() {
  isVisible.value = window.scrollY > SCROLL_THRESHOLD_PX
}

function scrollToTop() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  })
}

onMounted(() => {
  updateVisibility()
  window.addEventListener('scroll', updateVisibility, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateVisibility)
})
</script>

<template>
  <Transition name="scroll-to-top-fade">
    <button
      v-show="isVisible"
      type="button"
      class="scroll-to-top-fab"
      :aria-label="t('common.backToTop')"
      @click="scrollToTop"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.scroll-to-top-fab {
  position: fixed;
  z-index: 40;
  right: max(1rem, env(safe-area-inset-right));
  bottom: max(1rem, env(safe-area-inset-bottom));
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border-radius: 9999px;
  cursor: pointer;
  color: var(--accent);
  background: rgba(var(--bg-secondary-rgb), 0.92);
  border: 1px solid rgba(var(--accent-rgb), 0.28);
  box-shadow:
    0 4px 14px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.scroll-to-top-fab:hover {
  color: var(--accent-light);
  border-color: rgba(var(--accent-rgb), 0.45);
  transform: translateY(-2px);
  box-shadow:
    0 8px 22px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(var(--accent-rgb), 0.15);
}

.scroll-to-top-fab:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

:global(.light) .scroll-to-top-fab {
  color: #7c3aed;
  background: rgba(255, 255, 255, 0.92);
  border-color: rgba(124, 58, 237, 0.22);
  box-shadow: 0 4px 16px rgba(109, 40, 217, 0.12);
}

:global(.light) .scroll-to-top-fab:hover {
  color: #6d28d9;
  border-color: rgba(124, 58, 237, 0.4);
}

.scroll-to-top-fade-enter-active,
.scroll-to-top-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.scroll-to-top-fade-enter-from,
.scroll-to-top-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
