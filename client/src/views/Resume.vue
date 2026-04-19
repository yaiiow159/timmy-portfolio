<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ResumeDialog from '../components/common/ResumeDialog.vue'
import ResumeSectionCard from '../components/resume/ResumeSectionCard.vue'
import type { EducationEntry, LanguageSkill, SkillGroup, WorkExperience } from '../types/resume'

const { t, tm } = useI18n()
const showDialog = ref(false)
// 語言進度條進入 viewport 後才展開寬度
const languagesVisible = ref(false)

const getLocalizedList = <T>(path: string): T[] => {
  const value = tm(path)
  return Array.isArray(value) ? (value as T[]) : []
}

const skillGroups = computed<SkillGroup[]>(() => getLocalizedList<SkillGroup>('resume.content.skills'))
const workExperiences = computed<WorkExperience[]>(() => getLocalizedList<WorkExperience>('resume.content.experiences'))
const educationEntries = computed<EducationEntry[]>(() => getLocalizedList<EducationEntry>('resume.content.education'))
const languageSkills = computed<LanguageSkill[]>(() => getLocalizedList<LanguageSkill>('resume.content.languages'))

let jobObserver: IntersectionObserver | null = null
let langObserver: IntersectionObserver | null = null

onMounted(() => {
  setupJobEntryAnimations()
  setupLanguageBarAnimation()
})

onUnmounted(() => {
  jobObserver?.disconnect()
  langObserver?.disconnect()
})

function setupJobEntryAnimations() {
  jobObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          jobObserver?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 }
  )
  document.querySelectorAll('.job-entry').forEach((el) => jobObserver!.observe(el))
}

function setupLanguageBarAnimation() {
  langObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !languagesVisible.value) {
          languagesVisible.value = true
          langObserver?.disconnect()
        }
      })
    },
    { threshold: 0.2 }
  )
  const langSection = document.querySelector('.language-section')
  if (langSection) langObserver.observe(langSection)
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
  <div class="min-h-screen py-8 md:py-12 resume-content tech-grid-bg">
    <div class="container mx-auto px-4 sm:px-6 md:px-8">
      <div class="resume-header mb-8 md:mb-12 text-center">
        <h1 class="text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-text-primary">{{ t('resume.title') }}</h1>
        <p class="text-base md:text-lg text-text-secondary mb-4 md:mb-6">
          {{ t('resume.subtitle') }}
        </p>
        <button
          class="tech-button tech-button-primary"
          @click="showDialog = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ t('resume.downloadPdf') }}
        </button>
      </div>

      <ResumeDialog v-model="showDialog" @download="downloadResume" />

      <ResumeSectionCard :title="t('resume.skills')">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="group in skillGroups" :key="group.title">
            <h3 class="text-xl font-semibold mb-3 text-text-primary">{{ group.title }}</h3>
            <ul class="space-y-2 text-text-secondary">
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
          class="relative pl-6 border-l-2 border-accent mb-6"
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
              <div class="language-bar-track h-2 w-full rounded-full">
                <div
                  class="language-bar h-2 rounded-full bg-accent"
                  :style="{ width: languagesVisible ? `${language.level}%` : '0%' }"
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

/* CSS 入場動畫：不依賴 JS，確保內容永遠可見 */
.resume-header {
  animation: resumeSlideIn 0.6s ease-out both;
}

:deep(.resume-section):nth-child(1) { animation: resumeSlideIn 0.5s 0.05s ease-out both; }
:deep(.resume-section):nth-child(2) { animation: resumeSlideIn 0.5s 0.15s ease-out both; }
:deep(.resume-section):nth-child(3) { animation: resumeSlideIn 0.5s 0.25s ease-out both; }
:deep(.resume-section):nth-child(4) { animation: resumeSlideIn 0.5s 0.35s ease-out both; }

@keyframes resumeSlideIn {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 捲動進入 viewport 後才套用動畫（JS 先隱藏，Observer 再顯示） */
.job-entry {
  position: relative;
  opacity: 0;
  transform: translateX(-30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.job-entry.is-visible {
  opacity: 1;
  transform: translateX(0);
}

/* 使用 CSS 變數讓進度條軌道自動適應主題 */
.language-bar-track {
  background: rgba(var(--accent-rgb), 0.15);
}

.language-bar {
  transform-origin: left;
  transition: width 1.2s ease-out;
}
</style>
