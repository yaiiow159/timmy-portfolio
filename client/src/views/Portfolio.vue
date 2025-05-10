<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Project } from '../store/portfolioStore'
import gsap from 'gsap'
import { portfolioService } from '../services/portfolioService'

const { t } = useI18n()

const isLoading = ref(true)
const selectedCategory = ref('')
const searchQuery = ref('')
const projects = ref<Project[]>([])
const projectCarouselIndices = ref<Record<string, number>>({})

function getProjectCarouselIndex(projectId: string): number {
  return projectCarouselIndices.value[projectId] || 0
}

function setProjectCarouselIndex(projectId: string, index: number): void {
  projectCarouselIndices.value[projectId] = index
}

function nextProjectImage(projectId: string): void {
  const project = projects.value.find(p => p.id === projectId)
  if (!project || !project.imageUrls || project.imageUrls.length <= 1) return
  
  const currentIndex = getProjectCarouselIndex(projectId)
  const nextIndex = (currentIndex + 1) % project.imageUrls.length
  setProjectCarouselIndex(projectId, nextIndex)
}

function prevProjectImage(projectId: string): void {
  const project = projects.value.find(p => p.id === projectId)
  if (!project || !project.imageUrls || project.imageUrls.length <= 1) return
  
  const currentIndex = getProjectCarouselIndex(projectId)
  const prevIndex = (currentIndex - 1 + project.imageUrls.length) % project.imageUrls.length
  setProjectCarouselIndex(projectId, prevIndex)
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
        <div 
          v-for="project in filteredProjects" 
          :key="project.id"
          class="project-card bg-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
        >
          <div class="h-48 bg-gray-700 relative overflow-hidden">
            <!-- Image carousel for multiple images -->
            <div v-if="project.imageUrls && project.imageUrls.length > 0" class="project-image-carousel h-full">
              <div class="carousel-images h-full" :style="{ transform: `translateX(-${getProjectCarouselIndex(project.id) * 100}%)` }">
                <img 
                  v-for="(imageUrl, index) in project.imageUrls" 
                  :key="`${project.id}-img-${index}`"
                  :src="imageUrl" 
                  :alt="`${project.title} - Image ${index + 1}`"
                  class="w-full h-full object-cover absolute top-0 left-0"
                  :style="{ left: `${index * 100}%` }"
                />
              </div>
              
              <div v-if="project.imageUrls.length > 1" class="carousel-controls absolute inset-0 flex items-center justify-between">
                <button @click.prevent="prevProjectImage(project.id)" class="carousel-control carousel-prev ml-2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button @click.prevent="nextProjectImage(project.id)" class="carousel-control carousel-next mr-2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div v-if="project.imageUrls.length > 1" class="carousel-indicators absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                <button 
                  v-for="(_, index) in project.imageUrls" 
                  :key="`${project.id}-indicator-${index}`"
                  @click="setProjectCarouselIndex(project.id, index)"
                  class="carousel-indicator w-2 h-2 rounded-full bg-white/50 hover:bg-white"
                  :class="{ 'bg-white': getProjectCarouselIndex(project.id) === index }"
                ></button>
              </div>
            </div>
            
            <!-- Single image fallback -->
            <template v-else-if="project.imageUrl">
              <img
                v-if="typeof project.imageUrl === 'string'"
                :src="project.imageUrl" 
                :alt="project.title"
                class="w-full h-full object-cover"
              />
              <div v-else-if="Array.isArray(project.imageUrl) && project.imageUrl.length > 0" class="project-image-carousel h-full">
                <div class="carousel-images h-full" :style="{ transform: `translateX(-${getProjectCarouselIndex(project.id) * 100}%)` }">
                  <img 
                    v-for="(url, index) in project.imageUrl" 
                    :key="`${project.id}-img-${index}`"
                    :src="url" 
                    :alt="`${project.title} - Image ${index + 1}`"
                    class="w-full h-full object-cover absolute top-0 left-0"
                    :style="{ left: `${index * 100}%` }"
                  />
                </div>
                
                <div v-if="project.imageUrl.length > 1" class="carousel-controls absolute inset-0 flex items-center justify-between">
                  <button @click.prevent="prevProjectImage(project.id)" class="carousel-control carousel-prev ml-2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button @click.prevent="nextProjectImage(project.id)" class="carousel-control carousel-next mr-2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </template>
            
            <!-- No image placeholder -->
            <div v-else class="h-full w-full bg-gray-700 flex items-center justify-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            <div v-if="project.featured" class="absolute top-2 right-2 bg-accent text-white text-xs px-2 py-1 rounded-full">
              Featured
            </div>
          </div>
          
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2 text-text-primary group-hover:text-accent transition-colors">
              {{ project.title }}
            </h3>
            <p class="text-text-secondary mb-4 line-clamp-3">
              {{ project.description }}
            </p>
            
            <div class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="tech in project.technologies" 
                :key="tech"
                class="text-xs px-2 py-1 rounded-full bg-primary text-text-secondary"
              >
                {{ tech }}
              </span>
            </div>
            
            <div class="flex gap-2">
              <a 
                v-if="project.liveUrl"
                :href="project.liveUrl" 
                target="_blank"
                class="flex-1 inline-flex justify-center items-center px-4 py-2 bg-accent hover:bg-accent-light text-white font-medium rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {{ t('portfolio.viewLive') }}
              </a>
              <a 
                v-if="project.codeUrl"
                :href="project.codeUrl" 
                target="_blank"
                class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-white font-medium rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                {{ t('portfolio.viewCode') }}
              </a>
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
          @click="selectedCategory = ''; searchQuery = ''" 
          class="mt-4 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors"
        >
          {{ t('portfolio.clearFilters') }}
        </button>
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
