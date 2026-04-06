<script setup lang="ts">
import {ref, onMounted, watch, onUnmounted} from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { usePortfolioStore } from '@/store/portfolioStore'
import { useBlogStore } from '@/store/blogStore'
import { formatDescription } from '@/utils/textFormatters'

const { t } = useI18n()
const router = useRouter()
const portfolioStore = usePortfolioStore()
const blogStore = useBlogStore()
const isLoaded = ref(true)
const projectCarouselIndices = ref<Record<string, number>>({})
const activeSkillCategory = ref('all')
const carouselIntervals = ref<Record<string, number>>({})
const animationComplete = ref(false)

function getProjectCarouselIndex(projectId: string): number {
  return projectCarouselIndices.value[projectId] || 0
}

function setProjectCarouselIndex(projectId: string, index: number): void {
  projectCarouselIndices.value[projectId] = index
}

function nextProjectImage(projectId: string): void {
  const project = portfolioStore.featuredProjects.find(p => p.id === projectId)
  if (!project || !project.imageUrl || (Array.isArray(project.imageUrl) && project.imageUrl.length <= 1)) return
  
  const currentIndex = getProjectCarouselIndex(projectId)
  const nextIndex = (currentIndex + 1) % (Array.isArray(project.imageUrl) ? project.imageUrl.length : 1)
  setProjectCarouselIndex(projectId, nextIndex)
}

function prevProjectImage(projectId: string): void {
  const project = portfolioStore.featuredProjects.find(p => p.id === projectId)
  if (!project || !project.imageUrl || (Array.isArray(project.imageUrl) && project.imageUrl.length <= 1)) return
  
  const currentIndex = getProjectCarouselIndex(projectId)
  const prevIndex = (currentIndex - 1 + (Array.isArray(project.imageUrl) ? project.imageUrl.length : 1)) % (Array.isArray(project.imageUrl) ? project.imageUrl.length : 1)
  setProjectCarouselIndex(projectId, prevIndex)
}

function startCarousel(projectId: string): void {
  const project = portfolioStore.featuredProjects.find(p => p.id === projectId)
  if (!project || !project.imageUrl || (Array.isArray(project.imageUrl) && project.imageUrl.length <= 1)) return
  
  stopCarousel(projectId)
  
  carouselIntervals.value[projectId] = globalThis.setInterval(() => {
    nextProjectImage(projectId)
  }, 5000)
}

function stopCarousel(projectId: string): void {
  if (carouselIntervals.value[projectId]) {
    globalThis.clearInterval(carouselIntervals.value[projectId])
    delete carouselIntervals.value[projectId]
  }
}

function animateHeroElements() {
  setTimeout(() => {
    const profilePicture = document.querySelector('.profile-picture-inner') as HTMLElement;
    if (profilePicture) {
      profilePicture.classList.add('animate-profile');
    }
    
    setTimeout(() => {
      const professionElement = document.querySelector('.profession-highlight') as HTMLElement;
      if (professionElement) {
        professionElement.classList.add('animate-title');
      }
      
      const experienceBadge = document.querySelector('.experience-badge') as HTMLElement;
      if (experienceBadge) {
        experienceBadge.classList.add('animate-badge');
      }
      
      setTimeout(() => {
        const description = document.querySelector('.hero-description') as HTMLElement;
        if (description) {
          description.classList.add('animate-description');
        }
        
        setTimeout(() => {
          const ctaButtons = document.querySelectorAll('.cta-button');
          ctaButtons.forEach((button, index) => {
            setTimeout(() => {
              (button as HTMLElement).classList.add('animate-button');
            }, index * 200);
          });
          
          animationComplete.value = true;
        }, 300);
      }, 300);
    }, 500);
  }, 300);
}

onMounted(async () => {
  try {
    await Promise.all([
      portfolioStore.fetchFeaturedProjects(),
      blogStore.fetchPosts()
    ])
    
    portfolioStore.featuredProjects.forEach(project => {
      projectCarouselIndices.value[project.id] = 0
      
      if (project.imageUrl && Array.isArray(project.imageUrl) && project.imageUrl.length > 1) {
        startCarousel(project.id)
      }
    })
    
    isLoaded.value = true;
    
    animateHeroElements();
    
  } catch (error) {
    console.error('Error fetching data:', error)
    isLoaded.value = true
  }
})

onUnmounted(() => {
  Object.keys(carouselIntervals.value).forEach(projectId => {
    globalThis.clearInterval(carouselIntervals.value[projectId])
  })
})

const skillCategories = [
  {
    id: 'frontend',
    skills: [
      { name: 'Vue.js', icon: 'devicon-vuejs-plain colored' },
      { name: 'TypeScript', icon: 'devicon-typescript-plain colored' },
      { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-plain colored' }
    ]
  },
  {
    id: 'backend',
    skills: [
      { name: 'Java', icon: 'devicon-java-plain colored' },
      { name: 'Spring Boot', icon: 'devicon-spring-plain colored' },
      { name: 'Node.js', icon: 'devicon-nodejs-plain colored' },
      { name: 'Express', icon: 'devicon-express-original' }
    ]
  },
  {
    id: 'database',
    skills: [
      { name: 'MongoDB', icon: 'devicon-mongodb-plain colored' },
      { name: 'MySQL', icon: 'devicon-mysql-plain colored' },
      { name: 'PostgreSQL', icon: 'devicon-postgresql-plain colored' },
      { name: 'Redis', icon: 'devicon-redis-plain colored' }
    ]
  },
  {
    id: 'devops',
    skills: [
      { name: 'AWS', icon: 'devicon-amazonwebservices-original colored' },
      { name: 'Docker', icon: 'devicon-docker-plain colored' },
      { name: 'Git', icon: 'devicon-git-plain colored' },
      { name: 'SVN', icon: 'devicon-subversion-plain' },
      { name: 'Jenkins', icon: 'devicon-jenkins-line' },
      { name: 'GitLab', icon: 'devicon-gitlab-plain colored' }
    ]
  },
  {
    id: 'monitoring',
    skills: [
      { name: 'JConsole', icon: 'devicon-java-plain' },
      { name: 'Grafana', icon: 'devicon-grafana-original colored' }
    ]
  },
  {
    id: 'systems',
    skills: [
      { name: 'Ubuntu', icon: 'devicon-ubuntu-plain colored' },
      { name: 'CentOS', icon: 'devicon-centos-plain' },
      { name: 'Windows', icon: 'devicon-windows8-original colored' }
    ]
  }
]

watch(() => activeSkillCategory.value, () => {
  setTimeout(() => {
    const skillItems = document.querySelectorAll('.skill-item')
    skillItems.forEach(item => {
      const htmlItem = item as HTMLElement;
      htmlItem.style.setProperty('opacity', '0');
      htmlItem.style.setProperty('transform', 'translateY(20px)');
    })
    
    setTimeout(() => {
      skillItems.forEach(item => {
        const htmlItem = item as HTMLElement;
        htmlItem.style.setProperty('opacity', '1');
        htmlItem.style.setProperty('transform', 'translateY(0)');
      })
    }, 50)
  }, 50)
})

</script>

<template>
  <div class="min-h-screen tech-grid-bg" v-if="isLoaded">
    <section class="relative py-28 md:py-40 overflow-hidden hero-section tech-particles">
      <div class="tech-decoration circle-1"></div>
      <div class="tech-decoration circle-2"></div>
      <div class="tech-decoration circle-3"></div>
      
      <div class="container mx-auto px-6 md:px-8 relative z-10">
        <div class="hero-content flex flex-col items-center justify-between max-w-6xl mx-auto">
          <div class="profile-section w-full flex justify-center mb-16">
            <div class="profile-picture-container">
              <div class="profile-picture-inner tech-card">
                <img src="/profile.png" alt="Timmy's Profile" class="profile-picture" />
              </div>
              <div class="profile-decoration"></div>
              <div class="profile-particles">
                <span v-for="i in 12" :key="i" class="tech-particle" :style="{ '--delay': `${i * 0.2}s` }"></span>
              </div>
            </div>
          </div>
          
          <div class="hero-text w-full text-center">
            <div class="profession-container flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
              <h2 class="tech-title text-4xl md:text-5xl font-bold profession-highlight">
                {{ t('home.title') }}
              </h2>
              <div class="experience-badge tech-button">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>3+ {{ t('home.yearsExp') }}</span>
              </div>
            </div>
            <p class="hero-description text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-text-secondary leading-relaxed font-light">
              {{ t('home.intro') }}
            </p>
            <div class="hero-cta flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                @click="router.push('/portfolio')" 
                class="tech-button tech-button-lg tech-pulse group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                {{ t('home.cta') }}
              </button>
              <button 
                @click="router.push('/contact')" 
                class="tech-button tech-button-lg tech-button-outline group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {{ t('home.contact') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="py-24 bg-secondary skills-section tech-particles">
      <div class="container mx-auto px-6 md:px-8">
        <div class="text-center mb-20">
          <div class="inline-flex items-center gap-3 mb-6">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-tech-purple/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 class="tech-title text-4xl md:text-5xl font-bold">
              {{ t('resume.skills') }}
            </h2>
          </div>
          <p class="text-text-secondary text-lg max-w-2xl mx-auto mb-6">專精於全端開發，擁有豐富的實戰經驗</p>
          <div class="w-32 h-1 bg-gradient-to-r from-accent to-tech-purple mx-auto rounded-full"></div>
        </div>
        
        <div class="skills-filter flex flex-wrap justify-center gap-4 mb-16">
          <button 
            v-for="category in ['all', 'frontend', 'backend', 'database', 'devops', 'monitoring', 'systems']" 
            :key="category"
            @click="activeSkillCategory = category"
            :class="[
              'tech-button px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 tech-glow',
              activeSkillCategory === category 
                ? 'bg-gradient-to-r from-accent to-tech-purple text-white' 
                : 'bg-secondary text-text-secondary hover:bg-accent/20'
            ]"
          >
            {{ t(`skills.categories.${category}`) }}
          </button>
        </div>
        
        <div class="skills-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10 justify-items-center max-w-7xl mx-auto">
          <template v-if="activeSkillCategory === 'all'">
            <div 
              v-for="(skill, index) in skillCategories.flatMap(category => category.skills)"
              :key="`all-${skill.name}`"
              class="skill-item flex flex-col items-center transform hover:scale-110 transition-all duration-300 tech-slide-up"
              :style="{ '--index': index, 'animation-delay': `${index * 0.1}s` }"
            >
              <div class="skill-icon w-20 h-20 flex items-center justify-center bg-gradient-to-br from-accent/20 to-tech-purple/20 rounded-2xl mb-4 shadow-lg hover:shadow-2xl transition-all duration-300 tech-glow border-2 border-transparent hover:border-accent/50">
                <i :class="[skill.icon, 'text-4xl text-accent']"></i>
              </div>
              <span class="skill-name text-sm text-text-secondary font-semibold text-center">{{ skill.name }}</span>
            </div>
          </template>
          
          <template v-else>
            <div 
              v-for="(skill, index) in skillCategories.find(c => c.id === activeSkillCategory)?.skills || []"
              :key="`cat-${activeSkillCategory}-${skill.name}`"
              class="skill-item flex flex-col items-center transform hover:scale-110 transition-all duration-300 tech-slide-up"
              :style="{ '--index': index, 'animation-delay': `${index * 0.1}s` }"
            >
              <div class="skill-icon w-20 h-20 flex items-center justify-center bg-gradient-to-br from-accent/20 to-tech-purple/20 rounded-2xl mb-4 shadow-lg hover:shadow-2xl transition-all duration-300 tech-glow border-2 border-transparent hover:border-accent/50">
                <i :class="[skill.icon, 'text-4xl text-accent']"></i>
              </div>
              <span class="skill-name text-sm text-text-secondary font-semibold text-center">{{ skill.name }}</span>
            </div>
          </template>
        </div>
      </div>
    </section>
    
    <section class="py-24 bg-primary project-section">
      <div class="container mx-auto px-6 md:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center mb-20 gap-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-tech-purple/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h2 class="tech-title text-4xl md:text-5xl font-bold">
              {{ t('portfolio.title') }}
            </h2>
          </div>
          <button 
            @click="router.push('/portfolio')" 
            class="tech-button group"
          >
            {{ t('portfolio.viewProject') }}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          <div v-if="portfolioStore.isLoading" v-for="i in 3" :key="i" class="tech-card animate-pulse">
            <div class="h-48 bg-gradient-to-br from-secondary to-primary rounded-t-2xl"></div>
            <div class="p-6">
              <div class="h-6 bg-secondary rounded w-3/4 mb-4"></div>
              <div class="h-4 bg-secondary rounded w-full mb-2"></div>
              <div class="h-4 bg-secondary rounded w-5/6 mb-6"></div>
              <div class="flex gap-2 mb-4">
                <div v-for="j in 3" :key="j" class="h-6 bg-secondary rounded px-3"></div>
              </div>
              <div class="h-10 bg-secondary rounded w-full"></div>
            </div>
          </div>
          
          <div v-else v-for="project in portfolioStore.featuredProjects" :key="project.id" class="tech-card project-card">
            <div class="h-48 relative overflow-hidden rounded-t-2xl" 
                 @mouseenter="stopCarousel(project.id)" 
                 @mouseleave="startCarousel(project.id)">
              <div v-if="project.imageUrl && (Array.isArray(project.imageUrl) ? project.imageUrl.length > 0 : true)" class="project-image-carousel h-full w-full">
                <transition-group name="fade" tag="div" class="carousel-images h-full w-full">
                  <img 
                    v-for="(imageUrl, index) in Array.isArray(project.imageUrl) ? project.imageUrl : [project.imageUrl]" 
                    :key="`${project.id}-img-${index}`"
                    v-show="getProjectCarouselIndex(project.id) === index"
                    :src="imageUrl" 
                    :alt="`${project.title} - Image ${index + 1}`"
                    class="w-full h-full object-cover absolute top-0 left-0 transition-transform duration-500 hover:scale-110"
                  />
                </transition-group>
                
                <div v-if="Array.isArray(project.imageUrl) && project.imageUrl.length > 1" class="carousel-controls absolute inset-0 flex items-center justify-between z-10">
                  <button @click.prevent="prevProjectImage(project.id)" class="carousel-control carousel-prev ml-2 tech-button tech-glow">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7m0 0l-7 7-7 7" />
                    </svg>
                  </button>
                  <button @click.prevent="nextProjectImage(project.id)" class="carousel-control carousel-next mr-2 tech-button tech-glow">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                <div v-if="Array.isArray(project.imageUrl) && project.imageUrl.length > 1" class="carousel-indicators absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
                  <button 
                    v-for="(_, index) in Array.isArray(project.imageUrl) ? project.imageUrl : [project.imageUrl]" 
                    :key="`${project.id}-indicator-${index}`"
                    @click="setProjectCarouselIndex(project.id, index)"
                    class="carousel-indicator w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors"
                    :class="{ 'bg-accent': getProjectCarouselIndex(project.id) === index }"
                  ></button>
                </div>
              </div>
              
              <div v-else class="w-full h-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center rounded-t-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-text-primary">{{ project.title }}</h3>
              <p class="text-text-secondary mb-4 line-clamp-3" v-html="formatDescription(project.description, 150)"></p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span 
                  v-for="tech in project.technologies.slice(0, 3)" 
                  :key="tech"
                  class="px-3 py-1 bg-gradient-to-r from-accent/20 to-tech-purple/20 text-accent text-sm rounded-full border border-accent/30"
                >
                  {{ tech }}
                </span>
              </div>
              <div class="flex gap-3">
                <a 
                  v-if="project.liveUrl" 
                  :href="project.liveUrl" 
                  target="_blank"
                  class="flex-1 inline-flex justify-center items-center px-4 py-2 bg-gradient-to-r from-accent to-tech-cyan text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 tech-glow"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {{ t('portfolio.viewLive') }}
                </a>
                <a 
                  v-if="project.codeUrl" 
                  :href="project.codeUrl" 
                  target="_blank"
                  class="flex-1 inline-flex justify-center items-center px-4 py-2 border-2 border-accent text-accent hover:bg-accent hover:text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  {{ t('portfolio.viewCode') }}
                </a>
                <button 
                  v-if="!project.liveUrl && !project.codeUrl" 
                  @click="router.push('/portfolio')" 
                  class="flex-1 inline-flex justify-center items-center px-4 py-2 bg-gradient-to-r from-accent to-tech-cyan text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 tech-glow cursor-pointer"
                >
                  {{ t('portfolio.viewProject') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="py-24 bg-secondary tech-particles blog-section">
      <div class="container mx-auto px-6 md:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center mb-20 gap-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-tech-purple/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5M5 14h5m5-4h5M5 8h5" />
              </svg>
            </div>
            <h2 class="tech-title text-4xl md:text-5xl font-bold">
              {{ t('blog.title') }}
            </h2>
          </div>
          <button 
            @click="router.push('/blog')" 
            class="tech-button group"
          >
            {{ t('blog.viewAll') }}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          <div v-if="blogStore.isLoading" v-for="i in 3" :key="i" class="tech-card animate-pulse">
            <div class="h-48 bg-gradient-to-br from-primary to-secondary rounded-t-2xl"></div>
            <div class="p-6">
              <div class="h-6 bg-primary rounded w-3/4 mb-4"></div>
              <div class="h-4 bg-primary rounded w-full mb-2"></div>
              <div class="h-4 bg-primary rounded w-5/6 mb-6"></div>
              <div class="h-10 bg-primary rounded w-full"></div>
            </div>
          </div>
          
          <div v-else-if="blogStore.posts.length > 0" v-for="post in blogStore.posts.slice(0, 3)" :key="post.id" class="tech-card group cursor-pointer" @click="router.push(`/blog/${post.id}`)">
            <div class="h-48 relative overflow-hidden rounded-t-2xl">
              <img 
                v-if="post.coverImage" 
                :src="post.coverImage" 
                :alt="post.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5M5 14h5m5-4h5M5 8h5" />
                </svg>
              </div>
              <div class="absolute top-4 right-4 bg-gradient-to-r from-accent to-tech-purple text-white text-xs px-3 py-1 rounded-full font-semibold">
                {{ new Date(post.date).toLocaleDateString() }}
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-3 text-text-primary group-hover:text-accent transition-colors">{{ post.title }}</h3>
              <p class="text-text-secondary mb-6 line-clamp-3" v-html="formatDescription(post.excerpt, 150)"></p>
              <div class="flex items-center text-accent font-semibold group-hover:text-tech-purple transition-colors">
                {{ t('blog.readMore') }}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H6" />
                </svg>
              </div>
            </div>
          </div>
          
          <div v-else class="col-span-3 text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 mx-auto text-text-secondary mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5M5 14h5m5-4h5M5 8h5" />
            </svg>
            <h3 class="text-2xl font-bold text-text-primary mb-3">{{ t('blog.noPosts') }}</h3>
            <p class="text-text-secondary text-lg">{{ t('blog.checkBack') }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-section {
  position: relative;
  overflow: hidden;
  padding: 8rem 0;
  background: linear-gradient(135deg, rgba(var(--bg-primary-rgb), 0.95), rgba(var(--bg-primary-rgb), 1)),
              radial-gradient(circle at 20% 80%, rgba(var(--accent-rgb), 0.08), transparent 30%),
              radial-gradient(circle at 80% 20%, rgba(var(--accent-rgb), 0.08), transparent 30%);
  backdrop-filter: blur(10px);
  min-height: 100vh;
  display: flex;
  align-items: center;
  z-index: 1;
}

.light .hero-section {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95)),
              radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.08), transparent 30%),
              radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.08), transparent 30%);
}

.hero-section > * {
  position: relative;
  z-index: 2;
}
/* ===== PROFESSION TITLE ===== */
.profession-container {
  position: relative;
  z-index: 10;
}


.dark .profession-highlight {
  color: transparent !important;
  background-image: linear-gradient(135deg, var(--accent), var(--accent-light)) !important;
  background-clip: text !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  text-shadow: 0 0 20px rgba(var(--accent-rgb), 0.3) !important;
}

.light .profession-highlight {
  color: var(--accent-dark) !important;
  text-shadow: 0 0 3px rgba(var(--accent-rgb), 0.2) !important;
}


/* ===== EXPERIENCE BADGE ===== */
.experience-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, var(--accent), var(--accent-light)) !important;
  color: white !important;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 700;
  box-shadow: 0 6px 20px rgba(var(--accent-rgb), 0.4);
  animation: bounce 2s infinite;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  z-index: 10;
}

.experience-badge::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { left: -100%; }
  50%, 100% { left: 100%; }
}

/* ===== PROFILE SECTION ===== */
.profile-section {
  position: relative;
  z-index: 10;
}

.profile-picture-container {
  position: relative;
  width: 280px;
  height: 280px;
  margin: 0 auto;
}

.profile-picture-inner {
  width: 240px;
  height: 240px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 8px rgba(var(--accent-rgb), 0.1);
  border: 5px solid var(--accent);
  animation: profile-appear 1s ease-out forwards, profile-float 4s ease-in-out infinite 1s;
  transition: all 0.3s ease;
}

.light .profile-picture-inner {
  box-shadow: 0 20px 60px rgba(139, 92, 246, 0.2), 0 0 0 8px rgba(139, 92, 246, 0.1);
  border: 5px solid var(--accent);
}

.profile-picture-inner:hover {
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.4), 0 0 0 12px rgba(var(--accent-rgb), 0.15);
  transform: translate(-50%, -50%) scale(1.05);
}

.profile-picture {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ===== DECORATIVE ELEMENTS (BACKGROUND) ===== */
.profile-decoration {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(var(--accent-rgb), 0.1), transparent);
  opacity: 0.5;
  animation: float 10s ease-in-out infinite;
  z-index: 0;
  pointer-events: none;
}

.profile-decoration.circle-1 {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.profile-decoration.circle-2 {
  top: 50%;
  right: 10%;
  animation-delay: 2s;
}

.profile-decoration.circle-3 {
  bottom: 10%;
  left: 50%;
  animation-delay: 4s;
}

.profile-decoration::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 16px;
  background-color: var(--accent);
  border-radius: 50%;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes profile-appear {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes profile-float {
  0%, 100% {
    transform: translate(-50%, -50%);
  }
  50% {
    transform: translate(-50%, -60%);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* ===== HERO TEXT CONTENT ===== */
.hero-description {
  color: var(--text-secondary) !important;
  line-height: 1.8;
  font-size: 1.125rem;
  letter-spacing: 0.01em;
  position: relative;
  z-index: 10;
}

.hero-cta {
  margin-top: 2rem;
  position: relative;
  z-index: 100;
}

.hero-cta button {
  position: relative;
  z-index: 100;
  cursor: pointer;
  pointer-events: auto;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  font-weight: 700;
  font-size: 1.125rem;
  text-align: center;
  border-radius: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.cta-button:hover::before {
  width: 300px;
  height: 300px;
}

.cta-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
}

.primary-button {
  background: linear-gradient(135deg, var(--accent), var(--accent-light));
  color: white;
  border: none;
}

.primary-button:hover {
  box-shadow: 0 12px 30px rgba(var(--accent-rgb), 0.4);
}

.secondary-button {
  background-color: transparent;
  color: var(--accent);
  border: 2px solid var(--accent);
  backdrop-filter: blur(10px);
}

.secondary-button:hover {
  background-color: var(--accent);
  color: white;
  border-color: var(--accent);
}

/* ===== SKILL ITEMS ===== */
.skill-item {
  transition: transform 0.3s ease, opacity 0.3s ease;
  position: relative;
  z-index: 2;
}

.skill-icon {
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  backdrop-filter: blur(10px);
}

.skill-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(var(--accent-rgb), 0.15), transparent);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.skill-item:hover .skill-icon {
  border-color: var(--accent);
  box-shadow: 0 8px 25px rgba(var(--accent-rgb), 0.3);
}

.skill-item:hover .skill-icon::before {
  opacity: 1;
}

.skill-name {
  transition: color 0.3s ease;
}

.skill-item:hover .skill-name {
  color: var(--accent);
}

/* ===== SKILLS SECTION ===== */
.skills-section {
  position: relative;
  overflow: hidden;
  border-radius: 0;
  box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.08);
  background: linear-gradient(180deg, var(--bg-secondary), rgba(var(--bg-secondary-rgb), 0.95));
  z-index: 1;
}

.light .skills-section {
  background: linear-gradient(180deg, #f5f7ff, rgba(245, 247, 255, 0.95));
  box-shadow: 0 -4px 30px rgba(139, 92, 246, 0.08);
}

.tech-title {
  letter-spacing: -0.02em;
  line-height: 1.2;
  position: relative;
  z-index: 2;
}

.skills-filter {
  position: relative;
  z-index: 10;
}

.skills-filter button {
  position: relative;
  overflow: hidden;
  z-index: 10;
  cursor: pointer;
  pointer-events: auto;
}

.skills-filter button::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
  pointer-events: none;
  z-index: -1;
}

.skills-filter button:hover::after {
  left: 100%;
}

.skills-grid {
  padding: 1rem;
}

/* ===== TRANSITIONS ===== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ===== PROJECT CAROUSEL ===== */
.project-image-carousel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1 !important;
}

.carousel-images {
  display: flex;
  transition: transform 0.3s ease;
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-images img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-controls {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.project-card:hover .carousel-controls {
  opacity: 1;
}

.carousel-indicator {
  transition: background-color 0.2s ease;
}

/* ===== BACKGROUND DECORATIVE ELEMENTS ===== */
.hero-bg-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0 !important;
  pointer-events: none;
}

.floating-circle {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: var(--accent);
  opacity: 0.1;
  animation: float 10s linear infinite;
  z-index: 0 !important;
  pointer-events: none;
}

.circle-1 {
  top: 20%;
  left: 30%;
  animation-delay: 2s;
}

.circle-2 {
  top: 50%;
  left: 70%;
  animation-delay: 4s;
}

.circle-3 {
  top: 80%;
  left: 10%;
  animation-delay: 6s;
}

.floating-square {
  position: absolute;
  width: 150px;
  height: 150px;
  background-color: var(--accent);
  opacity: 0.1;
  animation: float 10s linear infinite;
  z-index: 0 !important;
  pointer-events: none;
}

.square-1 {
  top: 10%;
  left: 50%;
  animation-delay: 1s;
}

.square-2 {
  top: 40%;
  left: 20%;
  animation-delay: 3s;
}

/* ===== KEYFRAME ANIMATIONS ===== */
@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}

.profile-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.particle {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--accent);
  opacity: 0.5;
  animation: particle 5s linear infinite;
}

@keyframes particle {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, 20px);
  }
  100% {
    transform: translate(0, 0);
  }
}

.animate-profile {
  animation: profile-appear 1s ease-out forwards;
}

.animate-title {
  animation: title-appear 1s ease-out forwards;
}

.animate-badge {
  animation: badge-appear 1s ease-out forwards;
}

.animate-description {
  animation: description-appear 1s ease-out forwards;
}

.animate-button {
  animation: button-appear 1s ease-out forwards;
}

@keyframes profile-appear {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes title-appear {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes badge-appear {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes description-appear {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes button-appear {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== ENHANCED SECTIONS ===== */
.project-section,
.blog-section {
  position: relative;
  overflow: hidden;
}

.project-section::before,
.blog-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), var(--tech-purple), var(--accent), transparent);
  opacity: 0.3;
}

.light .project-section,
.light .blog-section {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95));
}

/* ===== ENHANCED TECH PULSE ===== */
.tech-pulse {
  animation: tech-pulse-animation 2s ease-in-out infinite;
}

@keyframes tech-pulse-animation {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(var(--accent-rgb), 0.3);
  }
  50% {
    box-shadow: 0 4px 25px rgba(var(--accent-rgb), 0.5), 0 0 30px rgba(var(--tech-purple-rgb), 0.3);
  }
}

/* ===== RESPONSIVE IMPROVEMENTS ===== */
@media (max-width: 768px) {
  .hero-section {
    padding: 4rem 0;
    min-height: auto;
  }
  
  .profile-picture-container {
    width: 200px;
    height: 200px;
  }
  
  .profile-picture-inner {
    width: 180px;
    height: 180px;
  }
  
  .tech-title {
    font-size: 2rem !important;
  }
  
  .hero-description {
    font-size: 1rem !important;
  }
}
</style>
