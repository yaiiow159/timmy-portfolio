<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Project } from '../store/portfolioStore'
import gsap from 'gsap'
import { portfolioService } from '../services/portfolioService'
import ProjectCard from '../components/portfolio/ProjectCard.vue'

const { t } = useI18n()

const isLoading = ref(true)
const selectedCategory = ref('')
const searchQuery = ref('')
const projects = ref<Project[]>([])
const showDetailsModal = ref(false)
const selectedProject = ref<Project | null>(null)
const detailsCarouselIndex = ref(0)

function viewProjectDetails(projectId: string) {
  const project = projects.value.find(p => p.id === projectId)
  if (project) {
    selectedProject.value = project
    detailsCarouselIndex.value = 0
    showDetailsModal.value = true
  }
}

function closeDetailsModal() {
  showDetailsModal.value = false
  selectedProject.value = null
}

function nextDetailsImage() {
  if (!selectedProject.value || !selectedProject.value.imageUrls || selectedProject.value.imageUrls.length <= 1) return
  detailsCarouselIndex.value = (detailsCarouselIndex.value + 1) % selectedProject.value.imageUrls.length
}

function prevDetailsImage() {
  if (!selectedProject.value || !selectedProject.value.imageUrls || selectedProject.value.imageUrls.length <= 1) return
  detailsCarouselIndex.value = (detailsCarouselIndex.value - 1 + selectedProject.value.imageUrls.length) % selectedProject.value.imageUrls.length
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

const categories = computed(() => {
  const allTechnologies = projects.value.flatMap(project => project.technologies)
  return [...new Set(allTechnologies)].sort()
})

const filteredProjects = computed(() => {
  let result = projects.value
  
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

function selectCategory(category: string) {
  if (selectedCategory.value === category) {
    selectedCategory.value = ''
  } else {
    selectedCategory.value = category
  }
}
</script>

<template>
  <div class="min-h-screen py-12">
    <div class="container mx-auto px-4">
      <div class="portfolio-header mb-12 text-center">
        <h1 class="text-4xl font-bold mb-4 text-text-primary">{{ t('portfolio.title') }}</h1>
        <p class="text-lg text-text-secondary max-w-2xl mx-auto">
          {{ t('portfolio.subtitle') }}
        </p>
      </div>
      
      <div class="filter-container mb-12">
        <div class="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div class="md:w-1/3">
            <div class="relative">
              <input 
                v-model="searchQuery"
                type="text" 
                class="w-full bg-secondary border border-gray-700 rounded-lg py-3 px-4 pl-10 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                :placeholder="t('portfolio.searchPlaceholder')"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-3.5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="category in categories" 
              :key="category"
              @click="selectCategory(category)"
              class="px-3 py-1.5 rounded-lg text-sm transition-colors"
              :class="selectedCategory === category ? 'bg-accent text-white' : 'bg-secondary text-text-secondary hover:bg-accent/20 hover:text-accent'"
            >
              {{ category }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 6" :key="i" class="bg-secondary rounded-lg overflow-hidden shadow-lg animate-pulse">
          <div class="h-48 bg-gray-700"></div>
          <div class="p-6">
            <div class="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div class="h-4 bg-gray-700 rounded w-full mb-2"></div>
            <div class="h-4 bg-gray-700 rounded w-full mb-2"></div>
            <div class="h-4 bg-gray-700 rounded w-5/6 mb-6"></div>
            <div class="flex gap-2 mb-4">
              <div v-for="j in 3" :key="j" class="h-6 bg-gray-700 rounded px-3"></div>
            </div>
            <div class="h-10 bg-gray-700 rounded w-full"></div>
          </div>
        </div>
      </div>
      
      <div v-else-if="filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProjectCard 
          v-for="project in filteredProjects" 
          :key="project.id"
          :project="project"
          @view-details="viewProjectDetails"
        />
      </div>

      <div v-else class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-xl font-semibold text-text-primary mb-2">{{ t('portfolio.noResults') }}</h3>
        <p class="text-text-secondary">{{ t('portfolio.tryDifferentSearch') }}</p>
        <button 
          @click="selectedCategory = ''; searchQuery = ''" 
          class="mt-4 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors"
        >
          {{ t('portfolio.clearFilters') }}
        </button>
      </div>
    </div>
  </div>
  
  <!-- Project Details Modal -->
  <div v-if="showDetailsModal && selectedProject" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeDetailsModal">
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="fixed inset-0 bg-black opacity-70 transition-opacity" @click="closeDetailsModal"></div>
      
      <div class="bg-secondary rounded-lg shadow-xl max-w-4xl w-full mx-auto z-10 overflow-hidden relative">
        <button 
          @click="closeDetailsModal" 
          class="absolute top-4 right-4 text-text-secondary hover:text-text-primary z-20 bg-secondary/80 rounded-full p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <!-- Image Carousel -->
        <div class="h-64 sm:h-80 md:h-96 bg-gray-800 relative overflow-hidden">
          <div v-if="selectedProject.imageUrls && selectedProject.imageUrls.length > 0" class="h-full w-full">
            <div class="carousel-images h-full w-full relative" :style="{ transform: `translateX(-${detailsCarouselIndex * 100}%)` }">
              <img 
                v-for="(imageUrl, index) in selectedProject.imageUrls" 
                :key="`details-img-${index}`"
                :src="imageUrl" 
                :alt="`${selectedProject.title} - Image ${index + 1}`"
                class="w-full h-full object-cover absolute top-0 left-0"
                :style="{ left: `${index * 100}%` }"
              />
            </div>
            
            <div v-if="selectedProject.imageUrls.length > 1" class="carousel-controls absolute inset-0 flex items-center justify-between">
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
            
            <div v-if="selectedProject.imageUrls.length > 1" class="carousel-indicators absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              <button 
                v-for="(_, index) in selectedProject.imageUrls" 
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
        
        <!-- Project Details -->
        <div class="p-6">
          <h2 class="text-2xl font-bold mb-2 text-text-primary">{{ selectedProject.title }}</h2>
          
          <div class="mb-6">
            <p class="text-text-secondary">{{ selectedProject.description }}</p>
          </div>
          
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2 text-text-primary">{{ t('portfolio.technologies') }}</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tech in selectedProject.technologies" 
                :key="tech"
                class="px-3 py-1 rounded-full bg-primary text-text-secondary text-sm"
              >
                {{ tech }}
              </span>
            </div>
          </div>
          
          <div class="flex gap-3 mt-6">
            <a 
              v-if="selectedProject.liveUrl"
              :href="selectedProject.liveUrl" 
              target="_blank"
              class="flex-1 inline-flex justify-center items-center px-4 py-2 bg-accent hover:bg-accent-light text-white font-medium rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {{ t('portfolio.viewLive') }}
            </a>
            <a 
              v-if="selectedProject.codeUrl"
              :href="selectedProject.codeUrl" 
              target="_blank"
              class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-white font-medium rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  width: 100%;
  overflow: hidden;
}

.carousel-images {
  display: flex;
  transition: transform 0.3s ease;
  position: relative;
  width: 100%;
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
</style>
