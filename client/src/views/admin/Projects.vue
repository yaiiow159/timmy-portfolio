<template>
  <div class="admin-projects">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-text-primary dark:text-text-primary-light">
        {{ t('admin.manageProjects') }}
      </h1>
      
      <button 
        @click="openProjectModal()"
        class="bg-accent hover:bg-accent-light text-white px-4 py-2 rounded-lg flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ t('admin.newProject') }}
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-if="isLoading" class="col-span-full flex justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <div v-else-if="projects.length === 0" class="col-span-full text-center py-12 text-text-secondary dark:text-text-secondary-light">
        {{ t('admin.noProjects') }}
      </div>
      
      <div 
        v-else
        v-for="project in projects" 
        :key="project.id"
        class="bg-primary dark:bg-primary-light rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
      >
        <div 
          class="h-48 bg-gray-200 dark:bg-gray-700 relative"
          :class="{'flex items-center justify-center': !project.imageUrl}"
        >
          <img 
            v-if="project.imageUrl" 
            :src="project.imageUrl" 
            :alt="project.title" 
            class="w-full h-full object-cover"
          >
          <svg 
            v-else
            xmlns="http://www.w3.org/2000/svg" 
            class="h-12 w-12 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          
          <div class="absolute top-2 right-2 flex space-x-1">
            <button 
              @click="openProjectModal(project)"
              class="p-1 bg-white dark:bg-gray-800 rounded-full shadow-md text-text-secondary dark:text-text-secondary-light hover:text-accent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <button 
              @click="confirmDelete(project)"
              class="p-1 bg-white dark:bg-gray-800 rounded-full shadow-md text-text-secondary dark:text-text-secondary-light hover:text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          
          <div v-if="project.featured" class="absolute top-2 left-2 bg-accent text-white px-2 py-1 text-xs rounded-md">
            {{ t('admin.featured') }}
          </div>
        </div>
        
        <div class="p-4">
          <h3 class="text-lg font-semibold text-text-primary dark:text-text-primary-light mb-2">
            {{ project.title }}
          </h3>
          
          <p class="text-text-secondary dark:text-text-secondary-light text-sm mb-4 line-clamp-3">
            {{ project.description }}
          </p>
          
          <div class="flex flex-wrap gap-1 mb-4">
            <span 
              v-for="tech in project.technologies" 
              :key="tech"
              class="bg-secondary dark:bg-secondary-light text-xs px-2 py-1 rounded"
            >
              {{ tech }}
            </span>
          </div>
          
          <div class="flex justify-between">
            <a 
              v-if="project.liveUrl"
              :href="project.liveUrl" 
              target="_blank"
              class="text-accent hover:text-accent-light text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {{ t('admin.liveDemo') }}
            </a>
            
            <a 
              v-if="project.codeUrl"
              :href="project.codeUrl" 
              target="_blank"
              class="text-accent hover:text-accent-light text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              {{ t('admin.viewCode') }}
            </a>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="showProjectModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showProjectModal = false"></div>
        
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6">
            <div class="mb-4">
              <h3 class="text-lg leading-6 font-medium text-text-primary dark:text-text-primary-light" id="modal-title">
                {{ isEditing ? t('admin.editProject') : t('admin.newProject') }}
              </h3>
            </div>
            
            <form @submit.prevent="saveProject">
              <div class="mb-4">
                <label class="block text-text-primary dark:text-text-primary-light mb-2" for="project-title">
                  {{ t('admin.title') }} *
                </label>
                <input 
                  v-model="projectForm.title"
                  type="text" 
                  id="project-title"
                  class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-light"
                  :placeholder="t('admin.titlePlaceholder')"
                  required
                >
              </div>
              
              <div class="mb-4">
                <label class="block text-text-primary dark:text-text-primary-light mb-2" for="project-description">
                  {{ t('admin.description') }} *
                </label>
                <textarea 
                  v-model="projectForm.description"
                  id="project-description"
                  rows="3"
                  class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-light"
                  :placeholder="t('admin.descriptionPlaceholder')"
                  required
                ></textarea>
              </div>
              
              <div class="mb-4">
                <label class="block text-text-primary dark:text-text-primary-light mb-2" for="project-technologies">
                  {{ t('admin.technologies') }} *
                </label>
                
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <div 
                    v-for="(tech, index) in projectForm.technologies" 
                    :key="index"
                    class="bg-secondary dark:bg-secondary-light px-3 py-1 rounded-full flex items-center"
                  >
                    <span class="text-text-primary dark:text-text-primary-light mr-2">{{ tech }}</span>
                    <button 
                      type="button"
                      @click="removeTechnology(index)"
                      class="text-text-secondary dark:text-text-secondary-light hover:text-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div class="flex items-center">
                    <input 
                      v-model="newTech"
                      type="text" 
                      class="px-3 py-1 border rounded-lg bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-light"
                      :placeholder="t('admin.addTechnology')"
                      @keydown.enter.prevent="addTechnology"
                    >
                    <button 
                      type="button"
                      @click="addTechnology"
                      class="ml-2 p-1 bg-accent text-white rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="mb-4">
                <label class="block text-text-primary dark:text-text-primary-light mb-2" for="project-image">
                  {{ t('admin.imageUrl') }}
                </label>
                <div class="flex items-center">
                  <input 
                    v-model="projectForm.imageUrl"
                    type="text" 
                    id="project-image"
                    class="flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-light"
                    :placeholder="t('admin.imageUrlPlaceholder')"
                  >
                  
                  <span class="mx-2">{{ t('admin.or') }}</span>
                  
                  <label class="px-4 py-2 bg-secondary dark:bg-secondary-light text-text-primary dark:text-text-primary-light rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
                    {{ t('admin.upload') }}
                    <input 
                      type="file" 
                      accept="image/*" 
                      class="hidden" 
                      @change="uploadProjectImage"
                    >
                  </label>
                </div>
              </div>
              
              <div class="mb-4">
                <label class="block text-text-primary dark:text-text-primary-light mb-2" for="project-live-url">
                  {{ t('admin.liveUrl') }}
                </label>
                <input 
                  v-model="projectForm.liveUrl"
                  type="url" 
                  id="project-live-url"
                  class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-light"
                  :placeholder="t('admin.liveUrlPlaceholder')"
                >
              </div>
              
              <div class="mb-4">
                <label class="block text-text-primary dark:text-text-primary-light mb-2" for="project-code-url">
                  {{ t('admin.codeUrl') }}
                </label>
                <input 
                  v-model="projectForm.codeUrl"
                  type="url" 
                  id="project-code-url"
                  class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-light"
                  :placeholder="t('admin.codeUrlPlaceholder')"
                >
              </div>
              
              <div class="mb-4 flex items-center">
                <input 
                  v-model="projectForm.featured"
                  type="checkbox" 
                  id="project-featured"
                  class="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                >
                <label class="ml-2 block text-text-primary dark:text-text-primary-light" for="project-featured">
                  {{ t('admin.featuredProject') }}
                </label>
              </div>
            </form>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="saveProject"
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-accent text-base font-medium text-white hover:bg-accent-light focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="isSubmitting"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ t('admin.save') }}
            </button>
            <button 
              @click="showProjectModal = false"
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-text-primary dark:text-text-primary-light hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {{ t('admin.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showDeleteModal = false"></div>
        
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-text-primary dark:text-text-primary-light" id="modal-title">
                  {{ t('admin.deleteProject') }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-text-secondary dark:text-text-secondary-light">
                    {{ t('admin.deleteProjectConfirmation', { title: projectToDelete?.title }) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="deleteProject"
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              {{ t('admin.delete') }}
            </button>
            <button 
              @click="showDeleteModal = false"
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-text-primary dark:text-text-primary-light hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
  liveUrl?: string
  codeUrl?: string
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
const newTech = ref('')

const projectForm = ref({
  id: '',
  title: '',
  description: '',
  technologies: [] as string[],
  imageUrl: '',
  liveUrl: '',
  codeUrl: '',
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
      projectForm.value = {
        id: project.id,
        title: project.title,
        description: project.description,
        technologies: [...project.technologies],
        imageUrl: project.imageUrl || '',
        liveUrl: project.liveUrl || '',
        codeUrl: project.codeUrl || '',
        featured: project.featured
      }
    } else {
      isEditing.value = false
      projectForm.value = {
        id: '',
        title: '',
        description: '',
        technologies: [],
        imageUrl: '',
        liveUrl: '',
        codeUrl: '',
        featured: false
      }
    }
  
  showProjectModal.value = true
}

function addTechnology() {
  if (newTech.value.trim() && !projectForm.value.technologies.includes(newTech.value.trim())) {
    projectForm.value.technologies.push(newTech.value.trim())
    newTech.value = ''
  }
}

function removeTechnology(index: number) {
  projectForm.value.technologies.splice(index, 1)
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
    
    projectForm.value.imageUrl = response.data.filePath
    
    notificationStore.addNotification({
      type: 'success',
      message: t('admin.imageUploaded'),
      duration: 3000
    })
  } catch (error) {
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
  if (!projectForm.value.title || !projectForm.value.description || projectForm.value.technologies.length === 0) {
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
      await api.put(`/projects/${projectForm.value.id}`, projectForm.value, {
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
      await api.post('/projects', projectForm.value, {
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
    notificationStore.addNotification({
      type: 'error',
      message: t('admin.deleteError'),
      duration: 5000
    })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchProjects()
})
</script>
