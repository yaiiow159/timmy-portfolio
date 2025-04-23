<template>
  <div class="edit-post">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-text-primary dark:text-text-primary-light">
        {{ isEditing ? t('admin.editPost') : t('admin.createPost') }}
      </h1>
      
      <div class="flex space-x-2">
        <button 
          @click="$router.push({ name: 'AdminPosts' })"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-text-primary dark:text-text-primary-light hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {{ t('admin.cancel') }}
        </button>
        
        <button 
          @click="savePost"
          class="px-4 py-2 bg-accent hover:bg-accent-light text-white rounded-lg flex items-center"
          :disabled="isSubmitting"
        >
          <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ t('admin.save') }}
        </button>
      </div>
    </div>
    
    <div class="bg-primary dark:bg-primary-light rounded-lg p-6">
      <form @submit.prevent="savePost">
        <!-- Title -->
        <div class="mb-4">
          <label class="block text-text-primary dark:text-text-primary-light mb-2" for="title">
            {{ t('admin.title') }} *
          </label>
          <input 
            v-model="form.title"
            type="text" 
            id="title"
            class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-text-primary dark:text-text-primary-light"
            :placeholder="t('admin.titlePlaceholder')"
            required
          >
        </div>
        
        <!-- Excerpt -->
        <div class="mb-4">
          <label class="block text-text-primary dark:text-text-primary-light mb-2" for="excerpt">
            {{ t('admin.excerpt') }} *
          </label>
          <textarea 
            v-model="form.excerpt"
            id="excerpt"
            rows="3"
            class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-text-primary dark:text-text-primary-light"
            :placeholder="t('admin.excerptPlaceholder')"
            required
          ></textarea>
        </div>
        
        <!-- Cover Image -->
        <div class="mb-4">
          <label class="block text-text-primary dark:text-text-primary-light mb-2" for="cover-image">
            {{ t('admin.coverImage') }}
          </label>
          
          <div class="flex items-center space-x-4">
            <div 
              v-if="form.coverImage" 
              class="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden"
            >
              <img :src="form.coverImage" alt="Cover" class="w-full h-full object-cover">
            </div>
            
            <div class="flex-1">
              <div class="flex items-center">
                <input 
                  v-model="form.coverImage"
                  type="text" 
                  id="cover-image"
                  class="flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-text-primary dark:text-text-primary-light"
                  :placeholder="t('admin.imageUrlPlaceholder')"
                >
                
                <span class="mx-2">{{ t('admin.or') }}</span>
                
                <label class="px-4 py-2 bg-secondary dark:bg-secondary-light text-text-primary dark:text-text-primary-light rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
                  {{ t('admin.upload') }}
                  <input 
                    type="file" 
                    accept="image/*" 
                    class="hidden" 
                    @change="uploadImage"
                  >
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Tags -->
        <div class="mb-4">
          <label class="block text-text-primary dark:text-text-primary-light mb-2" for="tags">
            {{ t('admin.tags') }}
          </label>
          
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <div 
              v-for="(tag, index) in form.tags" 
              :key="index"
              class="bg-secondary dark:bg-secondary-light px-3 py-1 rounded-full flex items-center"
            >
              <span class="text-text-primary dark:text-text-primary-light mr-2">{{ tag }}</span>
              <button 
                type="button"
                @click="removeTag(index)"
                class="text-text-secondary dark:text-text-secondary-light hover:text-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="flex items-center">
              <input 
                v-model="newTag"
                type="text" 
                class="px-3 py-1 border rounded-lg bg-white dark:bg-gray-800 text-text-primary dark:text-text-primary-light"
                :placeholder="t('admin.addTag')"
                @keydown.enter.prevent="addTag"
              >
              <button 
                type="button"
                @click="addTag"
                class="ml-2 p-1 bg-accent text-white rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Content -->
        <div class="mb-4">
          <label class="block text-text-primary dark:text-text-primary-light mb-2" for="content">
            {{ t('admin.content') }} *
          </label>
          
          <div class="border rounded-lg overflow-hidden">
            <div class="bg-gray-100 dark:bg-gray-700 px-4 py-2 flex justify-between items-center">
              <div class="flex space-x-2">
                <button 
                  type="button"
                  @click="insertMarkdown('**', '**')"
                  class="p-1 text-text-primary dark:text-text-primary-light hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  title="Bold"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </button>
                
                <button 
                  type="button"
                  @click="insertMarkdown('*', '*')"
                  class="p-1 text-text-primary dark:text-text-primary-light hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  title="Italic"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </button>
                
                <button 
                  type="button"
                  @click="insertMarkdown('# ', '')"
                  class="p-1 text-text-primary dark:text-text-primary-light hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  title="Heading"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </button>
                
                <button 
                  type="button"
                  @click="insertMarkdown('- ', '')"
                  class="p-1 text-text-primary dark:text-text-primary-light hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  title="List"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
                
                <button 
                  type="button"
                  @click="insertMarkdown('[', '](url)')"
                  class="p-1 text-text-primary dark:text-text-primary-light hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  title="Link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>
                
                <button 
                  type="button"
                  @click="insertMarkdown('![alt text](', ')')"
                  class="p-1 text-text-primary dark:text-text-primary-light hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  title="Image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                
                <button 
                  type="button"
                  @click="insertMarkdown('```\n', '\n```')"
                  class="p-1 text-text-primary dark:text-text-primary-light hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  title="Code Block"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </button>
              </div>
              
              <div class="flex items-center">
                <button 
                  type="button"
                  @click="previewMode = !previewMode"
                  class="flex items-center px-3 py-1 text-text-primary dark:text-text-primary-light hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {{ previewMode ? t('admin.edit') : t('admin.preview') }}
                </button>
              </div>
            </div>
            
            <div v-if="!previewMode">
              <textarea 
                v-model="form.content"
                id="content"
                rows="15"
                class="w-full px-3 py-2 bg-white dark:bg-gray-800 text-text-primary dark:text-text-primary-light font-mono"
                :placeholder="t('admin.contentPlaceholder')"
                required
                ref="contentTextarea"
              ></textarea>
            </div>
            
            <div v-else class="p-4 bg-white dark:bg-gray-800 min-h-[300px] prose prose-lg dark:prose-invert max-w-none">
              <div v-html="renderedContent"></div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '@/store/blogStore.ts'
import { useNotificationStore } from '@/store/notificationStore.ts'
import { marked } from 'marked'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()
const notificationStore = useNotificationStore()

const isEditing = computed(() => !!route.params.id)
const isSubmitting = ref(false)
const previewMode = ref(false)
const newTag = ref('')
const contentTextarea = ref<HTMLTextAreaElement | null>(null)

const form = ref({
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  tags: [] as string[]
})

// Render markdown content for preview
const renderedContent = computed(() => {
  try {
    return marked(form.value.content)
  } catch (error) {
    console.error('Error rendering markdown:', error)
    return '<p class="text-red-500">Error rendering content</p>'
  }
})

// Add a new tag
function addTag() {
  if (newTag.value.trim() && !form.value.tags.includes(newTag.value.trim())) {
    form.value.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

// Remove a tag
function removeTag(index: number) {
  form.value.tags.splice(index, 1)
}

// Insert markdown syntax into the content textarea
function insertMarkdown(prefix: string, suffix: string) {
  if (!contentTextarea.value) return
  
  const textarea = contentTextarea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = form.value.content.substring(start, end)
  
  const beforeText = form.value.content.substring(0, start)
  const afterText = form.value.content.substring(end)
  
  form.value.content = beforeText + prefix + selectedText + suffix + afterText
  
  // Set cursor position after insertion
  setTimeout(() => {
    textarea.focus()
    textarea.selectionStart = start + prefix.length + selectedText.length
    textarea.selectionEnd = start + prefix.length + selectedText.length
  }, 0)
}

// Upload an image
async function uploadImage(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  
  const file = input.files[0]
  
  try {
    isSubmitting.value = true
    const result = await blogStore.uploadImage(file)
    form.value.coverImage = result.filePath
    
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

// Save the post (create or update)
async function savePost() {
  try {
    isSubmitting.value = true
    
    if (isEditing.value) {
      // Update existing post
      await blogStore.updatePost(route.params.id as string, form.value)
      
      notificationStore.addNotification({
        type: 'success',
        message: t('admin.postUpdated'),
        duration: 5000
      })
    } else {
      // Create new post
      await blogStore.createPost({
        ...form.value,
        author: 'Timmy', // Add default author
        date: new Date().toISOString() // Add current date
      })
      
      notificationStore.addNotification({
        type: 'success',
        message: t('admin.postCreated'),
        duration: 5000
      })
    }
    
    // Redirect to posts list
    router.push({ name: 'AdminPosts' })
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

// Load post data if editing
onMounted(async () => {
  if (isEditing.value) {
    try {
      isSubmitting.value = true
      const post = await blogStore.fetchPostById(route.params.id as string)
      
      if (post) {
        form.value = {
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage || '',
          tags: [...post.tags]
        }
      }
    } catch (error) {
      notificationStore.addNotification({
        type: 'error',
        message: t('admin.loadError'),
        duration: 5000
      })
      router.push({ name: 'AdminPosts' })
    } finally {
      isSubmitting.value = false
    }
  }
})
</script>
