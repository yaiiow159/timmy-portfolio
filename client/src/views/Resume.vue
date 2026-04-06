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
<<<<<<< Updated upstream
  <div class="min-h-screen py-12 resume-content">
    <div class="container mx-auto px-4">
      <div class="resume-header mb-12 text-center">
        <h1 class="text-4xl font-bold mb-4 text-text-primary">{{ t('resume.title') }}</h1>
        <p class="text-lg text-text-secondary mb-6">
          {{ t('resume.subtitle') }}
        </p>

=======
  <div class="min-h-screen py-20 bg-gradient-to-b from-primary to-secondary tech-grid-bg resume-container">
    <div class="container mx-auto px-6 md:px-8 resume-content">
      <div class="resume-header mb-20 text-center">
        <h1 class="tech-title text-5xl md:text-6xl font-bold mb-8">{{ t('resume.title') }}</h1>
        <p class="text-xl md:text-2xl text-text-secondary max-w-4xl mx-auto leading-relaxed mb-8">
          Full-stack developer with expertise in Java, Spring Boot, Vue.js, and more.
        </p>
        <div class="w-32 h-1.5 bg-gradient-to-r from-accent to-tech-purple mx-auto mb-10 rounded-full shadow-lg shadow-accent/30"></div>
        
>>>>>>> Stashed changes
        <button
          class="tech-button px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 tech-glow inline-flex items-center"
          @click="showDialog = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ t('resume.downloadPdf') }}
        </button>
      </div>
<<<<<<< Updated upstream

      <ResumeDialog v-model="showDialog" @download="downloadResume" />

      <ResumeSectionCard :title="t('resume.skills')">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="group in skillGroups" :key="group.title">
            <h3 class="text-xl font-semibold mb-3 text-text-primary">{{ group.title }}</h3>
=======
      
      <ResumeDialog
        v-model="showDialog"
        @download="downloadResume"
      />
      
      <section class="resume-section mb-16 tech-card p-10">
        <h2 class="tech-title text-4xl font-bold mb-10">{{ t('resume.skills') }}</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="p-6 rounded-xl bg-gradient-to-br from-accent/5 to-tech-purple/5 border border-accent/10 hover:border-accent/30 transition-all duration-300">
            <h3 class="text-2xl font-bold mb-4 text-accent flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
              Backend Development
            </h3>
>>>>>>> Stashed changes
            <ul class="space-y-2">
              <li v-for="item in group.items" :key="item.label" class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
<<<<<<< Updated upstream
                  <span class="font-medium">{{ item.label }}</span>
                  <span class="text-text-secondary"> {{ item.description }}</span>
=======
                  <span class="font-medium">Languages / Frameworks:</span>
                  <span class="text-text-secondary"> Spring Boot Framework, Java, Python, Node.js</span>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Data Access:</span>
                  <span class="text-text-secondary"> JPA, MyBatis</span>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Design Patterns:</span>
                  <span class="text-text-secondary"> Observer Pattern, Strategy Pattern, Chain of Responsibility, Template Method, Singleton</span>
                </div>
              </li>
            </ul>
          </div>
          
          <div class="p-6 rounded-xl bg-gradient-to-br from-accent/5 to-tech-purple/5 border border-accent/10 hover:border-accent/30 transition-all duration-300">
            <h3 class="text-2xl font-bold mb-4 text-accent flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Frontend Development
            </h3>
            <ul class="space-y-2">
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Markup & Styling:</span>
                  <span class="text-text-secondary"> HTML, CSS, Bootstrap, Tailwind</span>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Languages / Libraries:</span>
                  <span class="text-text-secondary"> JavaScript, jQuery, Vue.js, React.js</span>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Real-time Communication:</span>
                  <span class="text-text-secondary"> WebSocket, HTTP Messaging API</span>
                </div>
              </li>
            </ul>
          </div>
          
          <div class="p-6 rounded-xl bg-gradient-to-br from-accent/5 to-tech-purple/5 border border-accent/10 hover:border-accent/30 transition-all duration-300">
            <h3 class="text-2xl font-bold mb-4 text-accent flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
              Databases & Storage
            </h3>
            <ul class="space-y-2">
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Relational Databases:</span>
                  <span class="text-text-secondary"> PostgreSQL, MySQL, Oracle</span>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">NoSQL / Time-Series Databases:</span>
                  <span class="text-text-secondary"> Redis, InfluxDB, MongoDB, Elasticsearch</span>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Object Storage:</span>
                  <span class="text-text-secondary"> MinIO, S3, Cloudinary</span>
                </div>
              </li>
            </ul>
          </div>

          <div class="p-6 rounded-xl bg-gradient-to-br from-accent/5 to-tech-purple/5 border border-accent/10 hover:border-accent/30 transition-all duration-300">
            <h3 class="text-2xl font-bold mb-4 text-accent flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              Cloud & Deployment
            </h3>
            <ul class="space-y-2">
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Cloud Platforms:</span>
                  <span class="text-text-secondary"> AWS, GCP</span>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Containerization:</span>
                  <span class="text-text-secondary"> Docker, Docker Swarm</span>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Deployment / Automation Tools:</span>
                  <span class="text-text-secondary">GitLab CI/CD, Jenkins, Shell Script, BAT Script</span>
                </div>
              </li>
            </ul>
          </div>
          
          <div class="p-6 rounded-xl bg-gradient-to-br from-accent/5 to-tech-purple/5 border border-accent/10 hover:border-accent/30 transition-all duration-300">
            <h3 class="text-2xl font-bold mb-4 text-accent flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Monitoring & Analysis
            </h3>
            <ul class="space-y-2">
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Monitoring Tools:</span>
                  <span class="text-text-secondary"> Grafana, Prometheus, Kibana, Jconsole</span>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Logging & Alerting:</span>
                  <span class="text-text-secondary"> ELK Stack (Elasticsearch, Logstash, Kibana)</span>
                </div>
              </li>
            </ul>
          </div>
          
          <div class="p-6 rounded-xl bg-gradient-to-br from-accent/5 to-tech-purple/5 border border-accent/10 hover:border-accent/30 transition-all duration-300">
            <h3 class="text-2xl font-bold mb-4 text-accent flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              Version Control & Collaboration
            </h3>
            <ul class="space-y-2">
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Tools:</span>
                  <span class="text-text-secondary"> Git, SVN, Nexus Repository</span>
>>>>>>> Stashed changes
                </div>
              </li>
            </ul>
          </div>
        </div>
<<<<<<< Updated upstream
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
=======
      </section>
      
      <section class="resume-section mb-16 tech-card p-10">
        <h2 class="tech-title text-4xl font-bold mb-10">{{ t('resume.experience') }}</h2>
        
        <div class="job-entry mb-12 relative pl-8 border-l-4 border-accent rounded-lg">
          <div class="absolute -left-3 top-0 w-6 h-6 rounded-full bg-gradient-to-br from-accent to-tech-purple job-bullet shadow-lg shadow-accent/50"></div>
          <div class="mb-2 job-detail">
            <h3 class="text-xl font-semibold tech-text-primary">Software Engineer</h3>
            <p class="text-accent">Onework Co., Ltd. — Taipei, Taiwan</p>
            <p class="text-sm tech-text-secondary job-date">Aug 2024 - Apr 2025</p>
          </div>
          
          <h4 class="font-semibold mt-4 mb-2 tech-text-primary job-detail">PDS-Connected IoT Platform (End-to-End Independent Development)</h4>
          <ul class="space-y-2 tech-text-secondary">
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Designed backend architecture and implemented features including API development, performance testing (JMeter, Postman), Dockerized deployment, and Jenkins-based CI/CD pipeline.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Managed over 30 proxy units, each handling 10,0000+ sensors, 10,000+ devices, and 500+ equipment, ensuring real-time data processing and frontend visualization.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Optimized JVM performance and WebSocket handling to process high-frequency payloads (optical image streaming every 500ms, multi-proxy sensor updates within 1s).</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Reduced equipment query latency from 64 seconds to under 95 milliseconds.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Addressed mobile server data synchronization challenges under low bandwidth (64 Kbps) environments.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Applied Observer and Singleton patterns to decouple modules and implement real-time state propagation.</span>
            </li>
          </ul>

          <h4 class="font-semibold mt-4 mb-2 tech-text-primary job-detail">FarEasTone HEMS-Server (Independent Development)</h4>
          <ul class="space-y-2 tech-text-secondary">
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Developed a residential energy management system with scheduled data processing and Redis-based multi-level caching (by year, month, week, day).</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Designed complete API layers and integrated crontab scheduling to handle time-series IoT data aggregation and statistics.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Implemented efficient data processing pipelines for real-time energy consumption monitoring and analytics.</span>
            </li>
          </ul>

          <h4 class="font-semibold mt-4 mb-2 tech-text-primary job-detail">Cathay FM-Server Refactoring Project (Architecture & API Design)</h4>
          <ul class="space-y-2 tech-text-secondary">
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Led the transition from a monolithic architecture to a modular, distributed system (Portal Server + multiple FM services).</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Implemented dynamic multi-datasource switching based on different buildings, optimizing database access and improving system performance.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Collaborated with PMs to design system architecture diagrams and refactor legacy functionality for improved scalability and maintainability.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Handled 80M+ annual IoT records, integrating Kafka and local message tables for reliable synchronization and compensation in high-load scenarios.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Resolved real-time synchronization and broadcast performance across multi-building environments using WebSocket.</span>
            </li>
          </ul>
        </div>
        
        <div class="job-entry mb-12 relative pl-8 border-l-4 border-accent rounded-lg">
          <div class="absolute -left-3 top-0 w-6 h-6 rounded-full bg-gradient-to-br from-accent to-tech-purple job-bullet shadow-lg shadow-accent/50"></div>
          <div class="mb-2 job-detail">
            <h3 class="text-xl font-semibold tech-text-primary">Software Engineer</h3>
            <p class="text-accent">ESound Technology Co., Ltd. — Taipei, Taiwan</p>
            <p class="text-sm tech-text-secondary job-date">Sep 2023 - Feb 2024</p>
          </div>
          
          <h4 class="font-semibold mt-4 mb-2 tech-text-primary job-detail">Full-Stack Development & Maintenance</h4>
          <ul class="space-y-2 tech-text-secondary">
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Independently led full-stack development and ongoing maintenance for the Child Placement and Tracking System, including feature enhancements, bug fixes, performance tuning, and system deployment. Covered end-to-end development from backend logic to frontend UI.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Backend built with Spring MVC, database systems included Oracle and MySQL. Frontend technologies used: jQuery, Thymeleaf, Bootstrap, and CSS.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Designed and optimized Oracle Procedures, Functions, Schemas, Tables, and Indexes to significantly improve query performance.</span>
            </li>
          </ul>

          <h4 class="font-semibold mt-4 mb-2 tech-text-primary job-detail">System Performance & Security Enhancements</h4>
          <ul class="space-y-2 tech-text-secondary">
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Integrated SonarQube for static code analysis, enhancing code maintainability and system security.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Developed Shell and Python automation scripts to streamline deployment and testing processes, increasing development efficiency.</span>
            </li>
          </ul>
        </div>
        
        <div class="job-entry mb-12 relative pl-8 border-l-4 border-accent rounded-lg">
          <div class="absolute -left-3 top-0 w-6 h-6 rounded-full bg-gradient-to-br from-accent to-tech-purple job-bullet shadow-lg shadow-accent/50"></div>
          <div class="mb-2 job-detail">
            <h3 class="text-xl font-semibold tech-text-primary">Software Engineer</h3>
            <p class="text-accent">Hitrust Technology Co., Ltd. — Taipei, Taiwan</p>
            <p class="text-sm tech-text-secondary job-date">Aug 2022 - Sep 2023</p>
          </div>

          <h4 class="font-semibold mt-4 mb-2 tech-text-primary job-detail">Veri-id System Refactoring & Feature Expansion</h4>
          <ul class="space-y-2 tech-text-secondary">
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Led module refactoring and integration, including SSO-based permission design, approval mechanisms, custom report exports (Excel/PDF), and third-party API integration.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Resolved integration bottlenecks and enhanced overall system modularity and maintainability.</span>
            </li>
          </ul>

          <h4 class="font-semibold mt-4 mb-2 tech-text-primary job-detail">ACS / 3DS System Optimization & Asynchronous Architecture</h4>
          <ul class="space-y-2 tech-text-secondary">
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Refactored the transaction query module by applying indexing and table partitioning, reducing query time from 30 seconds to under 3 seconds.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Integrated RocketMQ to handle asynchronous transaction writeback, significantly improving system stability and scalability.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Developed and executed data migration scripts to transition from Oracle to MySQL.</span>
            </li>
          </ul>

          <h4 class="font-semibold mt-4 mb-2 tech-text-primary job-detail">Test Automation & Efficiency Improvement</h4>
          <ul class="space-y-2 tech-text-secondary">
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Created automated test modules using Selenium, replacing manual testing and reducing testing time by over 50%.</span>
            </li>
          </ul>

          <h4 class="font-semibold mt-4 mb-2 tech-text-primary job-detail">Bank of Communications / SeaMoney Testing Support</h4>
          <ul class="space-y-2 tech-text-secondary">
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Refactored legacy code from JPA to MyBatis, ensuring better testability through comprehensive unit tests.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Collaborated with the Shanghai team to define test workflows and documentation, ensuring consistency and test quality.</span>
            </li>
          </ul>
>>>>>>> Stashed changes
        </div>
      </ResumeSectionCard>

<<<<<<< Updated upstream
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
=======
        <div class="job-entry mb-12 relative pl-8 border-l-4 border-accent rounded-lg">
          <div class="absolute -left-3 top-0 w-6 h-6 rounded-full bg-gradient-to-br from-accent to-tech-purple job-bullet shadow-lg shadow-accent/50"></div>
          <div class="mb-2 job-detail">
            <h3 class="text-xl font-semibold tech-text-primary">MIS Specialist</h3>
            <p class="text-accent">EverBiz Industrial Co., Ltd. — Taipei, Taiwan</p>
            <p class="text-sm tech-text-secondary job-date">Apr 2016 - Dec 2016</p>
          </div>

          <ul class="space-y-2 tech-text-secondary">
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Developed Excel VBA scripts to automate the generation of departmental reports and analytical charts, significantly reducing manual effort and improving data processing efficiency.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Supported the IT team in managing employee accounts, system access, and device configurations, ensuring data security and proper access control across the organization.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Created multiple custom VBA tools for data cleansing, report generation, automatic data comparison, and routine task automation, streamlining daily operational workflows.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Contributed to the development of internal surveillance software and an automated employee check-in system, improving administrative efficiency and attendance tracking.</span>
            </li>
          </ul>
        </div>
      </section>
      
      <section class="resume-section mb-16 tech-card p-10">
        <h2 class="tech-title text-4xl font-bold mb-10">{{ t('resume.education') }}</h2>
        
        <div class="relative pl-8 border-l-4 border-accent rounded-lg">
          <div class="absolute -left-3 top-0 w-6 h-6 rounded-full bg-gradient-to-br from-accent to-tech-purple shadow-lg shadow-accent/50"></div>
          <div class="mb-2">
            <h3 class="text-xl font-semibold tech-text-primary">Tamkang University of Science and Technology</h3>
            <p class="text-accent">B.B.A. in Information Management</p>
            <p class="text-sm tech-text-secondary">2016 - 2021</p>
          </div>
          
          <p class="tech-text-secondary mt-4">
            Actively pursued IT skills during university, earning certifications including CCNA, MTA, and TQC Java.
            Developed a strong interest in Java, leading to in-depth study of language design and practical application.
            Successfully transitioned into the industry as a Java software engineer, applying academic knowledge to real-world development.
          </p>
        </div>
      </section>
      
      <section class="resume-section language-section tech-card p-10">
        <h2 class="tech-title text-4xl font-bold mb-10">{{ t('resume.languages') }}</h2>
        
>>>>>>> Stashed changes
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="language in languageSkills" :key="language.name" class="flex items-center gap-4">
            <div class="w-24">
<<<<<<< Updated upstream
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
=======
              <span class="font-medium tech-text-primary language-label">Chinese</span>
            </div>
            <div class="flex-grow">
              <div class="h-2 w-full bg-secondary rounded-full">
                <div class="language-bar h-2 rounded-full bg-accent" style="width: 100%"></div>
              </div>
              <span class="text-sm tech-text-secondary language-label">Native / Bilingual Proficiency</span>
            </div>
          </div>
          
          <div class="flex items-center">
            <div class="w-24">
              <span class="font-medium tech-text-primary language-label">English</span>
            </div>
            <div class="flex-grow">
              <div class="h-2 w-full bg-secondary rounded-full">
                <div class="language-bar h-2 rounded-full bg-accent" style="width: 85%"></div>
              </div>
              <span class="text-sm tech-text-secondary language-label">Advanced Proficiency</span>
>>>>>>> Stashed changes
            </div>
          </div>
        </div>
      </ResumeSectionCard>
    </div>
  </div>
</template>

<style scoped>
<<<<<<< Updated upstream
.resume-content {
  word-break: break-word;
}

.job-entry {
=======
/* Base container styling */
.resume-container {
  position: relative;
  min-height: 100vh;
  background-color: var(--bg-primary);
}

/* Content wrapper */
.resume-content {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  z-index: 2;
}

/* Section styling */
.resume-section {
  background: var(--bg-secondary);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  padding: 2rem;
  position: relative;
>>>>>>> Stashed changes
  overflow: hidden;
}

/* Header styling */
.resume-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

/* Card styling */
.tech-card {
  background: var(--bg-secondary) !important;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

/* Job entry styling */
.job-entry {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 2.5rem;
  border-left: 3px solid var(--accent);
}

.job-entry:last-child {
  margin-bottom: 0;
}

.job-bullet {
  position: absolute;
  left: -0.75rem;
  top: 0.25rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Text styling */
.tech-title {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.tech-text-primary {
  color: var(--text-primary);
  opacity: 1 !important;
}

.tech-text-secondary {
  color: var(--text-secondary);
  opacity: 1 !important;
}

/* Language bar styling */
.language-bar {
  transform-origin: left;
  height: 0.5rem;
  border-radius: 0.25rem;
  background: linear-gradient(90deg, var(--accent), var(--tech-purple));
  transition: width 1s ease-in-out;
}

/* Job date styling */
.job-date {
  display: inline-block;
  margin-bottom: 0.5rem;
  color: var(--accent);
  font-weight: 500;
}

/* Button styling */
button {
  position: relative;
  z-index: 10;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* List styling */
ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  margin-bottom: 0.5rem;
  position: relative;
  padding-left: 1.5rem;
}

li:before {
  content: '•';
  color: var(--accent);
  position: absolute;
  left: 0;
  top: 0;
}

/* Dark mode specific styles */
:global(.dark) {
  .resume-section {
    background: var(--bg-secondary);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }
  
  .tech-card {
    border-color: var(--border-color);
  }
  
  .job-entry {
    border-left-color: var(--accent);
  }
  
  .tech-text-primary {
    color: rgba(255, 255, 255, 0.95);
  }
  
  .tech-text-secondary {
    color: rgba(255, 255, 255, 0.8);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .resume-section {
    padding: 1.5rem;
  }
  
  .job-entry {
    padding-left: 1.5rem;
  }
  
  .job-bullet {
    left: -0.6rem;
    width: 1.2rem;
    height: 1.2rem;
  }
}
</style>
