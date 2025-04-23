<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  validateFileType, 
  validateFileSize, 
  formatFileSize, 
  isImageFile,
  isVideoFile,
  createFileURL,
  revokeFileURL
} from '@/utils/fileUpload.ts'

const props = defineProps<{
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  maxFiles?: number
  label?: string
  helpText?: string
}>()

const emit = defineEmits<{
  (e: 'upload', files: File[]): void
  (e: 'error', message: string): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const dragActive = ref(false)
const selectedFiles = ref<File[]>([])
const previewUrls = ref<string[]>([])
const error = ref('')

// Default values
const maxSizeBytes = computed(() => props.maxSize || 5 * 1024 * 1024) // 5MB default
const maxSizeFormatted = computed(() => formatFileSize(maxSizeBytes.value))
const maxFilesCount = computed(() => props.multiple ? (props.maxFiles || 10) : 1)

// Handle file selection
function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  
  processFiles(Array.from(input.files))
}

// Handle drag and drop
function handleDragEnter(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
  dragActive.value = true
}

function handleDragLeave(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
  dragActive.value = false
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
  dragActive.value = true
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
  dragActive.value = false
  
  if (!event.dataTransfer) return
  
  const files = Array.from(event.dataTransfer.files)
  processFiles(files)
}

function processFiles(files: File[]) {
  error.value = ''
  
  if (selectedFiles.value.length + files.length > maxFilesCount.value) {
    error.value = `You can upload a maximum of ${maxFilesCount.value} files`
    emit('error', error.value)
    return
  }
  
  const validFiles: File[] = []
  
  for (const file of files) {
    if (!validateFileSize(file, maxSizeBytes.value)) {
      error.value = `File "${file.name}" exceeds the maximum size of ${maxSizeFormatted.value}`
      emit('error', error.value)
      continue
    }
    
    if (props.accept && !validateFileType(file, props.accept.split(',').map(type => type.trim()))) {
      error.value = `File "${file.name}" is not an accepted file type`
      emit('error', error.value)
      continue
    }
    
    validFiles.push(file)
  }
  
  if (validFiles.length === 0) return
  
  if (props.multiple) {
    selectedFiles.value = [...selectedFiles.value, ...validFiles]
    
    validFiles.forEach(file => {
      if (isImageFile(file) || isVideoFile(file)) {
        previewUrls.value.push(createFileURL(file))
      } else {
        previewUrls.value.push('')
      }
    })
  } else {
    if (previewUrls.value.length > 0) {
      revokeFileURL(previewUrls.value[0])
    }
    
    selectedFiles.value = [validFiles[0]]
    
    if (isImageFile(validFiles[0]) || isVideoFile(validFiles[0])) {
      previewUrls.value = [createFileURL(validFiles[0])]
    } else {
      previewUrls.value = ['']
    }
  }
  
  emit('upload', validFiles)
  
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function removeFile(index: number) {
  if (previewUrls.value[index]) {
    revokeFileURL(previewUrls.value[index])
  }
  
  selectedFiles.value.splice(index, 1)
  previewUrls.value.splice(index, 1)
}

function clearFiles() {
  previewUrls.value.forEach(url => {
    if (url) revokeFileURL(url)
  })
  
  selectedFiles.value = []
  previewUrls.value = []
  
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<template>
  <div>
    <div
      class="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center"
      :class="{ 'border-accent bg-accent/5': dragActive }"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @dragover="handleDragOver"
      @drop="handleDrop"
    >
      <div class="flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-text-secondary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        
        <p class="text-text-primary font-medium mb-2">
          {{ label || 'Drag and drop files here' }}
        </p>
        <p class="text-text-secondary text-sm mb-4">
          {{ helpText || `or click to browse (max ${maxSizeFormatted})` }}
        </p>
        
        <label class="px-4 py-2 bg-accent hover:bg-accent-light text-white font-medium rounded-lg transition-colors cursor-pointer">
          Browse Files
          <input 
            ref="fileInput"
            type="file"
            :accept="props.accept"
            :multiple="props.multiple"
            class="hidden"
            @change="handleFileSelect"
          />
        </label>
      </div>
    </div>
    
    <!-- Error Message -->
    <div v-if="error" class="mt-2 text-red-500 text-sm">
      {{ error }}
    </div>
    
    <!-- Selected Files -->
    <div v-if="selectedFiles.length > 0" class="mt-4">
      <div class="flex justify-between items-center mb-2">
        <h4 class="font-medium text-text-primary">Selected Files ({{ selectedFiles.length }})</h4>
        <button 
          @click="clearFiles" 
          class="text-sm text-text-secondary hover:text-accent transition-colors"
        >
          Clear All
        </button>
      </div>
      
      <ul class="space-y-2">
        <li 
          v-for="(file, index) in selectedFiles" 
          :key="index"
          class="flex items-center bg-primary rounded-lg p-3"
        >
          <!-- Preview for images -->
          <div v-if="isImageFile(file) && previewUrls[index]" class="w-12 h-12 mr-3 flex-shrink-0">
            <img 
              :src="previewUrls[index]" 
              :alt="file.name" 
              class="w-full h-full object-cover rounded"
            />
          </div>
          
          <!-- Icon for videos -->
          <div v-else-if="isVideoFile(file)" class="w-12 h-12 mr-3 flex-shrink-0 bg-gray-700 rounded flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <!-- Icon for other files -->
          <div v-else class="w-12 h-12 mr-3 flex-shrink-0 bg-gray-700 rounded flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <div class="flex-grow min-w-0">
            <p class="text-text-primary truncate">{{ file.name }}</p>
            <p class="text-text-secondary text-xs">{{ formatFileSize(file.size) }}</p>
          </div>
          
          <button 
            @click="removeFile(index)" 
            class="ml-2 text-text-secondary hover:text-red-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
