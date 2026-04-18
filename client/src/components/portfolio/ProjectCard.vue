<script setup lang="ts">
import type { Project } from '@/store/portfolioStore'
import { ref, onMounted, computed, onUnmounted } from 'vue'

const props = defineProps<{
  project: Project
}>()

const displayTechnologies = computed(() => props.project.technologies.slice(0, 4))
const hasMoreTechnologies = computed(() => props.project.technologies.length > 4)

const projectImages = computed(() => {
  if (!props.project.imageUrl) return []
  return Array.isArray(props.project.imageUrl) 
    ? props.project.imageUrl 
    : [props.project.imageUrl]
})

const currentImageIndex = ref(0)
const carouselInterval = ref<number | null>(null)

const nextImage = () => {
  if (projectImages.value.length <= 1) return
  currentImageIndex.value = (currentImageIndex.value + 1) % projectImages.value.length
}

const prevImage = () => {
  if (projectImages.value.length <= 1) return
  currentImageIndex.value = (currentImageIndex.value - 1 + projectImages.value.length) % projectImages.value.length
}

const startCarousel = () => {
  if (projectImages.value.length > 1) {
    stopCarousel()
    carouselInterval.value = window.setInterval(nextImage, 5000)
  }
}

const stopCarousel = () => {
  if (carouselInterval.value) {
    clearInterval(carouselInterval.value)
    carouselInterval.value = null
  }
}

const getProjectPlainDescription = (description: string) => {
  const plainText = (description || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (plainText.length <= 120) return plainText
  return `${plainText.slice(0, 120)}...`
}

onMounted(startCarousel)
onUnmounted(stopCarousel)
</script>

<template>
  <div class="project-card tech-card overflow-hidden h-full flex flex-col group relative"
       @mouseenter="stopCarousel" 
       @mouseleave="startCarousel">
    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent"></div>
      <div class="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-xl"></div>
    </div>
    
    <div class="h-64 bg-gradient-to-br from-secondary to-primary relative overflow-hidden">
      <div v-if="projectImages.length > 0" class="h-full w-full relative">
        <transition-group name="fade" tag="div" class="h-full w-full">
          <img 
            v-for="(imageUrl, index) in projectImages" 
            :key="imageUrl"
            v-show="index === currentImageIndex"
            :src="imageUrl" 
            :alt="`${project.title} - Image ${index + 1}`" 
            class="h-full w-full object-cover absolute top-0 left-0 transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />
        </transition-group>
        
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div v-if="projectImages.length > 1" class="absolute inset-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 carousel-controls">
          <button @click.prevent="prevImage" class="tech-button p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button @click.prevent="nextImage" class="tech-button p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div v-if="projectImages.length > 1" class="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          <button 
            v-for="(_, index) in projectImages" 
            :key="index"
            @click="currentImageIndex = index"
            class="w-2 h-2 rounded-full transition-all duration-300 focus:outline-none"
            :class="index === currentImageIndex ? 'bg-accent scale-125' : 'bg-white/50 hover:bg-white/80'"
          ></button>
        </div>
      </div>
      <div v-else class="h-full w-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center tech-text-secondary">
        <div class="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p class="text-sm">No Preview</p>
        </div>
      </div>
      
      <div v-if="project.featured" class="absolute top-3 right-3">
        <div class="bg-gradient-to-r from-accent to-tech-purple text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg tech-glow">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Featured
        </div>
      </div>
      
      <div class="absolute top-3 left-3">
        <div class="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full border border-accent/30">
          {{ project.projectType || 'Project' }}
        </div>
      </div>
    </div>
    
    <div class="p-6 flex flex-col flex-grow relative">
      <div class="mb-4">
        <h3 class="text-xl font-bold mb-2 tech-text-primary group-hover:text-accent transition-colors duration-300">
          {{ project.title }}
        </h3>
        <div class="flex items-center gap-2 text-sm tech-text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ project.platformType || 'Web' }} Project</span>
        </div>
      </div>
      
      <p class="text-text-secondary mb-5 line-clamp-3 flex-grow leading-relaxed text-sm">{{ getProjectPlainDescription(project.description) }}</p>
      
      <div class="mb-6">
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="tech in displayTechnologies" 
            :key="tech"
            class="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-accent/10 to-tech-purple/10 text-accent border border-accent/20 hover:border-accent/40 transition-all duration-300 font-medium hover:scale-105"
          >
            {{ tech }}
          </span>
          <span v-if="hasMoreTechnologies" class="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-accent/10 to-tech-purple/10 text-accent border border-accent/20 hover:border-accent/40 transition-all duration-300 font-medium hover:scale-105">
            +{{ project.technologies.length - 4 }}
          </span>
        </div>
      </div>
      
      <div class="flex gap-2 mt-auto">
        <a 
          v-if="project.liveUrl"
          :href="project.liveUrl" 
          target="_blank"
          class="flex-1 tech-button tech-button-sm inline-flex justify-center items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Live
        </a>
        <a 
          v-if="project.codeUrl"
          :href="project.codeUrl" 
          target="_blank"
          class="flex-1 tech-button tech-button-outline tech-button-sm inline-flex justify-center items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Code
        </a>
        <button 
          v-if="!project.liveUrl && !project.codeUrl"
          class="flex-1 tech-button tech-button-sm inline-flex justify-center items-center gap-2"
          @click="$emit('view-details', project.id)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Details
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: scale(1.1);
}

.project-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: rgba(99, 102, 241, 0.3);
}

.tech-button {
  transition: all 0.2s ease;
  padding: 0.5rem 1rem;
  font-weight: 500;
  background: rgba(99, 102, 241, 0.1);
  color: #818cf8;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.tech-button:hover {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.3);
  color: #a5b4fc;
}

.tech-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(99, 102, 241, 0.1);
  color: #a5b4fc;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
}

.tech-badge:hover {
  background: rgba(99, 102, 241, 0.2);
  transform: translateY(-1px);
}

.carousel-controls button {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transition: all 0.2s ease;
}

.carousel-controls button:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.1);
}

.carousel-controls button:active {
  transform: scale(0.95);
}
@media (max-width: 768px) {
  .project-card:hover {
    transform: translateY(-6px) scale(1.01);
  }
  
  .project-card::before {
    display: none;
  }
}
</style>
