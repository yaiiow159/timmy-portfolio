<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { markdownToHtml } from '@/utils/markdown.ts'
import { validateFileSize, isImageFile } from '@/utils/fileUpload.ts'
import { blogService } from '@/services/blogService.ts'
import { useAuthStore } from '@/store/authStore.ts' // Import authStore
import type { BlogPost } from '@/store/blogStore.ts'

const props = defineProps<{
  post?: BlogPost
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', post: Partial<BlogPost>): void
  (e: 'cancel'): void
}>()

const title = ref(props.post?.title || '')
const content = ref(props.post?.content || '')
const tags = ref(props.post?.tags?.join(', ') || '')
const previewMode = ref(false)
const isUploading = ref(false)
const uploadError = ref('')

const htmlContent = computed(() => {
  return markdownToHtml(content.value)
})

function insertAtCursor(textarea: HTMLTextAreaElement, text: string) {
  const startPos = textarea.selectionStart
  const endPos = textarea.selectionEnd
  
  textarea.value = textarea.value.substring(0, startPos) + text + textarea.value.substring(endPos)
  
  textarea.selectionStart = startPos + text.length
  textarea.selectionEnd = startPos + text.length
  
  textarea.focus()
}

function insertMarkdown(type: string) {
  const textarea = document.getElementById('content') as HTMLTextAreaElement
  if (!textarea) return
  
  const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd)
  
  switch (type) {
    case 'bold':
      if (selectedText) {
        insertAtCursor(textarea, `**${selectedText}**`)
      } else {
        insertAtCursor(textarea, '**bold text**')
      }
      break
    case 'italic':
      if (selectedText) {
        insertAtCursor(textarea, `*${selectedText}*`)
      } else {
        insertAtCursor(textarea, '*italic text*')
      }
      break
    case 'heading':
      insertAtCursor(textarea, `\n## ${selectedText || 'Heading'}\n`)
      break
    case 'link':
      if (selectedText) {
        insertAtCursor(textarea, `[${selectedText}](url)`)
      } else {
        insertAtCursor(textarea, '[link text](url)')
      }
      break
    case 'image':
      insertAtCursor(textarea, `![${selectedText || 'alt text'}](image-url)`)
      break
    case 'code':
      if (selectedText) {
        insertAtCursor(textarea, `\`\`\`\n${selectedText}\n\`\`\``)
      } else {
        insertAtCursor(textarea, '```\ncode block\n```')
      }
      break
    case 'list':
      insertAtCursor(textarea, `\n- List item 1\n- List item 2\n- List item 3\n`)
      break
  }
}

async function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  
  const file = input.files[0]
  
  if (!isImageFile(file)) {
    uploadError.value = 'Please upload an image file'
    return
  }
  
  if (!validateFileSize(file, 5 * 1024 * 1024)) {
    uploadError.value = 'Image size should be less than 5MB'
    return
  }
  
  try {
    isUploading.value = true
    uploadError.value = ''
    
    const authStore = useAuthStore()
    const result = await blogService.uploadImage(file, authStore.token as string)
    
    const textarea = document.getElementById('content') as HTMLTextAreaElement
    if (textarea) {
      insertAtCursor(textarea, `![Image](${result.filePath})`)
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    uploadError.value = 'Failed to upload image. Please try again.'
  } finally {
    isUploading.value = false
    input.value = ''
  }
}

function savePost() {
  if (!title.value.trim() || !content.value.trim()) {
    alert('Please fill in all required fields')
    return
  }
  
  const postData: Partial<BlogPost> = {
    title: title.value.trim(),
    content: content.value.trim(),
    tags: tags.value.split(',').map(tag => tag.trim()).filter(tag => tag)
  }
  
  emit('save', postData)
}

function autoResizeTextarea(event: Event) {
  const textarea = event.target as HTMLTextAreaElement
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`
}

onMounted(() => {
  // Initialize textarea height
  const textarea = document.getElementById('content') as HTMLTextAreaElement
  if (textarea) {
    textarea.style.height = `${textarea.scrollHeight}px`
  }
})
</script>

<template>
  <div class="bg-secondary rounded-lg p-6 shadow-lg">
    <div class="mb-6 flex justify-between items-center">
      <h2 class="text-2xl font-bold text-text-primary">
        {{ isEditing ? 'Edit Post' : 'Create New Post' }}
      </h2>
      <div class="flex items-center space-x-2">
        <button 
          @click="previewMode = !previewMode" 
          class="px-4 py-2 rounded-lg border border-gray-700 text-text-secondary hover:text-accent transition-colors"
        >
          {{ previewMode ? 'Edit' : 'Preview' }}
        </button>
        <button 
          @click="emit('cancel')" 
          class="px-4 py-2 rounded-lg border border-gray-700 text-text-secondary hover:text-accent transition-colors"
        >
          Cancel
        </button>
        <button 
          @click="savePost" 
          class="px-4 py-2 bg-accent hover:bg-accent-light text-white font-medium rounded-lg transition-colors"
        >
          Save
        </button>
      </div>
    </div>
    
    <div v-if="!previewMode" class="space-y-6">
      <div>
        <label for="title" class="block text-sm font-medium text-text-secondary mb-1">
          Title *
        </label>
        <input 
          v-model="title"
          type="text" 
          id="title"
          class="w-full bg-primary border border-gray-700 rounded-lg py-3 px-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Enter post title"
          required
        />
      </div>
      
      <div>
        <label for="tags" class="block text-sm font-medium text-text-secondary mb-1">
          Tags (comma separated)
        </label>
        <input 
          v-model="tags"
          type="text" 
          id="tags"
          class="w-full bg-primary border border-gray-700 rounded-lg py-3 px-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Vue.js, TypeScript, Frontend"
        />
      </div>
      
      <div class="flex flex-wrap gap-2 p-2 bg-primary rounded-t-lg border border-gray-700 border-b-0">
        <button 
          @click="insertMarkdown('bold')" 
          class="p-2 rounded hover:bg-gray-700 transition-colors" 
          title="Bold"
        >
          <span class="font-bold">B</span>
        </button>
        <button 
          @click="insertMarkdown('italic')" 
          class="p-2 rounded hover:bg-gray-700 transition-colors" 
          title="Italic"
        >
          <span class="italic">I</span>
        </button>
        <button 
          @click="insertMarkdown('heading')" 
          class="p-2 rounded hover:bg-gray-700 transition-colors" 
          title="Heading"
        >
          <span class="font-bold">H</span>
        </button>
        <button 
          @click="insertMarkdown('link')" 
          class="p-2 rounded hover:bg-gray-700 transition-colors" 
          title="Link"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>
        <button 
          @click="insertMarkdown('image')" 
          class="p-2 rounded hover:bg-gray-700 transition-colors" 
          title="Image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <button 
          @click="insertMarkdown('code')" 
          class="p-2 rounded hover:bg-gray-700 transition-colors" 
          title="Code Block"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
        <button 
          @click="insertMarkdown('list')" 
          class="p-2 rounded hover:bg-gray-700 transition-colors" 
          title="List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <label class="p-2 rounded hover:bg-gray-700 transition-colors cursor-pointer" title="Upload Image">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
          </svg>
          <input 
            type="file" 
            accept="image/*" 
            class="hidden" 
            @change="handleImageUpload"
          />
        </label>
      </div>
      
      <div>
        <textarea 
          v-model="content"
          id="content"
          rows="15"
          class="w-full bg-primary border border-gray-700 rounded-b-lg py-3 px-4 text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Write your post content in Markdown..."
          required
          @input="autoResizeTextarea"
        ></textarea>
        
        <div v-if="isUploading" class="mt-2 text-text-secondary">
          Uploading image...
        </div>
        <div v-if="uploadError" class="mt-2 text-red-500 text-sm">
          {{ uploadError }}
        </div>
      </div>
    </div>
    
    <div v-else class="space-y-6">
      <h1 class="text-3xl font-bold text-text-primary">{{ title || 'Untitled Post' }}</h1>
      
      <div v-if="tags" class="flex flex-wrap gap-2">
        <span 
          v-for="tag in tags.split(',').map(t => t.trim()).filter(t => t)" 
          :key="tag"
          class="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent"
        >
          {{ tag }}
        </span>
      </div>
      
      <div class="prose prose-invert max-w-none" v-html="htmlContent"></div>
    </div>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here */
</style>
