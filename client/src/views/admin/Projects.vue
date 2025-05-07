<template>
  <div class="admin-projects">
    <div class="header-container">
      <h1 class="text-2xl font-bold mb-4">{{ t('admin.projectsManagement') }}</h1>
      <button 
        @click="openProjectModal()" 
        class="btn btn-primary"
      >
        <i class="fas fa-plus mr-2"></i> {{ t('admin.addProject') }}
      </button>
    </div>

    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>{{ t('common.loading') }}</p>
    </div>

    <div v-else-if="projects.length > 0" class="projects-grid">
      <div v-for="project in projects" :key="project.id" class="project-card">
        <div class="project-image">
          <img 
            :src="project.imageUrl || '/placeholder-image.png'" 
            :alt="project.title"
            @error="handleImageError"
            class="w-full h-48 object-cover rounded-t-lg"
          />
          <div class="featured-badge" v-if="project.featured">
            <i class="fas fa-star mr-1"></i> {{ t('admin.featured') }}
          </div>
        </div>
        
        <div class="project-content">
          <h3 class="project-title">{{ project.title }}</h3>
          <p class="project-description">{{ project.description.substring(0, 100) }}{{ project.description.length > 100 ? '...' : '' }}</p>
          
          <div class="project-tech">
            <span v-for="(tech, index) in project.technologies" :key="index" class="tech-tag">
              {{ tech }}
            </span>
          </div>
          
          <div class="project-actions">
            <button @click="openProjectModal(project)" class="btn btn-edit">
              <i class="fas fa-edit"></i> {{ t('common.edit') }}
            </button>
            <button @click="confirmDelete(project)" class="btn btn-delete">
              <i class="fas fa-trash"></i> {{ t('common.delete') }}
            </button>
            <button v-if="project.imageUrl" @click="previewImage(project.imageUrl)" class="btn btn-view">
              <i class="fas fa-eye"></i> {{ t('admin.viewImage') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-projects">
      <i class="fas fa-folder-open text-4xl mb-2 text-gray-400"></i>
      <p>{{ t('admin.noProjects') }}</p>
      <button @click="openProjectModal()" class="btn btn-primary mt-4">
        <i class="fas fa-plus mr-2"></i> {{ t('admin.addFirstProject') }}
      </button>
    </div>

    <div v-if="showProjectModal" class="modal-overlay" @click.self="showProjectModal = false">
      <div class="modal-container">
        <div class="modal-header">
          <h2>{{ isEditing ? t('admin.editProject') : t('admin.addProject') }}</h2>
          <button @click="showProjectModal = false" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label for="title">{{ t('admin.projectTitle') }}</label>
            <input 
              type="text" 
              id="title" 
              v-model="currentProject.title" 
              :placeholder="t('admin.enterProjectTitle')"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="description">{{ t('admin.projectDescription') }}</label>
            <textarea 
              id="description" 
              v-model="currentProject.description" 
              :placeholder="t('admin.enterProjectDescription')"
              class="form-textarea"
              rows="4"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>{{ t('admin.technologies') }}</label>
            <div class="tech-input-container">
              <input 
                type="text" 
                v-model="newTechnology" 
                :placeholder="t('admin.addTechnology')"
                class="form-input"
                @keyup.enter="addTechnology"
              />
              <button @click="addTechnology" class="btn btn-sm btn-primary">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            
            <div class="tech-tags" v-if="currentProject.technologies.length > 0">
              <span 
                v-for="(tech, index) in currentProject.technologies" 
                :key="index" 
                class="tech-tag"
              >
                {{ tech }}
                <button @click="removeTechnology(index)" class="remove-tech">
                  <i class="fas fa-times"></i>
                </button>
              </span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="image">{{ t('admin.projectImage') }}</label>
            <div class="image-upload-container">
              <input 
                type="file" 
                id="image" 
                @change="uploadProjectImage" 
                accept="image/*"
                class="file-input"
              />
              <label for="image" class="file-label">
                <i class="fas fa-cloud-upload-alt mr-2"></i>
                {{ t('admin.chooseImage') }}
              </label>
            </div>
            
            <div v-if="currentProject.imageUrl" class="image-preview">
              <img :src="currentProject.imageUrl" alt="Project preview" class="preview-img" />
              <button @click="currentProject.imageUrl = ''; currentProject.imagePublicId = ''" class="remove-image">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label for="githubUrl">{{ t('admin.githubUrl') }}</label>
            <input 
              type="text" 
              id="githubUrl" 
              v-model="currentProject.githubUrl" 
              :placeholder="t('admin.enterGithubUrl')"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="liveUrl">{{ t('admin.liveUrl') }}</label>
            <input 
              type="text" 
              id="liveUrl" 
              v-model="currentProject.liveUrl" 
              :placeholder="t('admin.enterLiveUrl')"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label class="checkbox-container">
              <input type="checkbox" v-model="currentProject.featured" />
              <span class="checkmark"></span>
              {{ t('admin.featured') }}
            </label>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="showProjectModal = false" class="btn btn-secondary">
            {{ t('common.cancel') }}
          </button>
          <button 
            @click="saveProject" 
            class="btn btn-primary" 
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="spinner-sm"></span>
            {{ isEditing ? t('common.update') : t('common.save') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 刪除確認模態框 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-container modal-sm">
        <div class="modal-header">
          <h2>{{ t('admin.confirmDelete') }}</h2>
          <button @click="showDeleteModal = false" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <p>{{ t('admin.deleteProjectConfirmation') }}</p>
          <p class="font-bold mt-2">{{ projectToDelete?.title }}</p>
        </div>
        
        <div class="modal-footer">
          <button @click="showDeleteModal = false" class="btn btn-secondary">
            {{ t('common.cancel') }}
          </button>
          <button 
            @click="deleteProject" 
            class="btn btn-danger" 
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="spinner-sm"></span>
            {{ t('common.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
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

<style scoped>
.admin-projects {
  padding: 1.5rem;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.spinner-sm {
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 2px solid #ffffff;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.project-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
  transition: transform 0.2s, box-shadow 0.2s;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.project-image {
  position: relative;
  height: 200px;
}

.featured-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ffc107;
  color: #000;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
}

.project-content {
  padding: 1rem;
}

.project-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.project-description {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tech-tag {
  background-color: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
}

.remove-tech {
  background: none;
  border: none;
  color: #dc3545;
  margin-left: 0.25rem;
  cursor: pointer;
  font-size: 0.7rem;
}

.project-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, color 0.2s;
  border: none;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn-edit {
  background-color: #17a2b8;
  color: white;
}

.btn-edit:hover {
  background-color: #138496;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-delete:hover {
  background-color: #c82333;
}

.btn-view {
  background-color: #6c757d;
  color: white;
}

.btn-view:hover {
  background-color: #5a6268;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.no-projects {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  color: #6c757d;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.modal-sm {
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #6c757d;
}

.close-btn:hover {
  color: #343a40;
}

.modal-body {
  padding: 1rem;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
}

.form-textarea {
  resize: vertical;
}

.tech-input-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-container input {
  margin-right: 0.5rem;
}

.image-upload-container {
  margin-bottom: 1rem;
}

.file-input {
  display: none;
}

.file-label {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #e9ecef;
  color: #495057;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.file-label:hover {
  background-color: #dde2e6;
}

.image-preview {
  position: relative;
  display: inline-block;
  margin-top: 0.5rem;
}

.preview-img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
}

.remove-image {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(220, 53, 69, 0.8);
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.remove-image:hover {
  background-color: rgba(220, 53, 69, 1);
}
</style>
