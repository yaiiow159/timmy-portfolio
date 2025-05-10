<template>
  <div class="admin-projects">
    <div class="header-container">
      <h1 class="text-2xl font-bold mb-4">{{ t('admin.projectsManagement') }}</h1>
      <button 
        @click="openProjectModal()" 
        class="btn btn-primary add-project-btn"
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
          <div v-if="project.imageUrls && project.imageUrls.length > 0" class="project-image-carousel">
            <div class="carousel-images" :style="{ transform: `translateX(-${getProjectCarouselIndex(project.id) * 100}%)` }">
              <img 
                v-for="(imageUrl, index) in project.imageUrls" 
                :key="`${project.id}-img-${index}`"
                :src="imageUrl" 
                :alt="`${project.title} - Image ${index + 1}`"
                @error="handleImageError"
                class="w-full h-48 object-cover"
              />
            </div>
            
            <div v-if="project.imageUrls.length > 1" class="carousel-controls">
              <button @click.prevent="prevProjectImage(project.id)" class="carousel-control carousel-prev">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button @click.prevent="nextProjectImage(project.id)" class="carousel-control carousel-next">
                <i class="fas fa-chevron-right"></i>
              </button>
              
              <div class="carousel-indicators">
                <button 
                  v-for="(_, index) in project.imageUrls" 
                  :key="`${project.id}-indicator-${index}`"
                  @click="setProjectCarouselIndex(project.id, index)"
                  class="carousel-indicator"
                  :class="{ active: getProjectCarouselIndex(project.id) === index }"
                ></button>
              </div>
            </div>
          </div>
          
          <img
            v-else-if="project.imageUrl" 
            :src="project.imageUrl" 
            :alt="project.title"
            @error="handleImageError"
            class="w-full h-48 object-cover rounded-t-lg"
          />
          
          <div v-else class="no-image-placeholder">
            <i class="fas fa-image"></i>
            <span>{{ t('admin.noImage') }}</span>
          </div>
          
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
              <div class="tag-actions">
                <button @click="moveTechnologyUp(index)" class="move-tech" :title="t('admin.moveTechnologyUp')" v-if="index > 0">
                  <span class="move-icon">↑</span>
                </button>
                <button @click="moveTechnologyDown(index)" class="move-tech" :title="t('admin.moveTechnologyDown')" v-if="index < project.technologies.length - 1">
                  <span class="move-icon">↓</span>
                </button>
                <button @click="removeTechnology(index)" class="remove-tech" :title="t('admin.removeTechnology')">
                  <span class="x-icon">×</span>
                </button>
              </div>
            </span>
          </div>
          
          <div class="project-actions">
            <button @click="openProjectModal(project)" class="btn btn-edit">
              <i class="fas fa-edit"></i> {{ t('common.edit') }}
            </button>
            <button @click="confirmDelete(project)" class="btn btn-delete">
              <i class="fas fa-trash"></i> {{ t('common.delete') }}
            </button>
            <button 
              v-if="project.imageUrls && project.imageUrls.length > 0" 
              @click="previewImage(project.imageUrls[getProjectCarouselIndex(project.id)])" 
              class="btn btn-view"
            >
              <i class="fas fa-eye"></i> {{ t('admin.viewImage') }}
            </button>
            <button 
              v-else-if="project.imageUrl" 
              @click="previewImage(project.imageUrl)" 
              class="btn btn-view"
            >
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
          <h2>
            <i class="fas fa-{{ isEditing ? 'edit' : 'plus-circle' }} mr-2"></i>
            {{ isEditing ? t('admin.editProject') : t('admin.addProject') }}
          </h2>
          <button @click="showProjectModal = false" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label for="title" class="form-label">
              <i class="fas fa-heading mr-2"></i>
              {{ t('admin.projectTitle') }}
            </label>
            <input 
              type="text" 
              id="title" 
              v-model="currentProject.title" 
              :placeholder="t('admin.enterProjectTitle')"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="description" class="form-label">
              <i class="fas fa-align-left mr-2"></i>
              {{ t('admin.projectDescription') }}
            </label>
            <textarea 
              id="description" 
              v-model="currentProject.description" 
              :placeholder="t('admin.enterProjectDescription')"
              class="form-textarea"
              rows="4"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-tags mr-2"></i>
              {{ t('admin.technologies') }}
            </label>
            <div class="tech-input-container">
              <input 
                type="text" 
                v-model="newTechnology" 
                :placeholder="t('admin.addTechnology')"
                class="form-input"
                @keyup.enter="addTechnology"
              />
              <button @click="addTechnology" class="btn btn-sm btn-primary tech-add-btn">
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
                <div class="tag-actions">
                  <button @click="moveTechnologyUp(index)" class="move-tech" :title="t('admin.moveTechnologyUp')" v-if="index > 0">
                    <span class="move-icon">↑</span>
                  </button>
                  <button @click="moveTechnologyDown(index)" class="move-tech" :title="t('admin.moveTechnologyDown')" v-if="index < currentProject.technologies.length - 1">
                    <span class="move-icon">↓</span>
                  </button>
                  <button @click="removeTechnology(index)" class="remove-tech" :title="t('admin.removeTechnology')">
                    <span class="x-icon">×</span>
                  </button>
                </div>
              </span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="image" class="form-label">
              <i class="fas fa-images mr-2"></i>
              {{ t('admin.projectImages') }}
            </label>
            <div class="image-upload-container">
              <input 
                type="file" 
                id="image" 
                @change="uploadProjectImage" 
                accept="image/*"
                class="file-input"
                multiple
              />
              <label for="image" class="file-label">
                <i class="fas fa-cloud-upload-alt mr-2"></i>
                {{ t('admin.chooseImages') }}
              </label>
              <span v-if="isSubmitting" class="ml-2 uploading-indicator">
                <span class="spinner-sm"></span>
                {{ t('common.uploading') }}...
              </span>
            </div>
            
            <div v-if="currentProject.imageUrls && currentProject.imageUrls.length > 0" class="images-preview">
              <div v-for="(imageUrl, index) in currentProject.imageUrls" :key="index" class="image-preview-item">
                <img 
                  :src="imageUrl" 
                  alt="Project preview" 
                  class="preview-img" 
                  @error="handleImageError"
                  @load="imageLoaded = true"
                />
                <div class="image-actions">
                  <button @click="removeProjectImage(index)" class="remove-image" title="Remove image">
                    <i class="fas fa-times"></i>
                  </button>
                  <button v-if="index > 0" @click="moveImageUp(index)" class="move-image" title="Move up">
                    <i class="fas fa-arrow-up"></i>
                  </button>
                  <button v-if="index < currentProject.imageUrls.length - 1" @click="moveImageDown(index)" class="move-image" title="Move down">
                    <i class="fas fa-arrow-down"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- For backward compatibility - show single image if using old format -->
            <div v-else-if="currentProject.imageUrl" class="image-preview">
              <img 
                :src="currentProject.imageUrl" 
                alt="Project preview" 
                class="preview-img" 
                @error="handleImageError"
                @load="imageLoaded = true"
              />
              <button @click="removeProjectImage(-1)" class="remove-image">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label for="githubUrl" class="form-label">
              <i class="fab fa-github mr-2"></i>
              {{ t('admin.githubUrl') }}
            </label>
            <input 
              type="text" 
              id="githubUrl" 
              v-model="currentProject.githubUrl" 
              :placeholder="t('admin.enterGithubUrl')"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="liveUrl" class="form-label">
              <i class="fas fa-globe mr-2"></i>
              {{ t('admin.liveUrl') }}
            </label>
            <input 
              type="text" 
              id="liveUrl" 
              v-model="currentProject.liveUrl" 
              :placeholder="t('admin.enterLiveUrl')"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="featured" class="form-label">
              <i class="fas fa-star mr-2"></i>
              {{ t('admin.featured') }}
            </label>
            <input 
              type="checkbox" 
              id="featured" 
              v-model="currentProject.featured" 
              class="form-checkbox"
            />
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="showProjectModal = false" class="btn btn-secondary">
            <i class="fas fa-times mr-1"></i>
            {{ t('common.cancel') }}
          </button>
          <button 
            @click="saveProject" 
            class="btn btn-primary save-btn" 
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="spinner-sm mr-1"></span>
            <i v-else class="fas fa-{{ isEditing ? 'save' : 'plus' }} mr-1"></i>
            {{ isEditing ? t('common.update') : t('common.save') }}
          </button>
        </div>
      </div>
    </div>

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
  imageUrls?: string[]
  imageUrl?: string
  imagePublicId?: string
  imagePublicIds?: string[]
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
  imageUrls: [] as string[],
  imageUrl: '',
  imagePublicIds: [] as string[],
  imagePublicId: '',
  githubUrl: '',
  liveUrl: '',
  featured: false
})

const imageLoaded = ref(false)

const projectCarouselIndices = ref<Record<string, number>>({})

function getProjectCarouselIndex(projectId: string): number {
  return projectCarouselIndices.value[projectId] || 0;
}

function setProjectCarouselIndex(projectId: string, index: number): void {
  projectCarouselIndices.value[projectId] = index;
}

function nextProjectImage(projectId: string): void {
  const project = projects.value.find(p => p.id === projectId);
  if (!project || !project.imageUrls || project.imageUrls.length <= 1) return;
  
  const currentIndex = getProjectCarouselIndex(projectId);
  const nextIndex = (currentIndex + 1) % project.imageUrls.length;
  setProjectCarouselIndex(projectId, nextIndex);
}

function prevProjectImage(projectId: string): void {
  const project = projects.value.find(p => p.id === projectId);
  if (!project || !project.imageUrls || project.imageUrls.length <= 1) return;
  
  const currentIndex = getProjectCarouselIndex(projectId);
  const prevIndex = (currentIndex - 1 + project.imageUrls.length) % project.imageUrls.length;
  setProjectCarouselIndex(projectId, prevIndex);
}

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
        imageUrls: project.imageUrls || [],
        imageUrl: project.imageUrl || '',
        imagePublicIds: project.imagePublicIds || [],
        imagePublicId: project.imagePublicId || '',
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        featured: project.featured
      }
      
      if (!project.imageUrls && project.imageUrl) {
        currentProject.value.imageUrls = [project.imageUrl];
        if (project.imagePublicId) {
          currentProject.value.imagePublicIds = [project.imagePublicId];
        }
      }
    } else {
      isEditing.value = false
      currentProject.value = {
        id: '',
        title: '',
        description: '',
        technologies: [],
        imageUrls: [],
        imageUrl: '',
        imagePublicIds: [],
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

function moveTechnologyUp(index: number) {
  if (index > 0) {
    const tech = currentProject.value.technologies.splice(index, 1)[0]
    currentProject.value.technologies.splice(index - 1, 0, tech)
  }
}

function moveTechnologyDown(index: number) {
  if (index < currentProject.value.technologies.length - 1) {
    const tech = currentProject.value.technologies.splice(index, 1)[0]
    currentProject.value.technologies.splice(index + 1, 0, tech)
  }
}

async function uploadProjectImage(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (!files || files.length === 0) return
  
  isSubmitting.value = true
  
  if (!currentProject.value.imageUrls) {
    currentProject.value.imageUrls = [];
  }
  
  if (!currentProject.value.imagePublicIds) {
    currentProject.value.imagePublicIds = [];
  }
  
  let uploadedCount = 0;
  const totalFiles = files.length;
  
  const uploadPromises = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const formData = new FormData()
    formData.append('file', file)
    
    const uploadPromise = api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-auth-token': authStore.token as string
      }
    }).then(response => {
      currentProject.value.imageUrls.push(response.data.filePath);
      currentProject.value.imagePublicIds.push(response.data.publicId);
      
      if (currentProject.value.imageUrls.length === 1) {
        currentProject.value.imageUrl = response.data.filePath;
        currentProject.value.imagePublicId = response.data.publicId;
      }
      
      uploadedCount++;
      
      if (uploadedCount === totalFiles) {
        notificationStore.addNotification({
          type: 'success',
          message: files.length > 1 ? t('admin.imagesUploaded') : t('admin.imageUploaded'),
          duration: 3000
        });
      }
    }).catch(error => {
      console.error('Error uploading image:', error);
      notificationStore.addNotification({
        type: 'error',
        message: t('admin.imageUploadError'),
        duration: 5000
      });
    });
    
    uploadPromises.push(uploadPromise);
  }
  
  try {
    await Promise.all(uploadPromises);
  } finally {
    isSubmitting.value = false;
    (event.target as HTMLInputElement).value = '';
  }
}

function removeProjectImage(index: number) {
  if (index === -1) {
    currentProject.value.imageUrl = '';
    currentProject.value.imagePublicId = '';
    currentProject.value.imageUrls = [];
    currentProject.value.imagePublicIds = [];
  } else {
    currentProject.value.imageUrls.splice(index, 1);
    if (currentProject.value.imagePublicIds && currentProject.value.imagePublicIds.length > index) {
      currentProject.value.imagePublicIds.splice(index, 1);
    }
    
    if (index === 0 && currentProject.value.imageUrls.length > 0) {
      currentProject.value.imageUrl = currentProject.value.imageUrls[0];
      currentProject.value.imagePublicId = currentProject.value.imagePublicIds?.[0] || '';
    } else if (currentProject.value.imageUrls.length === 0) {
      currentProject.value.imageUrl = '';
      currentProject.value.imagePublicId = '';
    }
  }
}

function moveImageUp(index: number) {
  if (index <= 0 || index >= currentProject.value.imageUrls.length) return;
  
  [currentProject.value.imageUrls[index], currentProject.value.imageUrls[index - 1]] =
  [currentProject.value.imageUrls[index - 1], currentProject.value.imageUrls[index]];
  
  if (currentProject.value.imagePublicIds && currentProject.value.imagePublicIds.length > index) {
    [currentProject.value.imagePublicIds[index], currentProject.value.imagePublicIds[index - 1]] = 
    [currentProject.value.imagePublicIds[index - 1], currentProject.value.imagePublicIds[index]];
  }
  
  if (index === 1) {
    currentProject.value.imageUrl = currentProject.value.imageUrls[0];
    currentProject.value.imagePublicId = currentProject.value.imagePublicIds?.[0] || '';
  }
}

function moveImageDown(index: number) {
  if (index < 0 || index >= currentProject.value.imageUrls.length - 1) return;
  
  [currentProject.value.imageUrls[index], currentProject.value.imageUrls[index + 1]] =
  [currentProject.value.imageUrls[index + 1], currentProject.value.imageUrls[index]];
  
  if (currentProject.value.imagePublicIds && currentProject.value.imagePublicIds.length > index + 1) {
    [currentProject.value.imagePublicIds[index], currentProject.value.imagePublicIds[index + 1]] = 
    [currentProject.value.imagePublicIds[index + 1], currentProject.value.imagePublicIds[index]];
  }
  
  if (index === 0) {
    currentProject.value.imageUrl = currentProject.value.imageUrls[0];
    currentProject.value.imagePublicId = currentProject.value.imagePublicIds?.[0] || '';
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
  console.error('Failed to load image:', currentProject.value.imageUrl)
  notificationStore.addNotification({
    type: 'error',
    message: t('admin.imageLoadError'),
    duration: 5000
  })
}

function previewImage(imageUrl: string) {
  window.open(imageUrl, '_blank')
}

onMounted(() => {
  fetchProjects()
})
</script>

<style scoped lang="scss">
.admin-projects {
  padding: 1.5rem;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
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
  background-color: var(--bg-secondary);
  transition: transform 0.2s, box-shadow 0.2s;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.project-image {
  position: relative;
  height: 12rem;
  overflow: hidden;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

.project-image-carousel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.carousel-images {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease;
}

.carousel-images img {
  flex-shrink: 0;
  width: 100%;
}

.carousel-controls {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  opacity: 0;
  transition: opacity 0.3s ease, background-color 0.3s ease;
}

.project-image-carousel:hover .carousel-control {
  opacity: 1;
}

.carousel-prev {
  left: 10px;
}

.carousel-next {
  right: 10px;
}

.carousel-control:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.carousel-indicators {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 5px;
  pointer-events: auto;
}

.carousel-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.carousel-indicator.active {
  background-color: white;
}

.no-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
}

.no-image-placeholder i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
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
  color: var(--text-secondary);
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
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
}

.tech-tag {
  display: inline-flex;
  align-items: center;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
}

.x-icon {
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 0.8;
  margin-left: 0.3rem;
}

.tag-actions {
  display: inline-flex;
  align-items: center;
  margin-left: 0.5rem;
}

.move-tech, .remove-tech {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0;
  margin-left: 0.3rem;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  
  &:hover {
    color: white;
  }
}

.remove-tech {
  &:hover {
    color: #ff5252;
  }
}

.project-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  opacity: 0;
  transition: opacity 0.2s ease;
}

.btn:hover::before {
  opacity: 1;
}

.btn:active {
  transform: translateY(1px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 6px;
}

.btn-primary {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.btn-secondary {
  background: linear-gradient(135deg, #9ca3af, #6b7280);
  color: white;
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #6b7280, #4b5563);
}

.btn-danger {
  background: linear-gradient(135deg, #f87171, #ef4444);
  color: white;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.btn-edit {
  background: linear-gradient(135deg, #67e8f9, #06b6d4);
  color: white;
}

.btn-edit:hover {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
}

.btn-delete {
  background: linear-gradient(135deg, #f87171, #ef4444);
  color: white;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.btn-view {
  background: linear-gradient(135deg, #a78bfa, #8b5cf6);
  color: white;
}

.btn-view:hover {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  background: linear-gradient(135deg, #d1d5db, #9ca3af);
  color: #f3f4f6;
  box-shadow: none;
}

.btn:disabled::before {
  display: none;
}

.tech-add-btn {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  color: white;
  border-radius: 6px;
}

.tech-add-btn:hover {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.file-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.file-label::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  opacity: 0;
  transition: opacity 0.2s ease;
}

.file-label:hover::before {
  opacity: 1;
}

.file-label:hover {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-image:hover {
  background: rgba(239, 68, 68, 0.8);
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
  background-color: var(--bg-primary);
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: modal-appear 0.3s ease-out;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-sm {
  max-width: 400px;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid var(--bg-secondary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-secondary);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
}

.modal-body {
  padding: 1.5rem;
  color: var(--text-primary);
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--bg-secondary);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  background-color: var(--bg-primary);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--bg-secondary);
  border-radius: 6px;
  font-size: 1rem;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(var(--accent-rgb), 0.25);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
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
  margin-top: 0.75rem;
}

.tech-tag {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.tech-tag:hover {
  background-color: var(--accent-light);
  border-color: var(--accent);
}

.remove-tech {
  background: none;
  border: none;
  color: var(--text-secondary);
  margin-left: 0.5rem;
  cursor: pointer;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.1);
}

.remove-tech:hover {
  color: #dc3545;
  background-color: rgba(220, 53, 69, 0.1);
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.checkbox-container:hover {
  background-color: var(--bg-secondary);
}

.checkbox-container input {
  margin-right: 0.5rem;
  width: 18px;
  height: 18px;
}

.featured-checkbox {
  margin-top: 1rem;
}

.featured-icon {
  color: #ffc107;
}

.image-upload-container {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.file-input {
  display: none;
}

.file-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.file-label::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  opacity: 0;
  transition: opacity 0.2s ease;
}

.file-label:hover::before {
  opacity: 1;
}

.file-label:hover {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.images-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.image-preview-item {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-actions {
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.move-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;
}

.move-image:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.save-btn {
  min-width: 100px;
}

:root {
  --border-color: rgba(125, 125, 125, 0.2);
  --accent-light: rgba(var(--accent-rgb), 0.1);
  --accent-rgb: 59, 130, 246;
}

.dark-mode {
  --border-color: rgba(125, 125, 125, 0.3);
}

.add-project-btn {
  white-space: nowrap;
}

.move-icon {
  font-size: 1rem;
  font-weight: bold;
  line-height: 0.8;
}
</style>
