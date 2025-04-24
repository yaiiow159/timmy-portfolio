<template>
  <div class="admin-files min-h-screen bg-primary dark:bg-primary-dark p-6 space-y-6">
    <div class="flex justify-between items-center mb-6 bg-secondary dark:bg-secondary-dark p-6 rounded-lg shadow-sm">
      <h1 class="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
        {{ t('admin.manageFiles') }}
      </h1>
      
      <div class="flex space-x-4">
        <button 
          v-if="selectedFiles.length > 0"
          @click="batchDeleteFiles"
          :disabled="isSubmitting"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors duration-200"
        >
          <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ t('admin.deleteSelected', { count: selectedFiles.length }) }}
        </button>
        
        <button 
          @click="refreshFiles"
          class="bg-accent dark:bg-accent-light hover:bg-accent-light dark:hover:bg-accent text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ t('admin.refresh') }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-if="isLoading" class="col-span-full flex justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-accent dark:text-accent-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else-if="files.length === 0" class="col-span-full flex flex-col items-center justify-center py-16 bg-secondary dark:bg-secondary-dark rounded-lg shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-text-secondary dark:text-text-secondary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
        </svg>
        <p class="mt-4 text-lg font-medium text-text-secondary dark:text-text-secondary-dark">
          {{ t('admin.noFiles') }}
        </p>
      </div>

      <div 
        v-else
        v-for="file in files" 
        :key="file.path"
        class="bg-secondary dark:bg-secondary-dark rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        :class="{ 'ring-2 ring-accent': selectedFiles.some(f => f.path === file.path) }"
      >
        <div 
          class="aspect-w-16 aspect-h-9 bg-primary dark:bg-primary-dark relative cursor-pointer"
          @click="toggleFileSelection(file)"
        >
          <img 
            v-if="isImageFile(file.path)"
            :src="file.url"
            :alt="file.name"
            class="w-full h-full object-contain opacity-0 transition-opacity duration-300"
            @error="handleImageError"
            @load="handleImageLoad"
            crossorigin="anonymous"
            referrerpolicy="no-referrer"
          >
          <div 
            v-else
            class="w-full h-full flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-text-secondary dark:text-text-secondary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div class="p-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-text-primary dark:text-text-primary-dark font-medium truncate">
              {{ file.name }}
            </h3>
            <span class="text-text-secondary dark:text-text-secondary-dark text-sm">
              {{ formatFileSize(file.size) }}
            </span>
          </div>

          <div class="flex justify-between items-center">
            <button
              @click="copyUrl(file.url)"
              class="text-accent dark:text-accent-light hover:text-accent-light dark:hover:text-accent flex items-center text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              {{ t('admin.copyUrl') }}
            </button>
            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                :checked="selectedFiles.some(f => f.path === file.path)"
                @change="toggleFileSelection(file)"
                class="w-4 h-4 text-accent focus:ring-accent rounded border-gray-300"
              />
              <button
                @click="confirmDelete(file)"
                class="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600 dark:text-red-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-text-primary dark:text-text-primary-dark">
                  {{ t('admin.deleteFile') }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-text-secondary dark:text-text-secondary-dark">
                    {{ t('admin.deleteFileConfirmation', { name: fileToDelete?.name }) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-100 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="deleteFile"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="isSubmitting"
            >
              {{ t('admin.delete') }}
            </button>
            <button
              @click="showDeleteModal = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-900 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
import { useAuthStore } from '@/store/authStore'
import { useNotificationStore } from '@/store/notificationStore'
import api, { getStaticUrl } from '@/services/api'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const router = useRouter()

interface File {
  name: string
  path: string
  size: number
  url: string
  type: string
}

const files = ref<File[]>([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const showDeleteModal = ref(false)
const fileToDelete = ref<File | null>(null)
const selectedFiles = ref<File[]>([])

function isImageFile(path: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  return imageExtensions.some(ext => path.toLowerCase().endsWith(ext))
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

async function fetchFiles() {
  isLoading.value = true
  try {
    const response = await api.get<File[]>('/files', {
      headers: {
        'x-auth-token': authStore.token
      }
    })
    console.log('Files response:', response.data)
    files.value = Array.isArray(response.data) 
      ? response.data.map((file: File) => ({
          ...file,
          url: getStaticUrl(file.url)
        }))
      : []
  } catch (error) {
    console.error('Error fetching files:', error)
    notificationStore.addNotification({
      type: 'error',
      message: t('admin.fetchFilesError'),
      duration: 5000
    })
  } finally {
    isLoading.value = false
  }
}

function refreshFiles() {
  fetchFiles()
}

function confirmDelete(file: File) {
  fileToDelete.value = file
  showDeleteModal.value = true
}

async function deleteFile() {
  if (!fileToDelete.value) return
  
  try {
    isSubmitting.value = true
    await api.delete(`/files/${encodeURIComponent(fileToDelete.value.path)}`, {
      headers: {
        'x-auth-token': authStore.token as string
      }
    })
    
    files.value = files.value.filter(f => f.path !== fileToDelete.value?.path)
    notificationStore.addNotification({
      type: 'success',
      message: t('admin.fileDeleted'),
      duration: 3000
    })
    
    showDeleteModal.value = false
    fileToDelete.value = null
  } catch (error) {
    console.error('Error deleting file:', error)
    notificationStore.addNotification({
      type: 'error',
      message: t('admin.deleteFileError'),
      duration: 5000
    })
  } finally {
    isSubmitting.value = false
  }
}

async function copyUrl(url: string) {
  try {
    await navigator.clipboard.writeText(url)
    notificationStore.addNotification({
      type: 'success',
      message: t('admin.urlCopied'),
      duration: 2000
    })
  } catch (error) {
    console.error('Error copying URL:', error)
    notificationStore.addNotification({
      type: 'error',
      message: t('admin.copyUrlError'),
      duration: 3000
    })
  }
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  console.error('Image load error:', img.src);
  img.src = '/images/placeholder-image.png';
  img.classList.add('error-image');
}

function handleImageLoad(event: Event) {
  const img = event.target as HTMLImageElement;
  console.log('Image loaded successfully:', img.src);
  img.classList.remove('opacity-0');
  img.classList.add('opacity-100');
}

function toggleFileSelection(file: File) {
  const index = selectedFiles.value.findIndex(f => f.path === file.path)
  if (index === -1) {
    selectedFiles.value.push(file)
  } else {
    selectedFiles.value.splice(index, 1)
  }
}

async function batchDeleteFiles() {
  if (selectedFiles.value.length === 0) return
  
  try {
    isSubmitting.value = true
    const response = await api.delete('/files/batch', {
      headers: {
        'x-auth-token': authStore.token as string,
        'Content-Type': 'application/json'
      },
      data: {
        files: selectedFiles.value.map(file => file.path)
      }
    })
    
    const successfulDeletes = response.data.results
      .filter((result: any) => result.status === 'success')
      .map((result: any) => result.filename)
    
    files.value = files.value.filter(file => !successfulDeletes.includes(file.path))
    selectedFiles.value = []
    
    notificationStore.addNotification({
      type: 'success',
      message: t('admin.filesDeleted', { count: successfulDeletes.length }),
      duration: 3000
    })
  } catch (error) {
    console.error('Error deleting files:', error)
    notificationStore.addNotification({
      type: 'error',
      message: t('admin.deleteFilesError'),
      duration: 5000
    })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/auth')
    return
  }
  fetchFiles()
})
</script>

<style scoped>
.error-image {
  opacity: 0.5;
  filter: grayscale(100%);
}

.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
}

.aspect-w-16 > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style> 