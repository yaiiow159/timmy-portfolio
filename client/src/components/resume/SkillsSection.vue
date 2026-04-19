<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, onUnmounted } from 'vue'

const { t } = useI18n()

const { skills } = defineProps<{
  skills: {
    category: string
    items: {
      name: string
      level: number
    }[]
  }[]
}>()

const skillsRef = ref<HTMLElement | null>(null)
// 進入 viewport 後才展開技能進度條
const skillsVisible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!skillsRef.value) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !skillsVisible.value) {
          skillsVisible.value = true
          observer?.disconnect()
        }
      })
    },
    { threshold: 0.15 }
  )
  observer.observe(skillsRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div ref="skillsRef" class="skills-section">
    <div v-for="(category, index) in skills" :key="index" class="mb-8">
      <h3 class="text-xl font-semibold mb-4 text-text-primary">
        {{ t(`resume.skills.categories.${category.category}`) }}
      </h3>
      
      <div class="space-y-4">
        <div v-for="(skill, skillIndex) in category.items" :key="skillIndex" class="skill-item">
          <div class="flex justify-between mb-1">
            <span class="text-text-primary">{{ skill.name }}</span>
            <span class="text-text-secondary text-sm">{{ skill.level }}%</span>
          </div>
          
          <div class="h-2 bg-primary rounded-full overflow-hidden">
            <div 
              class="skill-progress-bar h-full bg-accent rounded-full"
              :style="{ width: skillsVisible ? `${skill.level}%` : '0%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skill-progress-bar {
  transition: width 1.5s ease-out;
}
</style>
