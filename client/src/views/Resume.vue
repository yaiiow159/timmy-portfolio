<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
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

onMounted(async () => {
  // 等路由 page-fade 掛上 DOM 並完成首幀排版後再掛 IO，避免轉場期間漏判 intersection
  await nextTick()
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  )
  setupJobEntryAnimations()
  setupLanguageBarAnimation()
  window.setTimeout(() => {
    document.querySelectorAll('.job-entry').forEach((el) => {
      if (!el.classList.contains('is-visible')) el.classList.add('is-visible')
    })
  }, 800)
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
  <div class="min-h-screen py-8 md:py-14 resume-content tech-grid-bg">
    <div class="container mx-auto max-w-5xl px-4 sm:px-6 md:px-8">
      <div class="resume-header mb-10 text-center md:mb-14">
        <div class="page-hero-panel mx-auto max-w-2xl">
          <h1 class="tech-title mb-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {{ t('resume.title') }}
          </h1>
          <p class="mx-auto max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
            {{ t('resume.subtitle') }}
          </p>
          <div class="page-hero-divider" />
          <button
            type="button"
            class="tech-button tech-button-primary mt-8 inline-flex shadow-lg shadow-accent/25 ring-2 ring-accent/20 transition-transform hover:-translate-y-0.5"
            @click="showDialog = true"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {{ t('resume.downloadPdf') }}
          </button>
        </div>
      </div>

      <ResumeDialog v-model="showDialog" @download="downloadResume" />

      <ResumeSectionCard :title="t('resume.skills')">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <div
            v-for="group in skillGroups"
            :key="group.title"
            class="rounded-xl border border-accent/10 bg-primary/15 p-5 transition-colors hover:border-accent/25 md:p-6"
          >
            <h3 class="mb-4 border-b border-accent/10 pb-2 text-lg font-semibold text-text-primary">
              {{ group.title }}
            </h3>
            <ul class="space-y-3 text-text-secondary">
              <li v-for="item in group.items" :key="item.label" class="flex items-start gap-3">
                <span
                  class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-accent to-tech-purple shadow-[0_0_8px_rgba(var(--accent-rgb),0.6)]"
                  aria-hidden="true"
                />
                <div class="leading-relaxed">
                  <span class="font-medium text-text-primary">{{ item.label }}</span>
                  <span class="text-text-secondary/90"> {{ item.description }}</span>
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
          class="job-entry relative mb-8 pl-0 last:mb-0 md:pl-2"
        >
          <div
            class="absolute left-0 top-2 z-[1] h-4 w-4 rounded-full border-2 border-accent bg-[var(--secondary)] shadow-[0_0_14px_rgba(var(--accent-rgb),0.55)] md:top-2.5 md:h-5 md:w-5 md:left-1"
            aria-hidden="true"
          />
          <div
            class="relative ml-6 rounded-xl border border-white/5 bg-secondary/30 p-5 backdrop-blur-sm transition-all duration-300 hover:border-accent/20 hover:bg-secondary/45 md:ml-8 md:p-6"
          >
            <div class="job-detail mb-1">
              <h3 class="text-lg font-semibold text-text-primary md:text-xl">{{ experience.role }}</h3>
              <p class="bg-gradient-to-r from-accent to-tech-cyan bg-clip-text font-medium text-transparent">
                {{ experience.company }}
              </p>
              <p class="job-date mt-1 text-sm text-text-secondary/90">{{ experience.date }}</p>
            </div>

            <template v-if="experience.projects?.length">
              <div v-for="project in experience.projects" :key="project.title" class="job-detail mt-4 border-t border-accent/10 pt-4 first:mt-0 first:border-t-0 first:pt-0">
                <h4 class="mb-2 font-semibold text-text-primary">{{ project.title }}</h4>
                <ul class="space-y-2.5 text-text-secondary">
                  <li v-for="bullet in project.bullets" :key="bullet" class="job-detail flex items-start gap-2.5">
                    <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/80" />
                    <span class="leading-relaxed">{{ bullet }}</span>
                  </li>
                </ul>
              </div>
            </template>
            <template v-else>
              <ul class="mt-3 space-y-2.5 text-text-secondary">
                <li v-for="bullet in experience.bullets" :key="bullet" class="job-detail flex items-start gap-2.5">
                  <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/80" />
                  <span class="leading-relaxed">{{ bullet }}</span>
                </li>
              </ul>
            </template>
          </div>
        </div>
      </ResumeSectionCard>

      <ResumeSectionCard :title="t('resume.education')">
        <div
          v-for="education in educationEntries"
          :key="education.school"
          class="relative mb-8 pl-0 last:mb-0 md:pl-2"
        >
          <div
            class="absolute left-0 top-2 z-[1] h-4 w-4 rounded-full border-2 border-accent bg-[var(--secondary)] shadow-[0_0_12px_rgba(var(--accent-rgb),0.45)] md:left-1 md:h-5 md:w-5"
            aria-hidden="true"
          />
          <div
            class="relative ml-6 rounded-xl border border-white/5 bg-secondary/30 p-5 backdrop-blur-sm md:ml-8 md:p-6"
          >
            <div class="mb-2">
              <h3 class="text-lg font-semibold text-text-primary md:text-xl">{{ education.school }}</h3>
              <p class="font-medium text-accent">{{ education.degree }}</p>
              <p class="mt-1 text-sm text-text-secondary">{{ education.period }}</p>
            </div>
            <ul class="mt-4 list-none space-y-2 border-t border-accent/10 pt-4 text-text-secondary">
              <li v-for="detail in education.description" :key="detail" class="flex items-start gap-2.5 pl-0">
                <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-tech-purple/90" />
                <span class="leading-relaxed">{{ detail }}</span>
              </li>
            </ul>
          </div>
        </div>
      </ResumeSectionCard>

      <ResumeSectionCard :title="t('resume.languages')" customClass="language-section">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <div
            v-for="language in languageSkills"
            :key="language.name"
            class="flex flex-col gap-2 rounded-lg border border-accent/8 bg-primary/10 p-4 sm:flex-row sm:items-center sm:gap-5"
          >
            <div class="w-full shrink-0 sm:w-28">
              <span class="language-label font-medium text-text-primary">{{ language.name }}</span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="language-bar-track h-2.5 w-full overflow-hidden rounded-full">
                <div
                  class="language-bar h-2.5 rounded-full"
                  :style="{ width: languagesVisible ? `${language.level}%` : '0%' }"
                />
              </div>
              <span class="language-label mt-1.5 block text-sm text-text-secondary">{{ language.proficiency }}</span>
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

@media (prefers-reduced-motion: reduce) {
  .resume-header,
  :deep(.resume-section) {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }

  .job-entry {
    opacity: 1 !important;
    transform: none !important;
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
  background: linear-gradient(90deg, var(--accent), var(--tech-purple));
  box-shadow: 0 0 14px rgba(var(--accent-rgb), 0.35);
}

.light .language-bar {
  box-shadow: 0 0 12px rgba(124, 58, 237, 0.25);
}
</style>
