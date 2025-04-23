<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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

onMounted(() => {
  if (skillsRef.value) {
    animateSkills()
  }
})

function animateSkills() {
  const skillBars = document.querySelectorAll('.skill-progress-bar')
  
  skillBars.forEach((bar) => {
    const level = parseFloat(bar.getAttribute('data-level') || '0')
    
    gsap.fromTo(
      bar,
      { width: '0%' },
      {
        width: `${level}%`,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: bar,
          start: 'top 80%',
          once: true
        }
      }
    )
  })
}
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
              :data-level="skill.level"
              :style="{ width: '0%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
