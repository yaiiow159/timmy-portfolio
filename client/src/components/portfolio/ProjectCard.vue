<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Project } from '@/store/portfolioStore.ts'
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { formatDescription } from '@/utils/textFormatters'

const { t } = useI18n()

const props = defineProps<{
  project: Project
}>()

const displayTechnologies = props.project.technologies.slice(0, 4)
const hasMoreTechnologies = props.project.technologies.length > 4

const projectImages = computed(() => {
  if (props.project.imageUrls && props.project.imageUrls.length > 0) {
    return props.project.imageUrls;
  }
  else if (props.project.imageUrl) {
    if (typeof props.project.imageUrl === 'string') {
      return [props.project.imageUrl];
    }
    return props.project.imageUrl;
  }

  return [];
});

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

onMounted(() => {
  startCarousel()
})

onUnmounted(() => {
  stopCarousel()
})
</script>

<template>
  <div class="project-card bg-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col group"
       @mouseenter="stopCarousel" 
       @mouseleave="startCarousel">
    <div class="h-48 bg-gray-700 relative overflow-hidden">
      <div v-if="projectImages.length > 0" class="h-full w-full relative">
        <transition-group name="fade" tag="div" class="h-full w-full">
          <img 
            v-for="(imageUrl, index) in projectImages" 
            :key="imageUrl"
            v-show="index === currentImageIndex"
            :src="imageUrl" 
            :alt="`${project.title} - Image ${index + 1}`" 
            class="h-full w-full object-cover absolute top-0 left-0 transition-transform duration-500 group-hover:scale-110"
          />
        </transition-group>
        
        <div v-if="projectImages.length > 1" class="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity carousel-controls">
          <button @click.prevent="prevImage" class="bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button @click.prevent="nextImage" class="bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div v-if="projectImages.length > 1" class="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          <button 
            v-for="(_, index) in projectImages" 
            :key="index"
            @click="currentImageIndex = index"
            class="w-2 h-2 rounded-full transition-colors focus:outline-none"
            :class="index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'"
          ></button>
        </div>
      </div>
      <div v-else class="h-full w-full bg-gray-700 flex items-center justify-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      
      <div v-if="project.featured" class="absolute top-2 right-2 bg-accent text-white text-xs px-2 py-1 rounded-full">
        Featured
      </div>
    </div>
    
    <div class="p-6 flex flex-col flex-grow">
      <h3 class="text-xl font-bold mb-2 text-text-primary group-hover:text-accent transition-colors">
        {{ project.title }}
      </h3>
      <p class="text-text-secondary mb-4 line-clamp-3 flex-grow" v-html="formatDescription(project.description, 150)"></p>
      
      <div class="flex flex-wrap gap-2 mb-4">
        <span 
          v-for="tech in displayTechnologies" 
          :key="tech"
          class="text-xs px-2 py-1 rounded-full bg-primary text-text-secondary"
        >
          {{ tech }}
        </span>
        <span v-if="hasMoreTechnologies" class="text-xs px-2 py-1 rounded-full bg-primary text-text-secondary">
          +{{ project.technologies.length - 4 }}
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
        <button 
          v-if="!project.liveUrl && !project.codeUrl"
          class="flex-1 inline-flex justify-center items-center px-4 py-2 bg-accent hover:bg-accent-light text-white font-medium rounded-lg transition-colors"
          @click="$emit('view-details', project.id)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ t('portfolio.viewDetails') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.carousel-controls {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .carousel-controls {
  opacity: 1;
}
</style>
