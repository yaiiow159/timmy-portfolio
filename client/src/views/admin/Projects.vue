<template>
  <!-- ... -->
</template>

<script setup lang="ts">
import { ref, onMounted, defineExpose } from 'vue'
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
  imagePublicId?: string
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
  imagePublicId: '',
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
        imagePublicId: project.imagePublicId || '',
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
        imagePublicId: '',
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
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
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
    currentProject.value.imagePublicId = response.data.publicId
    
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
      const response = await api.post('/projects', currentProject.value, {
        headers: {
          'x-auth-token': authStore.token as string
        }
      })
      
      // 創建活動記錄
      await api.post('/activities', {
        type: 'PROJECT_ADDED',
        title: '添加了新專案',
        description: `《${currentProject.value.title}》`,
        userName: authStore.user?.name ?? 'Anonymous',
        targetId: response.data.id,
        targetType: 'project'
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
  img.src = '/placeholder-image.png' 
}

function previewImage(imageUrl: string) {
  window.open(imageUrl, '_blank')
}

onMounted(() => {
  fetchProjects()
})

// Export the functions to prevent TypeScript unused variable warnings
defineExpose({
  openProjectModal,
  addTechnology,
  removeTechnology,
  uploadProjectImage,
  saveProject,
  confirmDelete,
  deleteProject,
  handleImageError,
  previewImage
})
</script>
