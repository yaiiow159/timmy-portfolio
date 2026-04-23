<template>
  <div class="admin-projects min-h-screen">
    <div class="page-toolbar flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6 sm:mb-8">
      <div class="min-w-0">
        <h1 class="tech-title text-2xl sm:text-3xl font-bold mb-2">{{ t('admin.projectsManagement') }}</h1>
        <p class="text-text-secondary text-sm sm:text-base">{{ t('admin.manageProjectsDescription') }}</p>
      </div>
      <button
        @click="openCreateModal()"
        class="tech-button inline-flex shrink-0 items-center justify-center px-5 py-3 sm:px-6 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 tech-glow w-full sm:w-auto"
      >
        <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ t('admin.addProject') }}
      </button>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <div class="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-text-secondary">{{ t('common.loading') }}</p>
    </div>
    
    <div v-else-if="projects.length > 0">
      <!-- 排序工具列 -->
      <div class="sort-bar">
        <span class="sort-label">
          <i class="fas fa-sort-amount-down"></i> {{ t('common.sortBy') }}：
        </span>
        <div class="sort-buttons">
          <button
            v-for="opt in sortOptions"
            :key="opt.value"
            class="sort-btn"
            :class="{ active: sortKey === opt.value }"
            @click="setSort(opt.value)"
          >
            {{ opt.label }}
            <i v-if="sortKey === opt.value" :class="sortOrder === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
          </button>
        </div>
        <span class="sort-count">{{ projects.length }} {{ t('admin.projects') }}</span>
      </div>

      <!-- 專案卡片列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-for="project in sortedProjects" :key="project.id" class="project-card tech-card">
          <!-- 圖片區：手動翻頁，無自動輪播 -->
          <div class="project-image">
            <div v-if="project.images && project.images.length > 0" class="image-wrapper">
              <img
                :src="project.images[project.currentImageIndex]"
                :alt="`${project.title} - Image ${project.currentImageIndex + 1}`"
                class="card-img"
                loading="lazy"
              />
              <template v-if="project.images.length > 1">
                <button class="img-nav img-prev" @click.prevent="prevProjectImage(project.id)">
                  <i class="fas fa-chevron-left"></i>
                </button>
                <button class="img-nav img-next" @click.prevent="nextProjectImage(project.id)">
                  <i class="fas fa-chevron-right"></i>
                </button>
                <span class="img-counter">{{ project.currentImageIndex + 1 }} / {{ project.images.length }}</span>
              </template>
              <span v-if="project.featured" class="featured-badge">
                <i class="fas fa-star"></i>
              </span>
            </div>
            <div v-else class="no-image-placeholder">
              <i class="fas fa-image"></i>
              <span>{{ t('admin.noImage') }}</span>
            </div>
          </div>

          <!-- 標題 + 類型 -->
          <div class="card-info">
            <h3 class="card-title" :title="project.title">{{ project.title }}</h3>
            <div class="card-meta">
              <span class="meta-badge">{{ project.projectType }}</span>
              <span class="meta-badge">{{ project.platformType }}</span>
            </div>
          </div>

          <!-- 操作按鈕 -->
          <div class="card-actions">
            <button @click="openEditModal(project)" class="btn btn-edit">
              <i class="fas fa-edit"></i> {{ t('common.edit') }}
            </button>
            <button @click="openDeleteModal(project.id)" class="btn btn-delete">
              <i class="fas fa-trash"></i> {{ t('common.delete') }}
            </button>
          </div>
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
            <RichTextEditor 
              v-model="currentProject.description"
              :placeholder="t('admin.enterDescription')"
              :rows="8"
              :show-preview="true"
            />
          </div>
          <div class="form-group">
            <label class="form-label">{{ t('admin.projectType') }}</label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" v-model="currentProject.projectType" value="personal" />
                <span>{{ t('admin.personalProject') }}</span>
              </label>
              <label class="radio-label">
                <input type="radio" v-model="currentProject.projectType" value="work" />
                <span>{{ t('admin.workProject') }}</span>
              </label>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">{{ t('admin.vcsType') }}</label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" v-model="currentProject.vcsType" value="github" />
                <i class="fab fa-github"></i>
                <span>{{ t('admin.github') }}</span>
              </label>
              <label class="radio-label">
                <input type="radio" v-model="currentProject.vcsType" value="gitlab" />
                <i class="fab fa-gitlab"></i>
                <span>{{ t('admin.gitlab') }}</span>
              </label>
              <label class="radio-label">
                <input type="radio" v-model="currentProject.vcsType" value="bitbucket" />
                <i class="fab fa-bitbucket"></i>
                <span>{{ t('admin.bitbucket') }}</span>
              </label>
              <label class="radio-label">
                <input type="radio" v-model="currentProject.vcsType" value="other" />
                <i class="fas fa-code-branch"></i>
                <span>{{ t('admin.other') }}</span>
              </label>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">{{ t('admin.platformType') }}</label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" v-model="currentProject.platformType" value="web" />
                <i class="fas fa-globe"></i>
                <span>{{ t('admin.web') }}</span>
              </label>
              <label class="radio-label">
                <input type="radio" v-model="currentProject.platformType" value="mobile" />
                <i class="fas fa-mobile-alt"></i>
                <span>{{ t('admin.mobile') }}</span>
              </label>
              <label class="radio-label">
                <input type="radio" v-model="currentProject.platformType" value="desktop" />
                <i class="fas fa-desktop"></i>
                <span>{{ t('admin.desktop') }}</span>
              </label>
              <label class="radio-label">
                <input type="radio" v-model="currentProject.platformType" value="script" />
                <i class="fas fa-terminal"></i>
                <span>{{ t('admin.script') }}</span>
              </label>
              <label class="radio-label">
                <input type="radio" v-model="currentProject.platformType" value="api" />
                <i class="fas fa-server"></i>
                <span>{{ t('admin.api') }}</span>
              </label>
            </div>
          </div>
          <div class="form-group">
            <label for="codeUrl" class="form-label">{{ t('admin.repositoryUrl') }}</label>
            <input type="text" id="codeUrl" v-model="currentProject.codeUrl" class="form-control" :placeholder="t('admin.enterRepositoryUrl')" />
          </div>
          <div class="form-group">
            <label for="live" class="form-label">{{ t('admin.liveUrl') }}</label>
            <input type="text" id="live" v-model="currentProject.liveUrl" class="form-control" :placeholder="t('admin.enterLiveUrl')" />
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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import api from '@/services/api';
import type { Project, ProjectType, VCSType } from '@/types/project';
import RichTextEditor from '@/components/common/RichTextEditor.vue';
import { projectService } from '@/services/projectService';
import { handleSuccess, handleError, ErrorContext } from '@/utils/errorHandler';

interface AdminProject extends Project {
  currentImageIndex: number;
  images: string[];
  projectType: ProjectType;
  vcsType: VCSType;
}

const { t } = useI18n();

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

/** One stable object URL per selected File (WeakMap so GC cleans entries when File is dropped). */
const filePreviewUrls = new WeakMap<File, string>();

function revokeFilePreview(file: File) {
  const url = filePreviewUrls.get(file);
  if (url) {
    URL.revokeObjectURL(url);
    filePreviewUrls.delete(file);
  }
}

function revokeAllSelectedFilePreviews() {
  for (const file of selectedFiles.value) {
    revokeFilePreview(file);
  }
}

const emptyProject: AdminProject = {
  id: '',
  title: '',
  description: '',
  technologies: [],
  images: [],
  liveUrl: '',
  codeUrl: '',
  featured: false,
  projectType: 'personal',
  vcsType: 'github',
  platformType: 'web',
  date: '',
  currentImageIndex: 0
};

const currentProject = reactive<AdminProject>({ ...emptyProject });

onMounted(async () => {
  await fetchProjects();
});

async function fetchProjects() {
  try {
    loading.value = true;
    const allProjects = await projectService.getAllProjects();
    projects.value = allProjects.map((project: Project) => ({
      ...project,
      images: project.imageUrl ? (Array.isArray(project.imageUrl) ? project.imageUrl : [project.imageUrl]) : [],
      currentImageIndex: 0,
      projectType: project.projectType || 'personal',
      vcsType: project.vcsType || 'github',
      platformType: project.platformType || 'web'
    }));
    } catch (error) {
    handleError(error, { context: ErrorContext.ADMIN, showNotification: true });
  } finally {
    loading.value = false;
  }
}

// 排序狀態：預設依日期新到舊
type SortKey = 'date' | 'title';
const sortKey = ref<SortKey>('date');
const sortOrder = ref<'asc' | 'desc'>('desc');

const sortOptions = [
  { value: 'date' as SortKey, label: t('admin.sortByDate') },
  { value: 'title' as SortKey, label: t('admin.sortByTitle') }
];

function setSort(key: SortKey) {
  if (sortKey.value === key) {
    // 同欄位再點一次則切換升降冪
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = key === 'date' ? 'desc' : 'asc';
  }
}

const sortedProjects = computed(() => {
  return [...projects.value].sort((a, b) => {
    let cmp = 0;
    if (sortKey.value === 'date') {
      cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      cmp = a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
    }
    return sortOrder.value === 'asc' ? cmp : -cmp;
  });
});

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

function openCreateModal() {
  isEditing.value = false;
  Object.assign(currentProject, {
    ...emptyProject,
    id: '',
    projectType: 'personal',
    vcsType: 'github'
  });
  
  selectedFiles.value = [];
  
  showModal.value = true;
}

function openEditModal(project: AdminProject) {
  isEditing.value = true;
  Object.assign(currentProject, {
    ...project,
    technologies: [...project.technologies],
    images: project.images ? [...project.images] : [],
    projectType: project.projectType || 'personal',
    vcsType: project.vcsType || 'github',
    currentImageIndex: 0
  });
  showModal.value = true;
}

function closeModal() {
  // 關閉彈窗時主動釋放預覽資源，避免反覆開關造成記憶體累積
  revokeAllSelectedFilePreviews();
  selectedFiles.value = [];
  showModal.value = false;
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
  selectedFiles.value = input.files ? Array.from(input.files) : [];
}

function getPreviewUrl(file: File): string {
  let url = filePreviewUrls.get(file);
  if (!url) {
    url = URL.createObjectURL(file);
    filePreviewUrls.set(file, url);
  }
  return url;
}

function removeSelectedFile(index: number) {
  const file = selectedFiles.value[index];
  if (file) revokeFilePreview(file);
  selectedFiles.value.splice(index, 1);
  if (fileInputRef.value && selectedFiles.value.length === 0) {
    fileInputRef.value.value = '';
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
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data && response.data.filePath) {
          currentProject.images.push(response.data.filePath);
        }
      } catch (uploadError) {
        console.error('Error uploading individual image:', uploadError);
        handleError(uploadError, {
          context: ErrorContext.ADMIN,
          showNotification: true,
          customMessage: t('admin.errorUploadingImage') + `: ${file.name}`
        });
      }
    }
    
    if (currentProject.images.length > 0) {
      handleSuccess(
        selectedFiles.value.length > 1 
          ? t('admin.multipleImagesUploaded') 
          : t('admin.imageUploaded')
      );
    }
    
    revokeAllSelectedFilePreviews();
    selectedFiles.value = [];
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    handleError(error, {
      context: ErrorContext.ADMIN,
      showNotification: true,
      customMessage: t('admin.errorUploadingImage')
    });
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
      imageUrl: currentProject.images.length > 0 ? currentProject.images : undefined,
      liveUrl: currentProject.liveUrl,
      codeUrl: currentProject.codeUrl,
      featured: currentProject.featured,
      projectType: currentProject.projectType,
      vcsType: currentProject.vcsType
    };

    if (isEditing.value) {
      await projectService.updateProject(
        { id: currentProject.id, ...projectData }
      );
      handleSuccess(t('admin.projectUpdated'));
    } else {
      await projectService.createProject(projectData);
      handleSuccess(t('admin.projectCreated'));
    }
    
    await fetchProjects();
    closeModal();
  } catch (error) {
    handleError(error, { context: ErrorContext.ADMIN, showNotification: true });
  }
}

async function deleteProject() {
  if (!projectIdToDelete.value) return;
  
  try {
    await projectService.deleteProject(projectIdToDelete.value);
    handleSuccess(t('admin.projectDeleted'));
    await fetchProjects();
    closeDeleteModal();
  } catch (error) {
    handleError(error, { context: ErrorContext.ADMIN, showNotification: true });
  }
}

onUnmounted(() => {
  revokeAllSelectedFilePreviews();
});
</script>

<style scoped lang="scss">
.admin-projects {
  padding: 2rem;

  @media (max-width: 640px) {
    padding: 1rem;
  }

  .sort-bar .sort-count {
    @media (max-width: 480px) {
      margin-left: 0;
      width: 100%;
      flex-basis: 100%;
    }
  }
  
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
  
  /* 排序工具列 */
  .sort-bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
    flex-wrap: wrap;

    .sort-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      white-space: nowrap;
    }

    .sort-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .sort-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.4rem 0.85rem;
      border-radius: 0.5rem;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(var(--bg-secondary-rgb), 0.45);
      color: var(--text-secondary);
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--accent);
        color: var(--text-primary);
      }

      &.active {
        background: var(--accent);
        border-color: var(--accent);
        color: var(--accent-text-color);
      }
    }

    .sort-count {
      margin-left: auto;
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
  }

  /* 精簡卡片 */
  .project-card {
    border-radius: 0.75rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: var(--secondary);
    transition: box-shadow 0.2s ease, transform 0.2s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
    }

    .project-image {
      position: relative;
      height: 160px;
      overflow: hidden;
      background: rgba(var(--bg-secondary-rgb), 0.45);

      .image-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
      }

      .card-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      /* 手動翻頁箭頭：常駐顯示 */
      .img-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.55);
        color: #fff;
        border: none;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 4;
        transition: background 0.2s;
        font-size: 0.7rem;

        &:hover { background: rgba(0, 0, 0, 0.85); }
        &.img-prev { left: 6px; }
        &.img-next { right: 6px; }
      }

      .img-counter {
        position: absolute;
        bottom: 6px;
        right: 8px;
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
        font-size: 0.7rem;
        padding: 2px 7px;
        border-radius: 10px;
        z-index: 4;
      }

      .featured-badge {
        position: absolute;
        top: 6px;
        left: 8px;
        background: var(--accent);
        color: var(--accent-text-color);
        font-size: 0.7rem;
        padding: 2px 8px;
        border-radius: 10px;
        z-index: 4;
      }

      .no-image-placeholder {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary);

        i { font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5; }
        span { font-size: 0.8rem; }
      }
    }

    .card-info {
      padding: 0.75rem 0.875rem 0.5rem;
      flex: 1;

      .card-title {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 0.4rem;
      }

      .card-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
      }

      .meta-badge {
        font-size: 0.7rem;
        padding: 2px 8px;
        border-radius: 10px;
        background: rgba(var(--bg-secondary-rgb), 0.45);
        color: var(--text-secondary);
        border: 1px solid rgba(255, 255, 255, 0.08);
        text-transform: capitalize;
      }
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
      padding: 0.625rem 0.875rem 0.75rem;

      .btn {
        flex: 1;
        padding: 0.45rem 0.6rem;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.35rem;
        font-size: 0.82rem;
        font-weight: 500;
        transition: all 0.2s ease;

        &.btn-edit {
          background: var(--accent);
          color: var(--accent-text-color);
          &:hover { filter: brightness(1.15); }
        }

        &.btn-delete {
          background: rgba(220, 53, 69, 0.12);
          color: #dc3545;
          &:hover { background: #dc3545; color: #fff; }
        }
      }
    }
  }
  
  .no-projects {
    background-color: var(--secondary);
    border-radius: 0.5rem;
    padding: 2rem;
    text-align: center;
    
    i {
      font-size: 3rem;
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }
    
    p {
      font-size: 1.25rem;
      color: var(--text-secondary);
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
      background: linear-gradient(145deg, var(--primary), var(--secondary)) !important;
      color: var(--text-primary);
      border-radius: 16px;
      width: min(100% - 1.5rem, 90vw);
      max-width: 800px;
      max-height: min(90vh, 100dvh - 2rem);
      overflow-y: auto;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.28);
      position: relative;
      border: 1px solid rgba(var(--accent-rgb), 0.2);
      
      &.modal-sm {
        max-width: 500px;
      }
      
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
        border-bottom: 1px solid rgba(var(--accent-rgb), 0.15);
        background: linear-gradient(to right, var(--secondary-dark), var(--secondary));
        border-radius: 16px 16px 0 0;
        
        h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--accent);
        }
        
        .close-button {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 1.5rem;
          cursor: pointer;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s, transform 0.2s, color 0.2s;
          
          &:hover {
            background-color: rgba(var(--accent-rgb), 0.12);
            color: var(--accent);
            transform: rotate(90deg);
          }
        }
      }
      
      .modal-body {
        padding: 2rem;
        background: linear-gradient(145deg, var(--primary), var(--secondary)) !important;
        position: relative;
        z-index: 1;
        max-height: calc(90vh - 180px);
        overflow-y: auto;
        
        &::-webkit-scrollbar {
          width: 8px;
        }
        
        &::-webkit-scrollbar-track {
          background: rgba(var(--accent-rgb), 0.06);
          border-radius: 4px;
        }
        
        &::-webkit-scrollbar-thumb {
          background: rgba(var(--accent-rgb), 0.35);
          border-radius: 4px;
          
          &:hover {
            background: rgba(var(--accent-rgb), 0.5);
          }
        }
        
        .form-group {
          margin-bottom: 1.75rem;
          
          .form-label {
            display: block;
            margin-bottom: 0.75rem;
            font-weight: 500;
            color: var(--accent);
          }
          
          .form-control {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            border: 1px solid rgba(var(--accent-rgb), 0.22);
            background-color: rgba(var(--bg-secondary-rgb), 0.45);
            color: var(--text-primary);
            transition: border-color 0.3s, box-shadow 0.3s;
            
            &:focus {
              outline: none;
              border-color: var(--accent);
              box-shadow: 0 0 0 2px rgba(var(--accent-rgb), 0.25);
            }
            
            &::placeholder {
              color: var(--text-secondary);
              opacity: 0.7;
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
              accent-color: var(--accent);
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
                background-color: rgba(var(--accent-rgb), 0.2);
                color: var(--accent);
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
                    color: var(--text-primary);
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
              background-color: rgba(var(--accent-rgb), 0.1);
              color: var(--text-primary);
              border-radius: 8px;
              cursor: pointer;
              transition: background-color 0.3s;
              border: 1px dashed rgba(var(--accent-rgb), 0.35);
              
              &:hover {
                background-color: rgba(var(--accent-rgb), 0.16);
              }
            }
            
            .upload-btn {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              padding: 0.75rem 1.25rem;
              background-color: var(--accent);
              color: var(--accent-text-color, #fff);
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
              background-color: rgba(var(--accent-rgb), 0.06);
              border: 1px solid rgba(var(--accent-rgb), 0.15);
              
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
                    background-color: rgba(var(--accent-rgb), 0.25);
                    transform: scale(1.1);
                  }
                  
                  &.btn-remove:hover {
                    background-color: rgba(var(--tech-red-rgb), 0.85);
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
        border-top: 1px solid rgba(var(--accent-rgb), 0.15);
        background: linear-gradient(to right, var(--secondary), var(--secondary-dark));
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
            background-color: var(--accent);
            color: var(--accent-text-color);
            
            &:hover:not(:disabled) {
              background-color: var(--accent-dark);
            }
          }
          
          &.btn-secondary {
            background-color: rgba(var(--accent-rgb), 0.12);
            color: var(--text-primary);
            
            &:hover {
              background-color: rgba(var(--accent-rgb), 0.22);
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

.radio-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
  
  .radio-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 0.875rem 1rem;
    border: 2px solid rgba(var(--accent-rgb), 0.2);
    border-radius: 10px;
    transition: all 0.3s ease;
    background: rgba(var(--accent-rgb), 0.04);
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, transparent, rgba(var(--accent-rgb), 0.1));
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    &:hover {
      border-color: var(--accent);
      background-color: rgba(var(--accent-rgb), 0.08);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.12);
      
      &::before {
        opacity: 1;
      }
    }
    
    input[type="radio"] {
      cursor: pointer;
      width: 18px;
      height: 18px;
      accent-color: var(--accent);
      flex-shrink: 0;
      
      &:checked ~ span,
      &:checked ~ i {
        color: var(--accent);
        font-weight: 600;
      }
    }
    
    &:has(input[type="radio"]:checked) {
      border-color: var(--accent);
      background-color: rgba(var(--accent-rgb), 0.15);
      box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.2);
    }
    
    i {
      font-size: 1.25rem;
      transition: color 0.3s;
      flex-shrink: 0;
    }
    
    span {
      transition: color 0.3s, font-weight 0.3s;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.project-description {
  white-space: pre-line;
  line-height: 1.6;
}

.project-description.line-clamp-3 {
  line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
