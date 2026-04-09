<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Project } from '../store/portfolioStore'
import gsap from 'gsap'
import { portfolioService } from '../services/portfolioService'
import ProjectCard from '../components/portfolio/ProjectCard.vue'
import { formatDescription } from '@/utils/textFormatters'

const { t } = useI18n()

const isLoading = ref(true)
const selectedCategory = ref('')
const selectedProjectType = ref<'all' | 'work' | 'personal'>('all')
const selectedPlatformType = ref<'all' | 'web' | 'mobile' | 'desktop' | 'script' | 'api'>('all')
const searchQuery = ref('')
const projects = ref<Project[]>([])
const showDetailsModal = ref(false)
const selectedProject = ref<Project | null>(null)
const detailsCarouselIndex = ref(0)
const detailsCarouselInterval = ref<number | null>(null)

const tagsPerPage = 10
const showAllTags = ref(false)
const displayedTagsCount = ref(tagsPerPage)

const currentPage = ref(1)
const projectsPerPage = 6

const layoutMode = ref<'grid' | 'masonry' | 'list'>('grid')

const categories = computed(() => {
  const allTechnologies = projects.value.flatMap(project => project.technologies)
  return [...new Set(allTechnologies)].sort()
})

const filteredTags = computed(() => {
  const allTags = categories.value
  const initialTags = showAllTags.value ? allTags : allTags.slice(0, tagsPerPage)
  return initialTags
})

function toggleShowAllTags() {
  showAllTags.value = !showAllTags.value
}

function getProjectImages(project: Project): string[] {
  if (project.imageUrl) {
    if (Array.isArray(project.imageUrl)) {
      return project.imageUrl;
    }
    return [project.imageUrl];
  }
  return [];
}

function viewProjectDetails(projectId: string) {
  const project = projects.value.find(p => p.id === projectId)
  if (project) {
    selectedProject.value = project
    detailsCarouselIndex.value = 0
    showDetailsModal.value = true
    
    startDetailsCarousel()
  }
}

function closeDetailsModal() {
  showDetailsModal.value = false
  selectedProject.value = null
  stopDetailsCarousel()
}

function nextDetailsImage() {
  if (!selectedProject.value) return
  const images = getProjectImages(selectedProject.value)
  if (images.length <= 1) return
  detailsCarouselIndex.value = (detailsCarouselIndex.value + 1) % images.length
}

function prevDetailsImage() {
  if (!selectedProject.value) return
  const images = getProjectImages(selectedProject.value)
  if (images.length <= 1) return
  detailsCarouselIndex.value = (detailsCarouselIndex.value - 1 + images.length) % images.length
}

function startDetailsCarousel() {
  stopDetailsCarousel()
  
  if (selectedProject.value) {
    const images = getProjectImages(selectedProject.value)
    if (images.length > 1) {
      detailsCarouselInterval.value = window.setInterval(() => {
        nextDetailsImage()
      }, 5000)
    }
  }
}

function stopDetailsCarousel() {
  if (detailsCarouselInterval.value) {
    clearInterval(detailsCarouselInterval.value)
    detailsCarouselInterval.value = null
  }
}

onMounted(async () => {
  try {
    isLoading.value = true
    projects.value = await portfolioService.getProjects()
  } catch (error) {
    console.error('Error fetching projects:', error)
  } finally {
    isLoading.value = false
    
    const tl = gsap.timeline()
    
    tl.from('.portfolio-header', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    })
    .from('.filter-container', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out'
    }, '-=0.3')
    .from('.project-card', {
      y: 30,
      opacity: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: 'power2.out'
    }, '-=0.2')
  }
})

onUnmounted(() => {
  stopDetailsCarousel()
})

const filteredProjects = computed(() => {
  let result = projects.value
  
  if (selectedProjectType.value !== 'all') {
    result = result.filter(project => 
      project.projectType === selectedProjectType.value
    )
  }
  
  if (selectedPlatformType.value !== 'all') {
    result = result.filter(project => 
      project.platformType === selectedPlatformType.value
    )
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(project => 
      project.title.toLowerCase().includes(query) || 
      project.description.toLowerCase().includes(query) ||
      project.technologies.some(tech => tech.toLowerCase().includes(query))
    )
  }
  
  if (selectedCategory.value) {
    result = result.filter(project => 
      project.technologies.includes(selectedCategory.value)
    )
  }
  
  return result
})

const totalPages = computed(() => {
  return Math.ceil(filteredProjects.value.length / projectsPerPage)
})

const paginatedProjects = computed(() => {
  const startIndex = (currentPage.value - 1) * projectsPerPage
  const endIndex = startIndex + projectsPerPage
  return filteredProjects.value.slice(startIndex, endIndex)
})

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

function selectCategory(category: string) {
  if (selectedCategory.value === category) {
    selectedCategory.value = ''
  } else {
    selectedCategory.value = category
  }
  currentPage.value = 1
}

function updateSearch(value: string) {
  searchQuery.value = value
  currentPage.value = 1
}
</script>

<template>
  <div class="min-h-screen py-12 md:py-20 bg-gradient-to-b from-primary to-secondary tech-grid-bg">
    <div class="container mx-auto px-4 sm:px-6 md:px-8">
      <div class="portfolio-header mb-12 md:mb-20 text-center">
        <h1 class="tech-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8">
          {{ t('portfolio.title') }}
        </h1>
        <p class="text-base sm:text-lg md:text-xl lg:text-2xl text-text-secondary max-w-4xl mx-auto leading-relaxed">
          {{ t('portfolio.subtitle') }}
        </p>
        <div class="w-24 md:w-32 h-1.5 bg-gradient-to-r from-accent to-tech-purple mx-auto mt-6 md:mt-8 rounded-full shadow-lg shadow-accent/30"></div>
      </div>
      
      <div class="filter-container mb-16">
        <!-- Project Type Filter -->
        <div class="mb-10 flex justify-center gap-5 flex-wrap">
          <button
            @click="selectedProjectType = 'all'; currentPage = 1"
            class="tech-button px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 tech-glow"
            :class="selectedProjectType === 'all' ? 'bg-gradient-to-r from-accent to-tech-purple text-white' : 'bg-secondary text-text-secondary hover:bg-accent/20'"
          >
            <i class="fas fa-th mr-2"></i>{{ t('portfolio.allProjects') }}
          </button>
          <button
            @click="selectedProjectType = 'work'; currentPage = 1"
            class="tech-button px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 tech-glow"
            :class="selectedProjectType === 'work' ? 'bg-gradient-to-r from-accent to-tech-purple text-white' : 'bg-secondary text-text-secondary hover:bg-accent/20'"
          >
            <i class="fas fa-briefcase mr-2"></i>{{ t('portfolio.workProjects') }}
          </button>
          <button
            @click="selectedProjectType = 'personal'; currentPage = 1"
            class="tech-button px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 tech-glow"
            :class="selectedProjectType === 'personal' ? 'bg-gradient-to-r from-accent to-tech-purple text-white' : 'bg-secondary text-text-secondary hover:bg-accent/20'"
          >
            <i class="fas fa-user mr-2"></i>{{ t('portfolio.personalProjects') }}
          </button>
        </div>
        
        <!-- Platform Type Filter -->
        <div class="mb-10 flex justify-center gap-4 flex-wrap">
          <button
            @click="selectedPlatformType = 'all'; currentPage = 1"
            class="tech-button px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105"
            :class="selectedPlatformType === 'all' ? 'bg-gradient-to-r from-accent/80 to-tech-purple/80 text-white' : 'bg-secondary/50 text-text-secondary hover:bg-accent/10'"
          >
            <i class="fas fa-layer-group mr-2"></i>{{ t('portfolio.allPlatforms') }}
          </button>
          <button
            @click="selectedPlatformType = 'web'; currentPage = 1"
            class="tech-button px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105"
            :class="selectedPlatformType === 'web' ? 'bg-gradient-to-r from-accent/80 to-tech-purple/80 text-white' : 'bg-secondary/50 text-text-secondary hover:bg-accent/10'"
          >
            <i class="fas fa-globe mr-2"></i>{{ t('portfolio.webProjects') }}
          </button>
          <button
            @click="selectedPlatformType = 'mobile'; currentPage = 1"
            class="tech-button px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105"
            :class="selectedPlatformType === 'mobile' ? 'bg-gradient-to-r from-accent/80 to-tech-purple/80 text-white' : 'bg-secondary/50 text-text-secondary hover:bg-accent/10'"
          >
            <i class="fas fa-mobile-alt mr-2"></i>{{ t('portfolio.mobileProjects') }}
          </button>
          <button
            @click="selectedPlatformType = 'desktop'; currentPage = 1"
            class="tech-button px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105"
            :class="selectedPlatformType === 'desktop' ? 'bg-gradient-to-r from-accent/80 to-tech-purple/80 text-white' : 'bg-secondary/50 text-text-secondary hover:bg-accent/10'"
          >
            <i class="fas fa-desktop mr-2"></i>{{ t('portfolio.desktopProjects') }}
          </button>
          <button
            @click="selectedPlatformType = 'script'; currentPage = 1"
            class="tech-button px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105"
            :class="selectedPlatformType === 'script' ? 'bg-gradient-to-r from-accent/80 to-tech-purple/80 text-white' : 'bg-secondary/50 text-text-secondary hover:bg-accent/10'"
          >
            <i class="fas fa-terminal mr-2"></i>{{ t('portfolio.scriptProjects') }}
          </button>
          <button
            @click="selectedPlatformType = 'api'; currentPage = 1"
            class="tech-button px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105"
            :class="selectedPlatformType === 'api' ? 'bg-gradient-to-r from-accent/80 to-tech-purple/80 text-white' : 'bg-secondary/50 text-text-secondary hover:bg-accent/10'"
          >
            <i class="fas fa-server mr-2"></i>{{ t('portfolio.apiProjects') }}
          </button>
        </div>
        
        <div class="flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div class="md:w-1/3">
            <div class="relative">
              <div class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                :value="searchQuery"
                @input="updateSearch(($event.target as HTMLInputElement).value)"
                type="text" 
                class="tech-input w-full rounded-xl py-3 pr-4 pl-14 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300 shadow-lg"
                :placeholder="t('portfolio.searchPlaceholder')"
              />
            </div>
          </div>
          
          <!-- 佈局切換按鈕 -->
          <div class="flex items-center gap-2">
            <span class="text-sm tech-text-secondary mr-2">{{ t('portfolio.layout') }}:</span>
            <div class="flex bg-secondary rounded-xl p-1">
              <button
                @click="layoutMode = 'grid'"
                class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                :class="layoutMode === 'grid' ? 'bg-accent text-white shadow-lg' : 'text-text-secondary hover:text-accent'"
                title="Grid Layout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                @click="layoutMode = 'masonry'"
                class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                :class="layoutMode === 'masonry' ? 'bg-accent text-white shadow-lg' : 'text-text-secondary hover:text-accent'"
                title="Masonry Layout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </button>
              <button
                @click="layoutMode = 'list'"
                class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                :class="layoutMode === 'list' ? 'bg-accent text-white shadow-lg' : 'text-text-secondary hover:text-accent'"
                title="List Layout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="category in filteredTags" 
              :key="category"
              @click="selectCategory(category)"
              class="tech-button px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 tech-glow"
              :class="selectedCategory === category ? 'bg-gradient-to-r from-accent to-tech-purple text-white shadow-lg' : 'bg-secondary text-text-secondary hover:bg-accent/20 hover:text-accent'"
            >
              {{ category }}
            </button>
            
            <button 
              v-if="categories.length > tagsPerPage"
              @click="toggleShowAllTags"
              class="px-3 py-1.5 rounded-lg text-sm bg-secondary text-accent hover:bg-accent/10 transition-colors flex items-center"
            >
              <span v-if="!showAllTags">{{ t('portfolio.showMore') }} ({{ categories.length - tagsPerPage }})</span>
              <span v-else>{{ t('portfolio.showLess') }}</span>
              <svg v-if="!showAllTags" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        <div v-for="i in 6" :key="i" class="tech-card animate-pulse border border-accent/10">
          <div class="h-48 bg-gradient-to-br from-secondary to-primary rounded-t-2xl"></div>
          <div class="p-6">
            <div class="h-6 bg-secondary rounded w-3/4 mb-4"></div>
            <div class="h-4 bg-secondary rounded w-full mb-2"></div>
            <div class="h-4 bg-secondary rounded w-full mb-2"></div>
            <div class="h-4 bg-secondary rounded w-5/6 mb-6"></div>
            <div class="flex gap-2 mb-4">
              <div v-for="j in 3" :key="j" class="h-6 bg-secondary rounded px-3"></div>
            </div>
            <div class="h-10 bg-secondary rounded w-full"></div>
          </div>
        </div>
      </div>
      
      <!-- 項目顯示區域 -->
      <div v-else-if="filteredProjects.length > 0" class="mb-16 max-w-7xl mx-auto">
        <!-- 網格佈局 -->
        <div v-if="layoutMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProjectCard 
            v-for="project in paginatedProjects" 
            :key="project.id"
            :project="project"
            @view-details="viewProjectDetails"
          />
        </div>
        
        <!-- 瀑布流佈局 -->
        <div v-else-if="layoutMode === 'masonry'" class="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          <div v-for="project in paginatedProjects" :key="project.id" class="break-inside-avoid">
            <ProjectCard 
              :project="project"
              @view-details="viewProjectDetails"
            />
          </div>
        </div>
        
        <!-- 列表佈局 -->
        <div v-else-if="layoutMode === 'list'" class="space-y-6">
          <div 
            v-for="project in paginatedProjects" 
            :key="project.id"
            class="tech-card overflow-hidden group hover:scale-[1.02] transition-all duration-300"
          >
            <div class="flex flex-col md:flex-row">
              <!-- 圖片區域 -->
              <div class="md:w-80 h-48 md:h-auto bg-gradient-to-br from-secondary to-primary relative overflow-hidden">
                <div v-if="getProjectImages(project).length > 0" class="h-full w-full relative">
                  <img 
                    :src="getProjectImages(project)[0]" 
                    :alt="project.title" 
                    class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div v-else class="h-full w-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center tech-text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                
                <!-- 特色標籤 -->
                <div v-if="project.featured" class="absolute top-3 right-3">
                  <div class="bg-gradient-to-r from-accent to-tech-purple text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg tech-glow">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Featured
                  </div>
                </div>
              </div>
              
              <!-- 內容區域 -->
              <div class="flex-1 p-6">
                <div class="flex flex-col h-full">
                  <div class="mb-4">
                    <h3 class="text-2xl font-bold mb-2 tech-text-primary group-hover:text-accent transition-colors duration-300">
                      {{ project.title }}
                    </h3>
                    <div class="flex items-center gap-4 text-sm tech-text-secondary mb-3">
                      <div class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{{ project.platformType || 'Web' }} Project</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span>{{ project.projectType || 'Project' }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p class="text-text-secondary mb-6 leading-relaxed flex-grow" v-html="formatDescription(project.description, 200)"></p>
                  
                  <!-- 技術標籤 -->
                  <div class="mb-6">
                    <div class="flex flex-wrap gap-2">
                      <span 
                        v-for="tech in project.technologies.slice(0, 6)" 
                        :key="tech"
                        class="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-accent/10 to-tech-purple/10 text-accent border border-accent/20 hover:border-accent/40 transition-all duration-300 font-medium hover:scale-105"
                      >
                        {{ tech }}
                      </span>
                      <span v-if="project.technologies.length > 6" class="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-accent/10 to-tech-purple/10 text-accent border border-accent/20 hover:border-accent/40 transition-all duration-300 font-medium hover:scale-105">
                        +{{ project.technologies.length - 6 }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- 操作按鈕 -->
                  <div class="flex gap-3">
                    <a 
                      v-if="project.liveUrl"
                      :href="project.liveUrl" 
                      target="_blank"
                      class="tech-button inline-flex justify-center items-center gap-2 px-6 py-2.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Live Demo
                    </a>
                    <a 
                      v-if="project.codeUrl"
                      :href="project.codeUrl" 
                      target="_blank"
                      class="tech-button tech-button-outline inline-flex justify-center items-center gap-2 px-6 py-2.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      View Code
                    </a>
                    <button 
                      v-if="!project.liveUrl && !project.codeUrl"
                      class="tech-button inline-flex justify-center items-center gap-2 px-6 py-2.5"
                      @click="viewProjectDetails(project.id)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-xl font-semibold text-text-primary mb-2">{{ t('portfolio.noResults') }}</h3>
        <p class="text-text-secondary">{{ t('portfolio.tryDifferentSearch') }}</p>
        <button 
          @click="selectedCategory = ''; searchQuery = ''; currentPage = 1" 
          class="mt-4 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors"
        >
          {{ t('portfolio.clearFilters') }}
        </button>
      </div>
      
      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="flex justify-center mt-20">
        <div class="flex items-center space-x-4 bg-secondary p-5 rounded-2xl shadow-2xl border border-accent/20">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="tech-button px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
            :class="{'opacity-50 cursor-not-allowed': currentPage === 1, 'hover:bg-accent hover:text-white hover:shadow-lg': currentPage !== 1}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div class="flex space-x-2">
            <button 
              v-for="page in totalPages" 
              :key="page"
              @click="goToPage(page)"
              class="tech-button w-12 h-12 flex items-center justify-center rounded-xl font-semibold transition-all duration-300 transform hover:scale-110"
              :class="currentPage === page ? 'bg-gradient-to-r from-accent to-tech-purple text-white shadow-2xl' : 'bg-primary text-text-primary hover:bg-accent/20'"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="tech-button px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
            :class="{'opacity-50 cursor-not-allowed': currentPage === totalPages, 'hover:bg-accent hover:text-white hover:shadow-lg': currentPage !== totalPages}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <div v-if="showDetailsModal && selectedProject" class="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm" @click.self="closeDetailsModal">
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="fixed inset-0 bg-black/80 transition-opacity" @click="closeDetailsModal"></div>
      
      <div class="tech-card max-w-5xl w-full mx-auto z-10 overflow-hidden relative border-2 border-accent/30 shadow-2xl shadow-accent/20">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent"></div>
        <button 
          @click="closeDetailsModal" 
          class="absolute top-6 right-6 text-text-secondary hover:text-accent z-20 tech-button p-3 transition-all duration-300 hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div class="h-64 sm:h-80 md:h-96 bg-gray-800 relative overflow-hidden"
             @mouseenter="stopDetailsCarousel" 
             @mouseleave="startDetailsCarousel">
          <div v-if="selectedProject.imageUrl" class="h-full w-full">
            <transition-group name="fade" tag="div" class="carousel-images h-full w-full relative">
              <img 
                v-for="(imageUrl, index) in getProjectImages(selectedProject)"
                :key="`details-img-${index}`"
                v-show="detailsCarouselIndex === index"
                :src="imageUrl" 
                :alt="`${selectedProject.title} - Image ${index + 1}`"
                class="w-full h-full object-cover absolute top-0 left-0 transition-transform duration-500"
              />
            </transition-group>
            
            <div v-if="getProjectImages(selectedProject).length > 1" class="carousel-controls absolute inset-0 flex items-center justify-between">
              <button @click.prevent="prevDetailsImage" class="carousel-control ml-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button @click.prevent="nextDetailsImage" class="carousel-control mr-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div v-if="getProjectImages(selectedProject).length > 1" class="carousel-indicators absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              <button 
                v-for="(_, index) in getProjectImages(selectedProject)"
                :key="`indicator-${index}`"
                @click="detailsCarouselIndex = index"
                class="w-3 h-3 rounded-full focus:outline-none transition-colors"
                :class="index === detailsCarouselIndex ? 'bg-white' : 'bg-white/50'"
              ></button>
            </div>
          </div>
          
          <div v-else class="h-full w-full bg-gray-700 flex items-center justify-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        
        <div class="p-10">
          <h2 class="tech-title text-4xl font-bold mb-6">{{ selectedProject.title }}</h2>
          
          <div class="mb-10">
            <p class="text-text-secondary text-lg leading-relaxed" v-html="formatDescription(selectedProject.description)"></p>
          </div>
          
          <div class="mb-10">
            <h3 class="text-2xl font-bold mb-6 text-accent flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              {{ t('portfolio.technologies') }}
            </h3>
            <div class="flex flex-wrap gap-3 tag-container">
              <span 
                v-for="(tech, index) in selectedProject.technologies" 
                :key="tech"
                v-show="index < displayedTagsCount || showAllTags"
                class="px-4 py-2 rounded-xl bg-gradient-to-br from-accent/20 to-tech-purple/20 text-accent text-sm font-semibold border border-accent/30 hover:border-accent/50 transition-all duration-300 hover:scale-105 tag-item"
              >
                {{ tech }}
              </span>
              
              <button 
                v-if="selectedProject.technologies.length > displayedTagsCount"
                @click="showAllTags = !showAllTags"
                class="px-3 py-1 rounded-full bg-primary/70 text-accent text-sm hover:bg-primary transition-colors flex items-center"
              >
                <span v-if="!showAllTags">{{ t('portfolio.showMore') }} ({{ selectedProject.technologies.length - displayedTagsCount }})</span>
                <span v-else>{{ t('portfolio.showLess') }}</span>
                <svg v-if="!showAllTags" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div class="flex gap-4 mt-8">
            <a 
              v-if="selectedProject.liveUrl"
              :href="selectedProject.liveUrl" 
              target="_blank"
              class="flex-1 tech-button inline-flex justify-center items-center px-6 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 tech-glow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {{ t('portfolio.viewLive') }}
            </a>
            <a 
              v-if="selectedProject.codeUrl"
              :href="selectedProject.codeUrl" 
              target="_blank"
              class="flex-1 inline-flex justify-center items-center px-6 py-4 border-2 border-accent text-accent hover:bg-accent hover:text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 text-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              {{ t('portfolio.viewCode') }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-image-carousel {
  position: relative;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.carousel-controls {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.carousel-controls:hover {
  opacity: 1;
}

.filter-button {
  @apply px-3 py-1 rounded-full text-sm font-medium transition-colors;
}

.filter-button.active {
  @apply bg-accent text-white;
}

.filter-button:not(.active) {
  @apply bg-primary text-text-secondary hover:bg-accent hover:text-white;
}

.search-input {
  @apply bg-primary border-0 rounded-full px-4 py-2 text-text-primary focus:ring-2 focus:ring-accent focus:outline-none w-full;
}

.project-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
}

.tag-container {
  position: relative;
}

.tag-item {
  transition: all 0.3s ease;
}
</style>
