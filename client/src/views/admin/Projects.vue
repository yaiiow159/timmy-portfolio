<template>
  <div class="admin-projects min-h-screen bg-primary dark:bg-primary-dark p-6 space-y-6">
    <div class="flex justify-between items-center mb-6 bg-secondary dark:bg-secondary-dark p-6 rounded-lg shadow-sm">
      <h1 class="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
        {{ t('admin.manageProjects') }}
      </h1>
      
      <button 
        @click="openProjectModal()"
        class="bg-accent dark:bg-accent-light hover:bg-accent-light dark:hover:bg-accent text-white px-6 py-2.5 rounded-lg flex items-center shadow-sm transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ t('admin.newProject') }}
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      <div v-if="isLoading" class="col-span-full flex justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-accent dark:text-accent-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <div v-else-if="projects.length === 0" class="col-span-full flex flex-col items-center justify-center py-16 bg-secondary dark:bg-secondary-dark rounded-lg shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-text-secondary dark:text-text-secondary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="mt-4 text-lg font-medium text-text-secondary dark:text-text-secondary-dark">{{ t('admin.noProjects') }}</p>
      </div>
      
      <div 
        v-else
        v-for="project in projects" 
        :key="project.id"
        class="bg-secondary dark:bg-secondary-dark rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div 
          class="h-56 bg-primary dark:bg-primary-dark relative"
          :class="{'flex items-center justify-center': !project.imageUrl}"
        >
          <img 
            v-if="project.imageUrl" 
            :src="project.imageUrl" 
            :alt="project.title" 
            class="w-full h-full object-cover"
            @error="handleImageError"
          >
          <svg 
            v-else
            xmlns="http://www.w3.org/2000/svg" 
            class="h-12 w-12 text-text-secondary dark:text-text-secondary-dark" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div 
            v-if="project.imageUrl"
            class="absolute top-0 right-0 mt-2 mr-2 flex space-x-2"
          >
            <button
              @click="previewImage(project.imageUrl)"
              class="p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <h3 class="text-xl font-semibold text-text-primary dark:text-text-primary-dark mb-2">
            {{ project.title }}
          </h3>
          
          <p class="text-text-secondary dark:text-text-secondary-dark mb-4 line-clamp-2">
            {{ project.description }}
          </p>
          
          <div class="flex flex-wrap gap-2 mb-4">
            <span 
              v-for="tech in project.technologies" 
              :key="tech"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 dark:bg-accent-light/10 text-accent dark:text-accent-light"
            >
              {{ tech }}
            </span>
          </div>
          
          <div class="flex justify-between items-center mt-4">
            <div class="flex space-x-2">
              <a 
                v-if="project.githubUrl" 
                :href="project.githubUrl" 
                target="_blank"
                class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary dark:bg-primary-dark text-text-primary dark:text-text-primary-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a 
                v-if="project.liveUrl" 
                :href="project.liveUrl" 
                target="_blank"
                class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary dark:bg-primary-dark text-text-primary dark:text-text-primary-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            
            <div class="flex space-x-2">
              <button 
                @click="openProjectModal(project)"
                class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary dark:bg-primary-dark text-text-primary dark:text-text-primary-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button 
                @click="confirmDelete(project)"
                class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary dark:bg-primary-dark text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="showProjectModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" aria-hidden="true" @click="showProjectModal = false"></div>
        
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-secondary dark:bg-secondary-dark rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-secondary dark:bg-secondary-dark px-6 pt-6 pb-4">
            <div class="mb-6">
              <h3 class="text-xl font-semibold text-text-primary dark:text-text-primary-dark" id="modal-title">
                {{ isEditing ? t('admin.editProject') : t('admin.newProject') }}
              </h3>
              <p class="text-sm text-text-secondary dark:text-text-secondary-dark mt-1">
                {{ isEditing ? t('admin.editProjectDescription') : t('admin.newProjectDescription') }}
              </p>
            </div>
            
            <form @submit.prevent="saveProject" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-text-secondary dark:text-text-secondary-dark mb-2" for="project-title">
                  {{ t('admin.title') }} *
                </label>
                <input 
                  v-model="currentProject.title"
                  type="text" 
                  id="project-title"
                  class="w-full bg-primary dark:bg-primary-dark border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-light"
                  :placeholder="t('admin.projectTitlePlaceholder')"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-text-secondary dark:text-text-secondary-dark mb-2" for="project-description">
                  {{ t('admin.description') }} *
                </label>
                <textarea 
                  v-model="currentProject.description"
                  id="project-description"
                  rows="4"
                  class="w-full bg-primary dark:bg-primary-dark border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-light"
                  :placeholder="t('admin.projectDescriptionPlaceholder')"
                  required
                ></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-text-secondary dark:text-text-secondary-dark mb-2">
                  {{ t('admin.technologies') }} *
                </label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <span 
                    v-for="(tech, index) in currentProject.technologies" 
                    :key="index"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 dark:bg-accent-light/10 text-accent dark:text-accent-light"
                  >
                    {{ tech }}
                    <button 
                      type="button"
                      @click="removeTechnology(index)"
                      class="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full hover:bg-accent/20 dark:hover:bg-accent-light/20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                </div>
                <div class="flex">
                  <input 
                    v-model="newTechnology"
                    type="text" 
                    class="flex-1 bg-primary dark:bg-primary-dark border border-gray-300 dark:border-gray-700 rounded-l-lg py-2 px-4 text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-light"
                    :placeholder="t('admin.addTechnology')"
                    @keydown.enter.prevent="addTechnology"
                  />
                  <button 
                    type="button"
                    @click="addTechnology"
                    class="bg-accent dark:bg-accent-light hover:bg-accent-light dark:hover:bg-accent text-white px-4 rounded-r-lg"
                  >
                    {{ t('admin.add') }}
                  </button>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-text-secondary dark:text-text-secondary-dark mb-2" for="project-image">
                  {{ t('admin.projectImage') }}
                </label>
                <div class="flex items-center space-x-4">
                  <div 
                    class="h-24 w-24 bg-primary dark:bg-primary-dark border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden flex items-center justify-center"
                  >
                    <img 
                      v-if="currentProject.imageUrl" 
                      :src="currentProject.imageUrl" 
                      alt="Project preview" 
                      class="h-full w-full object-cover"
                    >
                    <svg 
                      v-else
                      xmlns="http://www.w3.org/2000/svg" 
                      class="h-8 w-8 text-text-secondary dark:text-text-secondary-dark" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <label class="block w-full cursor-pointer">
                      <span class="sr-only">{{ t('admin.chooseFile') }}</span>
                      <input 
                        type="file" 
                        class="hidden" 
                        accept="image/*"
                        @change="uploadProjectImage"
                      >
                      <div class="px-4 py-2 bg-primary dark:bg-primary-dark border border-gray-300 dark:border-gray-700 rounded-lg text-center text-text-secondary dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                        {{ t('admin.chooseFile') }}
                      </div>
                    </label>
                    <p class="mt-1 text-xs text-text-secondary dark:text-text-secondary-dark">
                      {{ t('admin.imageRequirements') }}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-text-secondary dark:text-text-secondary-dark mb-2" for="project-github-url">
                  {{ t('admin.githubUrl') }}
                </label>
                <input 
                  v-model="currentProject.githubUrl"
                  type="url" 
                  id="project-github-url"
                  class="w-full bg-primary dark:bg-primary-dark border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-light"
                  placeholder="https://github.com/username/repo"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-text-secondary dark:text-text-secondary-dark mb-2" for="project-live-url">
                  {{ t('admin.liveUrl') }}
                </label>
                <input 
                  v-model="currentProject.liveUrl"
                  type="url" 
                  id="project-live-url"
                  class="w-full bg-primary dark:bg-primary-dark border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-light"
                  placeholder="https://example.com"
                />
              </div>
            </form>
          </div>
          
          <div class="bg-gray-100 dark:bg-gray-800 px-6 py-4 flex flex-row-reverse gap-3">
            <button 
              @click="saveProject"
              class="bg-accent dark:bg-accent-light hover:bg-accent-light dark:hover:bg-accent text-white px-6 py-2.5 rounded-lg flex items-center shadow-sm transition-colors duration-200"
              :disabled="isSubmitting"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isEditing ? t('admin.updateProject') : t('admin.createProject') }}
            </button>
            <button 
              @click="showProjectModal = false"
              class="bg-primary dark:bg-primary-dark hover:bg-gray-200 dark:hover:bg-gray-700 text-text-primary dark:text-text-primary-dark px-6 py-2.5 rounded-lg transition-colors duration-200"
            >
              {{ t('admin.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" aria-hidden="true" @click="showDeleteModal = false"></div>
        
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-secondary dark:bg-secondary-dark rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-secondary dark:bg-secondary-dark px-6 pt-6 pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-text-primary dark:text-text-primary-dark" id="modal-title">
                  {{ t('admin.deleteProject') }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-text-secondary dark:text-text-secondary-dark">
                    {{ t('admin.deleteProjectConfirmation', { title: projectToDelete?.title }) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-100 dark:bg-gray-800 px-6 py-4 flex flex-row-reverse gap-3">
            <button 
              @click="deleteProject"
              class="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg flex items-center shadow-sm transition-colors duration-200"
              :disabled="isSubmitting"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ t('admin.delete') }}
            </button>
            <button 
              @click="showDeleteModal = false"
              class="bg-primary dark:bg-primary-dark hover:bg-gray-200 dark:hover:bg-gray-700 text-text-primary dark:text-text-primary-dark px-6 py-2.5 rounded-lg transition-colors duration-200"
            >
              {{ t('admin.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/authStore.ts'
import { useNotificationStore } from '@/store/notificationStore.ts'
import api from '../../services/api'

const { t } = useI18n()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  imageUrl?: string
  githubUrl?: string
  liveUrl?: string
  featured: boolean
  date: string
}

const projects = ref<Project[]>([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const showProjectModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const projectToDelete = ref<Project | null>(null)
const newTechnology = ref('')

const currentProject = ref({
  id: '',
  title: '',
  description: '',
  technologies: [] as string[],
  imageUrl: '',
  githubUrl: '',
  liveUrl: '',
  featured: false
})

async function fetchProjects() {
  isLoading.value = true
  
  try {
    const response = await api.get('/projects')
    projects.value = response.data
  } catch (error) {
    console.error('Error fetching projects:', error)
    notificationStore.addNotification({
      type: 'error',
      message: t('admin.fetchProjectsError'),
      duration: 5000
    })
  } finally {
    isLoading.value = false
  }
}

function openProjectModal(project?: Project) {
    if (project) {
      isEditing.value = true
      currentProject.value = {
        id: project.id,
        title: project.title,
        description: project.description,
        technologies: [...project.technologies],
        imageUrl: project.imageUrl || '',
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        featured: project.featured
      }
    } else {
      isEditing.value = false
      currentProject.value = {
        id: '',
        title: '',
        description: '',
        technologies: [],
        imageUrl: '',
        githubUrl: '',
        liveUrl: '',
        featured: false
      }
    }
  
  showProjectModal.value = true
}

function addTechnology() {
  if (newTechnology.value.trim() && !currentProject.value.technologies.includes(newTechnology.value.trim())) {
    currentProject.value.technologies.push(newTechnology.value.trim())
    newTechnology.value = ''
  }
}

function removeTechnology(index: number) {
  currentProject.value.technologies.splice(index, 1)
}

async function uploadProjectImage(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  
  const file = input.files[0]
  
  try {
    isSubmitting.value = true
    
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-auth-token': authStore.token as string
      }
    })
    
    currentProject.value.imageUrl = response.data.filePath
    
    notificationStore.addNotification({
      type: 'success',
      message: t('admin.imageUploaded'),
      duration: 3000
    })
  } catch (error) {
    console.error('Error uploading project image:', error)
    notificationStore.addNotification({
      type: 'error',
      message: t('admin.imageUploadError'),
      duration: 5000
    })
  } finally {
    isSubmitting.value = false
  }
}

async function saveProject() {
  if (!currentProject.value.title || !currentProject.value.description || currentProject.value.technologies.length === 0) {
    notificationStore.addNotification({
      type: 'error',
      message: t('admin.fillRequiredFields'),
      duration: 5000
    })
    return
  }
  
  try {
    isSubmitting.value = true
    
    if (isEditing.value) {
      await api.put(`/projects/${currentProject.value.id}`, currentProject.value, {
        headers: {
          'x-auth-token': authStore.token as string
        }
      })
      
      notificationStore.addNotification({
        type: 'success',
        message: t('admin.projectUpdated'),
        duration: 5000
      })
    } else {
      await api.post('/projects', currentProject.value, {
        headers: {
          'x-auth-token': authStore.token as string
        }
      })
      
      notificationStore.addNotification({
        type: 'success',
        message: t('admin.projectCreated'),
        duration: 5000
      })
    }
    
    await fetchProjects()
    showProjectModal.value = false
  } catch (error) {
    console.error('Error saving project:', error)
    notificationStore.addNotification({
      type: 'error',
      message: isEditing.value ? t('admin.updateError') : t('admin.createError'),
      duration: 5000
    })
  } finally {
    isSubmitting.value = false
  }
}

function confirmDelete(project: Project) {
  projectToDelete.value = project
  showDeleteModal.value = true
}

async function deleteProject() {
  if (!projectToDelete.value) return
  
  try {
    isSubmitting.value = true
    
    await api.delete(`/projects/${projectToDelete.value.id}`, {
      headers: {
        'x-auth-token': authStore.token as string
      }
    })
    
    notificationStore.addNotification({
      type: 'success',
      message: t('admin.projectDeleted'),
      duration: 5000
    })
    
    await fetchProjects()
    showDeleteModal.value = false
    projectToDelete.value = null
  } catch (error) {
    console.error('Error deleting project:', error)
    notificationStore.addNotification({
      type: 'error',
      message: t('admin.deleteError'),
      duration: 5000
    })
  } finally {
    isSubmitting.value = false
  }
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-image.png' // 替換為預設圖片
}

function previewImage(imageUrl: string) {
  window.open(imageUrl, '_blank')
}

onMounted(() => {
  fetchProjects()
})
</script>
