<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ResumeDialog from '../components/common/ResumeDialog.vue'
import ResumeSectionCard from '../components/resume/ResumeSectionCard.vue'
import type { EducationEntry, LanguageSkill, SkillGroup, WorkExperience } from '../types/resume'

gsap.registerPlugin(ScrollTrigger)

const { t, tm } = useI18n()
const languageBarsAnimated = ref(false)
const showDialog = ref(false)

const getLocalizedList = <T>(path: string): T[] => {
  const value = tm(path)
  return Array.isArray(value) ? (value as T[]) : []
}

const skillGroups = computed<SkillGroup[]>(() => getLocalizedList<SkillGroup>('resume.content.skills'))
const workExperiences = computed<WorkExperience[]>(() => getLocalizedList<WorkExperience>('resume.content.experiences'))
const educationEntries = computed<EducationEntry[]>(() => getLocalizedList<EducationEntry>('resume.content.education'))
const languageSkills = computed<LanguageSkill[]>(() => getLocalizedList<LanguageSkill>('resume.content.languages'))

onMounted(() => {
  const tl = gsap.timeline()

  tl.from('.resume-header', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
  }).from(
    '.resume-section',
    {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.2,
      ease: 'power3.out'
    },
    '-=0.3'
  )

  animateWorkExperience()

  ScrollTrigger.create({
    trigger: '.language-section',
    start: 'top 80%',
    once: true,
    onEnter: animateLanguageSkills
  })

  nextTick(() => {
    const languageSection = document.querySelector('.language-section')
    if (languageSection && isLanguageSectionInView(languageSection)) {
      animateLanguageSkills()
    }

    ScrollTrigger.refresh()
  })
})

function animateWorkExperience() {
  gsap.utils.toArray<HTMLElement>('.job-entry').forEach((entry) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: entry as gsap.DOMTarget,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    })

    tl.from(entry as gsap.TweenTarget, {
      x: -50,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    })
      .from(
        entry.querySelectorAll('.job-detail'),
        {
          y: 20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: 'power3.out'
        },
        '-=0.2'
      )
      .from(
        entry.querySelectorAll('.job-bullet'),
        {
          scale: 0.5,
          opacity: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: 'back.out(1.7)'
        },
        '-=0.2'
      )
      .from(
        entry.querySelector('.job-date'),
        {
          width: 0,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.inOut'
        },
        '-=0.3'
      )
  })
}

function animateLanguageSkills() {
  if (languageBarsAnimated.value) return

  languageBarsAnimated.value = true

  const languageBars = document.querySelectorAll<HTMLElement>('.language-bar')
  languageBars.forEach((bar) => {
    const percent = bar.dataset.percent || bar.style.width || '0%'

    gsap.from(bar, {
      width: '0%',
      duration: 1.2,
      ease: 'power3.out',
      onStart: () => {
        bar.style.width = percent
      }
    })
  })
}

function isLanguageSectionInView(section: Element) {
  const rect = section.getBoundingClientRect()
  const startOffset = window.innerHeight * 0.8

  return rect.top <= startOffset && rect.bottom >= 0
}

function downloadResume(language: 'zh' | 'en') {
  const resumeUrl = language === 'zh' ? '/resume_zh.pdf' : '/resume_en.pdf'

  const link = document.createElement('a')
  link.href = resumeUrl
  link.target = '_blank'
  link.download = language === 'zh' ? 'resume_zh.pdf' : 'resume_en.pdf'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div class="min-h-screen py-12 resume-content">
    <div class="container mx-auto px-4">
      <div class="resume-header mb-12 text-center">
        <h1 class="text-4xl font-bold mb-4 text-text-primary">{{ t('resume.title') }}</h1>
        <p class="text-lg text-text-secondary mb-6">
          {{ t('resume.subtitle') }}
        </p>

        <button
          class="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-6 rounded-lg transition-colors"
          @click="showDialog = true"
        >
          {{ t('resume.downloadPdf') }}
        </button>
      </div>

      <ResumeDialog v-model="showDialog" @download="downloadResume" />

      <ResumeSectionCard :title="t('resume.skills')">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="group in skillGroups" :key="group.title">
            <h3 class="text-xl font-semibold mb-3 text-text-primary">{{ group.title }}</h3>
            <ul class="space-y-2">
              <li v-for="item in group.items" :key="item.label" class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">{{ item.label }}</span>
                  <span class="text-text-secondary"> {{ item.description }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </ResumeSectionCard>

      <ResumeSectionCard :title="t('resume.experience')">
        <div
          v-for="experience in workExperiences"
          :key="`${experience.role}-${experience.company}`"
          class="job-entry mb-8 relative pl-6 border-l-2 border-accent"
        >
          <div class="absolute -left-2 top-0 w-4 h-4 rounded-full bg-accent job-bullet"></div>
          <div class="mb-2 job-detail">
            <h3 class="text-xl font-semibold text-text-primary">{{ experience.role }}</h3>
            <p class="text-accent">{{ experience.company }}</p>
            <p class="text-sm text-text-secondary job-date">{{ experience.date }}</p>
          </div>

          <template v-if="experience.projects?.length">
            <div v-for="project in experience.projects" :key="project.title" class="job-detail">
              <h4 class="font-semibold mt-4 mb-2 text-text-primary">{{ project.title }}</h4>
              <ul class="space-y-2 text-text-secondary">
                <li v-for="bullet in project.bullets" :key="bullet" class="flex items-start job-detail">
                  <span class="text-accent mr-2">•</span>
                  <span>{{ bullet }}</span>
                </li>
              </ul>
            </div>
          </template>
          <template v-else>
            <ul class="space-y-2 text-text-secondary">
              <li v-for="bullet in experience.bullets" :key="bullet" class="flex items-start job-detail">
                <span class="text-accent mr-2">•</span>
                <span>{{ bullet }}</span>
              </li>
            </ul>
          </template>
        </div>
      </ResumeSectionCard>

      <ResumeSectionCard :title="t('resume.education')">
        <div
          v-for="education in educationEntries"
          :key="education.school"
          class="relative pl-6 border-l-2 border-accent"
        >
          <div class="absolute -left-2 top-0 w-4 h-4 rounded-full bg-accent"></div>
          <div class="mb-2">
            <h3 class="text-xl font-semibold text-text-primary">{{ education.school }}</h3>
            <p class="text-accent">{{ education.degree }}</p>
            <p class="text-sm text-text-secondary">{{ education.period }}</p>
          </div>

          <ul class="list-disc list-inside text-text-secondary space-y-2 mt-4">
            <li v-for="detail in education.description" :key="detail">
              {{ detail }}
            </li>
          </ul>
        </div>
      </ResumeSectionCard>

      <ResumeSectionCard :title="t('resume.languages')" customClass="language-section">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="language in languageSkills" :key="language.name" class="flex items-center gap-4">
            <div class="w-24">
              <span class="font-medium text-text-primary language-label">{{ language.name }}</span>
            </div>
            <div class="flex-grow">
              <div class="h-2 w-full bg-gray-700 rounded-full">
                <div
                  class="language-bar h-2 rounded-full bg-accent"
                  :data-percent="`${language.level}%`"
                  :style="{ width: `${language.level}%` }"
                ></div>
              </div>
              <span class="text-sm text-text-secondary language-label">{{ language.proficiency }}</span>
            </div>
          </div>
        </div>
      </ResumeSectionCard>
    </div>
  </div>
</template>

<style scoped>
.resume-content {
  word-break: break-word;
}

.job-entry {
  overflow: hidden;
}

.language-bar {
  transform-origin: left;
}

.job-date {
  position: relative;
  display: inline-block;
  overflow: hidden;
}

.language-label {
  display: inline-block;
}
</style>
