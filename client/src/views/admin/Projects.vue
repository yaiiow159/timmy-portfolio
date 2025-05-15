<template>
  <div class="admin-projects">
    <div class="header-container">
      <h1>{{ t('admin.projectsManagement') }}</h1>
      <button 
        @click="openCreateModal()" 
        class="btn btn-primary"
      >
        <i class="fas fa-plus mr-2"></i> {{ t('admin.addProject') }}
      </button>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>{{ t('common.loading') }}</p>
    </div>
    
    <div v-else-if="projects.length > 0" class="projects-grid">
      <div v-for="project in projects" :key="project.id" class="project-card">
        <div class="project-image">
          <div 
            v-if="project.images && project.images.length > 0" 
            class="project-image-carousel"
            @mouseenter="handleMouseEnter(project.id)"
            @mouseleave="handleMouseLeave(project.id)"
          >
            <div class="carousel-images">
              <transition-group name="fade">
                <img 
                  v-for="(image, index) in project.images" 
                  :key="`${project.id}-img-${index}`"
                  :src="image" 
                  :alt="`${project.title} - Image ${index + 1}`"
                  class="carousel-image"
                  v-show="project.currentImageIndex === index"
                />
              </transition-group>
            </div>
            
            <div class="carousel-controls">
              <button @click.prevent="prevProjectImage(project.id)" class="carousel-control carousel-prev">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button @click.prevent="nextProjectImage(project.id)" class="carousel-control carousel-next">
                <i class="fas fa-chevron-right"></i>
              </button>
              
              <div class="carousel-indicators">
                <button 
                  v-for="(_, index) in project.images" 
                  :key="`${project.id}-indicator-${index}`"
                  @click="goToImage(project.id, index)"
                  class="carousel-indicator"
                  :class="{ active: project.currentImageIndex === index }"
                ></button>
              </div>
            </div>
            
            <div class="carousel-counter" v-if="project.images.length > 1">
              {{ project.currentImageIndex + 1 }} / {{ project.images.length }}
            </div>
          </div>
          
          <div 
            v-else
            class="no-image-placeholder"
          >
            <i class="fas fa-image"></i>
            <span>{{ t('admin.noImage') }}</span>
          </div>
        </div>
        
        <div class="project-content">
          <h3 class="project-title">{{ project.title }}</h3>
          <div class="project-description line-clamp-3" v-html="'<p>' + formatDescription(project.description) + '</p>'"></div>
          
          <div class="project-tech">
            <span 
              v-for="(tech, index) in project.technologies" 
              :key="`${project.id}-tech-${index}`"
              class="tech-tag"
            >
              <i class="fas fa-tag"></i> {{ tech }}
            </span>
          </div>
          
          <div class="project-links" v-if="project.codeUrl || project.liveUrl">
            <a v-if="project.codeUrl" :href="project.codeUrl" target="_blank" class="project-link">
              <i class="fab fa-github"></i> GitHub
            </a>
            <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" class="project-link">
              <i class="fas fa-external-link-alt"></i> Live Demo
            </a>
          </div>
          
          <div class="project-actions">
            <button @click="openEditModal(project)" class="btn btn-edit">
              <i class="fas fa-edit"></i> {{ t('common.edit') }}
            </button>
            <button @click="openDeleteModal(project.id)" class="btn btn-delete">
              <i class="fas fa-trash"></i> {{ t('common.delete') }}
            </button>
          </div>
        </div>
        
        <div class="project-badge" v-if="project.featured">
          <i class="fas fa-star"></i> {{ t('admin.featured') }}
        </div>
      </div>
    </div>
    
    <div v-else class="no-projects">
      <i class="fas fa-folder-open text-4xl mb-2"></i>
      <p>{{ t('admin.noProjects') }}</p>
      <button @click="openCreateModal()" class="btn btn-primary mt-4">
        <i class="fas fa-plus mr-2"></i> {{ t('admin.addFirstProject') }}
      </button>
    </div>
    
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div :class="['modal-container', { 'modal-sm': currentProject.id === null }]">
        <div class="modal-header">
          <h2>{{ currentProject.id ? t('admin.editProject') : t('admin.addProject') }}</h2>
          <button class="close-button" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="title" class="form-label">{{ t('admin.projectTitle') }}</label>
            <input type="text" id="title" v-model="currentProject.title" class="form-control" :placeholder="t('admin.enterTitle')" />
          </div>
          <div class="form-group">
            <label for="description" class="form-label">{{ t('admin.projectDescription') }}</label>
            <textarea 
              id="description" 
              v-model="currentProject.description" 
              class="form-control description-textarea" 
              :placeholder="t('admin.enterDescription')"
              rows="5"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="github" class="form-label">GitHub URL</label>
            <input type="text" id="github" v-model="currentProject.codeUrl" class="form-control" placeholder="Enter GitHub URL" />
          </div>
          <div class="form-group">
            <label for="live" class="form-label">Live URL</label>
            <input type="text" id="live" v-model="currentProject.liveUrl" class="form-control" placeholder="Enter live URL" />
          </div>
          <div class="form-group">
            <div class="checkbox-group">
              <input type="checkbox" id="featured" v-model="currentProject.featured" />
              <label for="featured">{{ t('admin.featured') }}</label>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">{{ t('admin.technologies') }}</label>
            <div class="technologies-container">
              <div class="technology-input-group">
                <input 
                  type="text" 
                  v-model="newTechnology" 
                  class="form-control" 
                  :placeholder="t('admin.enterTechnology')" 
                  @keyup.enter="addTechnology"
                />
                <button class="btn btn-primary" @click="addTechnology">{{ t('admin.add') }}</button>
              </div>
              <div class="technologies-list">
                <div v-for="(tech, index) in currentProject.technologies" :key="index" class="technology-tag">
                  <span>{{ tech }}</span>
                  <button class="remove-tag" @click="removeTechnology(index)" title="Remove">×</button>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">{{ t('admin.projectImages') }}</label>
            <div class="file-input-container">
              <input
                  type="file"
                  id="image"
                  @change="handleFileChange"
                  accept="image/*"
                  class="file-input"
                  ref="fileInputRef"
                  multiple
              />
              <label for="image" class="file-input-label">
                <i class="fas fa-file-image mr-1"></i>
                {{ t('admin.selectImage') }}
              </label>
              <button
                  @click="uploadImages"
                  class="upload-btn"
                  :disabled="!selectedFiles.length || uploadingImage"
              >
                <i class="fas fa-upload mr-1"></i>
                {{ uploadingImage ? t('common.uploading') : t('admin.uploadImage') }}
              </button>
            </div>
            
            <div v-if="selectedFiles.length > 0" class="selected-files-preview">
              <div v-for="(file, index) in selectedFiles" :key="index" class="selected-file-item">
                <img :src="getPreviewUrl(file)" alt="Selected image preview" class="preview-thumbnail" />
                <span class="file-name">{{ file.name }}</span>
                <button @click="removeSelectedFile(index)" class="remove-selected-file">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
            
            <div v-if="currentProject.images && currentProject.images.length > 0" class="images-preview">
              <div 
                v-for="(image, index) in currentProject.images" 
                :key="`manage-${index}`" 
                class="image-item"
              >
                <img 
                  :src="image" 
                  alt="Project preview" 
                />
                <div class="image-actions">
                  <button @click="removeImage(index)" class="btn-remove" title="Remove image">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                  <button v-if="index > 0" @click="moveImageUp(index)" class="btn-move-up" title="Move up">
                    <i class="fas fa-arrow-up"></i>
                  </button>
                  <button v-if="index < currentProject.images.length - 1" @click="moveImageDown(index)" class="btn-move-down" title="Move down">
                    <i class="fas fa-arrow-down"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeModal" class="btn btn-secondary">
            <i class="fas fa-times mr-1"></i>
            {{ t('common.cancel') }}
          </button>
          <button 
            @click="saveProject" 
            class="btn btn-primary" 
            :disabled="uploadingImage"
          >
            <i class="fas fa-save mr-1"></i>
            {{ isEditing ? t('common.update') : t('common.save') }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="modal-container modal-sm">
        <div class="modal-header">
          <h2>{{ t('admin.confirmDelete') }}</h2>
          <button @click="closeDeleteModal" class="close-button">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <p>{{ t('admin.deleteProjectConfirmation') }}</p>
        </div>
        
        <div class="modal-footer">
          <button @click="closeDeleteModal" class="btn btn-secondary">
            {{ t('common.cancel') }}
          </button>
          <button 
            @click="deleteProject" 
            class="btn btn-danger" 
          >
            {{ t('common.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useNotificationStore } from '@/store/notificationStore';
import api from '@/services/api';
import type { Project } from '@/types/project';
import { useAuthStore } from '@/store/authStore';
import { formatDescription } from '@/utils/textFormatters';

interface AdminProject extends Project {
  currentImageIndex: number;
  intervalId?: number;
  images: string[];
}

const { t } = useI18n();
const notificationStore = useNotificationStore();
const authStore = useAuthStore();

const projects = ref<AdminProject[]>([]);
const loading = ref(true);
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const projectIdToDelete = ref<string | null>(null);
const selectedFiles = ref<File[]>([]);
const uploadingImage = ref(false);
const newTechnology = ref('');
const fileInputRef = ref<HTMLInputElement | null>(null);

const emptyProject: AdminProject = {
  id: '',
  title: '',
  description: '',
  technologies: [],
  images: [],
  liveUrl: '',
  codeUrl: '',
  featured: false,
  date: '',
  currentImageIndex: 0
};

const currentProject = reactive<AdminProject>({ ...emptyProject });

onMounted(async () => {
  await fetchProjects();
  startAllCarousels();
});

onUnmounted(() => {
  stopAllCarousels();
});

async function fetchProjects() {
  try {
    loading.value = true;
    const response = await api.get('/projects');
    projects.value = response.data.map((project: Project) => ({
      ...project,
      images: project.imageUrl ? (Array.isArray(project.imageUrl) ? project.imageUrl : [project.imageUrl]) : [], // Convert imageUrl to images array
      currentImageIndex: 0
    }));
    startAllCarousels();
  } catch (error) {
    notificationStore.addNotification({
      message: t('admin.errorFetchingProjects'),
      type: 'error',
      duration: 5000
    });
    console.error('Error fetching projects:', error);
  } finally {
    loading.value = false;
  }
}

function startAllCarousels() {
  projects.value.forEach(project => {
    if (project.images && project.images.length > 1) {
      startCarousel(project.id);
    }
  });
}

function stopAllCarousels() {
  projects.value.forEach(project => {
    if (project.intervalId) {
      clearInterval(project.intervalId);
      project.intervalId = undefined;
    }
  });
}

function startCarousel(projectId: string) {
  const project = projects.value.find(p => p.id === projectId);
  if (!project || project.intervalId || !project.images || project.images.length <= 1) return;
  
  project.intervalId = window.setInterval(() => {
    nextProjectImage(projectId);
  }, 5000);
}

function stopCarousel(projectId: string) {
  const project = projects.value.find(p => p.id === projectId);
  if (!project || !project.intervalId) return;
  
  clearInterval(project.intervalId);
  project.intervalId = undefined;
}

function handleMouseEnter(projectId: string) {
  stopCarousel(projectId);
}

function handleMouseLeave(projectId: string) {
  const project = projects.value.find(p => p.id === projectId);
  if (project && project.images && project.images.length > 1) {
    startCarousel(projectId);
  }
}

function prevProjectImage(projectId: string) {
  const project = projects.value.find(p => p.id === projectId);
  if (!project || !project.images || !project.images.length) return;
  
  project.currentImageIndex = (project.currentImageIndex - 1 + project.images.length) % project.images.length;
}

function nextProjectImage(projectId: string) {
  const project = projects.value.find(p => p.id === projectId);
  if (!project || !project.images || !project.images.length) return;
  
  project.currentImageIndex = (project.currentImageIndex + 1) % project.images.length;
}

function goToImage(projectId: string, index: number) {
  const project = projects.value.find(p => p.id === projectId);
  if (!project || !project.images || !project.images.length) return;
  
  project.currentImageIndex = index;
}

function openCreateModal() {
  isEditing.value = false;
  currentProject.id = '';
  currentProject.title = '';
  currentProject.description = '';
  currentProject.technologies = [];
  currentProject.images = [];
  currentProject.liveUrl = '';
  currentProject.codeUrl = '';
  currentProject.featured = false;
  currentProject.date = '';
  currentProject.currentImageIndex = 0;
  
  selectedFiles.value = [];
  
  showModal.value = true;
}

function openEditModal(project: AdminProject) {
  isEditing.value = true;
  Object.assign(currentProject, {
    ...project,
    technologies: [...project.technologies],
    images: project.images ? [...project.images] : [],
    currentImageIndex: 0
  });
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  selectedFiles.value = [];
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
}

function openDeleteModal(projectId: string) {
  projectIdToDelete.value = projectId;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  projectIdToDelete.value = null;
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    selectedFiles.value = Array.from(input.files);
    selectedFiles.value.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
        }
      };
      reader.readAsDataURL(file);
    });
  } else {
    selectedFiles.value = [];
  }
}

function getPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

function removeSelectedFile(index: number) {
  selectedFiles.value.splice(index, 1);
  if (fileInputRef.value) {
    if (selectedFiles.value.length === 0) {
      fileInputRef.value.value = '';
    }
  }
}

async function uploadImages() {
  if (!selectedFiles.value.length) return;
  
  try {
    uploadingImage.value = true;
    
    for (const file of selectedFiles.value) {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await api.post('/uploads', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': authStore.token as string
          }
        });
        
        if (response.data && response.data.filePath) {
          currentProject.images.push(response.data.filePath);
        }
      } catch (uploadError) {
        console.error('Error uploading individual image:', uploadError);
        notificationStore.addNotification({
          message: t('admin.errorUploadingImage') + `: ${file.name}`,
          type: 'error',
          duration: 5000
        });
      }
    }
    
    if (currentProject.images.length > 0) {
      notificationStore.addNotification({
        message: selectedFiles.value.length > 1 
          ? t('admin.multipleImagesUploaded') 
          : t('admin.imageUploaded'),
        type: 'success',
        duration: 3000
      });
    }
    
    selectedFiles.value = [];
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
  } catch (error) {
    notificationStore.addNotification({
      message: t('admin.errorUploadingImage'),
      type: 'error',
      duration: 5000
    });
    console.error('Error uploading image:', error);
  } finally {
    uploadingImage.value = false;
  }
}

function removeImage(index: number) {
  currentProject.images.splice(index, 1);
}

function moveImageUp(index: number) {
  if (index > 0) {
    const temp = currentProject.images[index];
    currentProject.images[index] = currentProject.images[index - 1];
    currentProject.images[index - 1] = temp;
  }
}

function moveImageDown(index: number) {
  if (index < currentProject.images.length - 1) {
    const temp = currentProject.images[index];
    currentProject.images[index] = currentProject.images[index + 1];
    currentProject.images[index + 1] = temp;
  }
}

function addTechnology() {
  if (newTechnology.value.trim() && !currentProject.technologies.includes(newTechnology.value.trim())) {
    currentProject.technologies.push(newTechnology.value.trim());
    newTechnology.value = '';
  }
}

function removeTechnology(index: number) {
  currentProject.technologies.splice(index, 1);
}

async function saveProject() {
  try {
    const projectData = {
      title: currentProject.title,
      description: currentProject.description,
      technologies: currentProject.technologies,
      imageUrl: currentProject.images.length > 0 ? currentProject.images : undefined, // Convert images back to imageUrl
      liveUrl: currentProject.liveUrl,
      codeUrl: currentProject.codeUrl,
      featured: currentProject.featured
    };

    if (isEditing.value) {
      await api.put(`/projects/${currentProject.id}`, projectData);
      notificationStore.addNotification({
        message: t('admin.projectUpdated'),
        type: 'success',
        duration: 3000
      });
    } else {
      await api.post('/projects', projectData);
      notificationStore.addNotification({
        message: t('admin.projectCreated'),
        type: 'success',
        duration: 3000
      });
    }
    
    await fetchProjects();
    closeModal();
  } catch (error) {
    notificationStore.addNotification({
      message: t('admin.errorSavingProject'),
      type: 'error',
      duration: 5000
    });
    console.error('Error saving project:', error);
  }
}

async function deleteProject() {
  if (!projectIdToDelete.value) return;
  
  try {
    await api.delete(`/projects/${projectIdToDelete.value}`);
    notificationStore.addNotification({
      message: t('admin.projectDeleted'),
      type: 'success',
      duration: 3000
    });
    await fetchProjects();
    closeDeleteModal();
  } catch (error) {
    notificationStore.addNotification({
      message: t('admin.errorDeletingProject'),
      type: 'error',
      duration: 5000
    });
    console.error('Error deleting project:', error);
  }
}
</script>

<style scoped lang="scss">
.admin-projects {
  padding: 2rem;
  
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    
    h1 {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0;
    }
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    
    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top: 4px solid #3498db;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }
  
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
    
    .project-card {
      background: linear-gradient(145deg, var(--surface-card), var(--surface-section));
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
      }
      
      .project-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background-color: var(--accent-color);
        color: white;
        padding: 0.5rem 0.75rem;
        border-radius: 2rem;
        font-size: 0.75rem;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 0.25rem;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        z-index: 5;
      }
      
      .project-image {
        position: relative;
        height: 220px;
        overflow: hidden;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--accent-color), var(--accent-dark));
        }
        
        .project-image-carousel {
          position: relative;
          height: 100%;
          width: 100%;
          
          .carousel-images {
            height: 100%;
            width: 100%;
            position: relative;
            
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: transform 0.5s ease;
            }
          }
          
          .carousel-counter {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background-color: rgba(0, 0, 0, 0.6);
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 1rem;
            font-size: 0.75rem;
            z-index: 5;
          }
          
          .carousel-controls {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            background: linear-gradient(
              to right,
              rgba(0, 0, 0, 0.3) 0%,
              rgba(0, 0, 0, 0) 15%,
              rgba(0, 0, 0, 0) 85%,
              rgba(0, 0, 0, 0.3) 100%
            );
            
            .carousel-control {
              background: rgba(0, 0, 0, 0.5);
              color: white;
              border: none;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              margin: 0 1rem;
              transition: all 0.3s ease;
              z-index: 10;
              
              &:hover {
                background: rgba(0, 0, 0, 0.8);
                transform: scale(1.1);
              }
            }
            
            .carousel-indicators {
              position: absolute;
              bottom: 1rem;
              left: 0;
              width: 100%;
              display: flex;
              justify-content: center;
              gap: 0.5rem;
              z-index: 10;
              
              .carousel-indicator {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
                
                &.active {
                  background: white;
                  transform: scale(1.2);
                }
                
                &:hover {
                  background: rgba(255, 255, 255, 0.8);
                }
              }
            }
          }
          
          &:hover {
            .carousel-controls {
              opacity: 1;
            }
            
            img {
              transform: scale(1.05);
            }
          }
        }
        
        .no-image-placeholder {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, #f5f5f5, #e0e0e0);
          color: #999;
          
          i {
            font-size: 2.5rem;
            margin-bottom: 0.75rem;
            opacity: 0.7;
          }
        }
      }
      
      .project-content {
        padding: 1.75rem;
        flex: 1;
        display: flex;
        flex-direction: column;
        background: var(--surface-card);
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        
        .project-title {
          font-size: 1.35rem;
          font-weight: bold;
          margin-bottom: 0.75rem;
          color: var(--text-color);
          position: relative;
          padding-bottom: 0.75rem;
          
          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 50px;
            height: 3px;
            background: var(--accent-color);
            border-radius: 3px;
          }
        }
        
        .project-description {
          color: var(--text-color-secondary);
          margin-bottom: 1.25rem;
          line-height: 1.6;
          flex: 1;
          white-space: pre-line;
        }
        
        .project-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
          
          .tech-tag {
            background: linear-gradient(145deg, var(--surface-section), var(--surface-hover));
            padding: 0.35rem 0.75rem;
            border-radius: 2rem;
            font-size: 0.85rem;
            color: var(--text-color);
            border: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            align-items: center;
            gap: 0.35rem;
            transition: all 0.2s ease;
            
            i {
              color: var(--accent-color);
              font-size: 0.75rem;
            }
            
            &:hover {
              background: var(--surface-hover);
              transform: translateY(-2px);
              box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
            }
          }
        }
        
        .project-links {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.25rem;
          
          .project-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--accent-color);
            text-decoration: none;
            font-weight: 500;
            transition: all 0.2s ease;
            
            &:hover {
              color: var(--accent-dark);
              transform: translateY(-2px);
            }
            
            i {
              font-size: 1rem;
            }
          }
        }
        
        .project-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: auto;
          
          .btn {
            padding: 0.6rem 1.25rem;
            border-radius: 0.5rem;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
            transition: all 0.3s ease;
            
            &.btn-edit {
              background-color: var(--accent-color);
              color: var(--accent-text-color, white);
              
              &:hover {
                background-color: var(--accent-dark);
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
            }
            
            &.btn-delete {
              background-color: rgba(220, 53, 69, 0.1);
              color: #dc3545;
              
              &:hover {
                background-color: #dc3545;
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
            }
          }
        }
      }
    }
  }
  
  .no-projects {
    background-color: var(--surface-card);
    border-radius: 0.5rem;
    padding: 2rem;
    text-align: center;
    
    i {
      font-size: 3rem;
      color: var(--text-color-secondary);
      margin-bottom: 1rem;
    }
    
    p {
      font-size: 1.25rem;
      color: var(--text-color-secondary);
      margin-bottom: 1.5rem;
    }
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    
    .modal-container {
      background: linear-gradient(145deg, #2d2d2d, #3a3a3a) !important;
      color: #ffffff;
      border-radius: 16px;
      width: 90%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
      position: relative;
      border: 1px solid rgba(255, 255, 255, 0.1);
      
      &.modal-sm {
        max-width: 500px;
      }
      
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        background: linear-gradient(to right, #333333, #444444);
        border-radius: 16px 16px 0 0;
        
        h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--accent-color);
        }
        
        .close-button {
          background: none;
          border: none;
          color: #ffffff;
          font-size: 1.5rem;
          cursor: pointer;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s, transform 0.2s;
          
          &:hover {
            background-color: rgba(255, 255, 255, 0.1);
            transform: rotate(90deg);
          }
        }
      }
      
      .modal-body {
        padding: 2rem;
        background: linear-gradient(145deg, #2d2d2d, #3a3a3a) !important;
        position: relative;
        z-index: 1;
        
        .form-group {
          margin-bottom: 1.75rem;
          
          .form-label {
            display: block;
            margin-bottom: 0.75rem;
            font-weight: 500;
            color: var(--accent-color);
          }
          
          .form-control {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background-color: rgba(255, 255, 255, 0.05);
            color: #ffffff;
            transition: border-color 0.3s, box-shadow 0.3s;
            
            &:focus {
              outline: none;
              border-color: var(--accent-color);
              box-shadow: 0 0 0 2px rgba(var(--accent-color-rgb), 0.25);
            }
            
            &::placeholder {
              color: rgba(255, 255, 255, 0.5);
            }
          }
          
          textarea.form-control {
            min-height: 120px;
            resize: vertical;
          }
          
          .checkbox-group {
            display: flex;
            align-items: center;
            
            input[type="checkbox"] {
              margin-right: 0.5rem;
              width: 18px;
              height: 18px;
              accent-color: var(--accent-color);
            }
            
            label {
              cursor: pointer;
            }
          }
          
          .technologies-container {
            .technology-input-group {
              display: flex;
              gap: 0.5rem;
              margin-bottom: 1rem;
              
              .form-control {
                flex: 1;
              }
              
              .btn {
                padding: 0.75rem 1rem;
              }
            }
            
            .technologies-list {
              display: flex;
              flex-wrap: wrap;
              gap: 0.5rem;
              
              .technology-tag {
                display: flex;
                align-items: center;
                background-color: rgba(var(--accent-color-rgb), 0.2);
                color: var(--accent-color);
                padding: 0.5rem 0.75rem;
                border-radius: 50px;
                font-size: 0.875rem;
                
                .remove-tag {
                  background: none;
                  border: none;
                  color: currentColor;
                  margin-left: 0.5rem;
                  cursor: pointer;
                  font-size: 1.25rem;
                  line-height: 1;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 0;
                  
                  &:hover {
                    color: #ffffff;
                  }
                }
              }
            }
          }
          
          .file-input-container {
            display: flex;
            gap: 0.75rem;
            margin-bottom: 1rem;
            
            .file-input {
              display: none;
            }
            
            .file-input-label {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              padding: 0.75rem 1.25rem;
              background-color: rgba(255, 255, 255, 0.1);
              color: #ffffff;
              border-radius: 8px;
              cursor: pointer;
              transition: background-color 0.3s;
              border: 1px dashed rgba(255, 255, 255, 0.3);
              
              &:hover {
                background-color: rgba(255, 255, 255, 0.15);
              }
            }
            
            .upload-btn {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              padding: 0.75rem 1.25rem;
              background-color: var(--accent-color);
              color: #ffffff;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              transition: background-color 0.3s, transform 0.2s;
              
              &:hover:not(:disabled) {
                background-color: var(--accent-dark);
                transform: translateY(-2px);
              }
              
              &:disabled {
                opacity: 0.6;
                cursor: not-allowed;
              }
            }
          }
          
          .selected-files-preview {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 1.5rem;
            
            .selected-file-item {
              position: relative;
              width: 100px;
              border-radius: 8px;
              overflow: hidden;
              background-color: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(255, 255, 255, 0.1);
              
              .preview-thumbnail {
                width: 100%;
                height: 100px;
                object-fit: cover;
              }
              
              .file-name {
                display: block;
                font-size: 0.75rem;
                padding: 0.25rem;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              
              .remove-selected-file {
                position: absolute;
                top: 0.25rem;
                right: 0.25rem;
                background-color: rgba(0, 0, 0, 0.5);
                color: white;
                border: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.75rem;
                cursor: pointer;
                transition: background-color 0.2s;
                
                &:hover {
                  background-color: rgba(255, 0, 0, 0.7);
                }
              }
            }
          }
          
          .images-preview {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 1rem;
            
            .image-item {
              position: relative;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              aspect-ratio: 1;
              
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s;
              }
              
              &:hover {
                img {
                  transform: scale(1.05);
                }
                
                .image-actions {
                  opacity: 1;
                }
              }
              
              .image-actions {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: space-around;
                padding: 0.5rem;
                opacity: 0;
                transition: opacity 0.3s;
                
                button {
                  background: none;
                  border: none;
                  color: white;
                  cursor: pointer;
                  width: 30px;
                  height: 30px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transition: background-color 0.2s, transform 0.2s;
                  
                  &:hover {
                    background-color: rgba(255, 255, 255, 0.2);
                    transform: scale(1.1);
                  }
                  
                  &.btn-remove:hover {
                    background-color: rgba(255, 0, 0, 0.7);
                  }
                }
              }
            }
          }
        }
      }
      
      .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding: 1.5rem 2rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        background: linear-gradient(to right, #333333, #444444);
        border-radius: 0 0 16px 16px;
        
        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, box-shadow 0.2s;
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
          
          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          
          &.btn-primary {
            background-color: var(--accent-color);
            color: white;
            
            &:hover:not(:disabled) {
              background-color: var(--accent-dark);
            }
          }
          
          &.btn-secondary {
            background-color: rgba(255, 255, 255, 0.1);
            color: white;
            
            &:hover {
              background-color: rgba(255, 255, 255, 0.2);
            }
          }
          
          &.btn-danger {
            background-color: #dc3545;
            color: white;
            
            &:hover {
              background-color: #bd2130;
            }
          }
        }
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.description-textarea {
  min-height: 120px;
  line-height: 1.5;
  white-space: pre-wrap;
}

.project-description {
  white-space: pre-line;
  line-height: 1.6;
}

.project-description.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
