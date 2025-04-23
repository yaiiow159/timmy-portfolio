<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Project } from '@/store/portfolioStore.ts'

const { t } = useI18n()

const props = defineProps<{
  project: Project
}>()

const displayTechnologies = props.project.technologies.slice(0, 4)
const hasMoreTechnologies = props.project.technologies.length > 4
</script>

<template>
  <div class="project-card bg-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col group">
    <div class="h-48 bg-gray-700 relative overflow-hidden">
      <div v-if="project.imageUrl" class="h-full w-full">
        <img 
          :src="project.imageUrl" 
          :alt="project.title" 
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
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
      <p class="text-text-secondary mb-4 line-clamp-3 flex-grow">
        {{ project.description }}
      </p>
      
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
        >
          {{ t('portfolio.viewProject') }}
        </button>
      </div>
    </div>
  </div>
</template>
