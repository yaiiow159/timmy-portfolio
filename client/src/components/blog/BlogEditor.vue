<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { useAuthStore } from '@/store/authStore'
import { useI18n } from 'vue-i18n'
import { blogService } from '@/services/blogService'
import type { BlogPost } from '@/store/blogStore'

const { t } = useI18n()
const authStore = useAuthStore()

const props = defineProps<{
  post?: BlogPost
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', post: Partial<BlogPost>): void
  (e: 'cancel'): void
}>()

const title = ref(props.post?.title || '')
const selectedTags = ref<string[]>(props.post?.tags || [])
const newTag = ref('')
const editorContent = ref(props.post?.content || '')
const coverImage = ref<File | null>(null)
const coverImagePreview = ref(props.post?.coverImage || '')
const isDragging = ref(false)

const editorOptions = {
  theme: 'snow',
  modules: {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }, { 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false
    },
    keyboard: {
      bindings: {}
    }
  },
  placeholder: t('editor.contentPlaceholder')
}

function addTag() {
  if (newTag.value.trim() && !selectedTags.value.includes(newTag.value.trim())) {
    selectedTags.value.push(newTag.value.trim())
    newTag.value = ''
  }
}

function removeTag(tag: string) {
  selectedTags.value = selectedTags.value.filter(t => t !== tag)
}

async function handleImageUpload(file: File): Promise<{ filePath: string; publicId: string }> {
  try {
    const result = await blogService.uploadImage(file, authStore.token as string)
    return result
  } catch (error) {
    console.error('Error uploading image:', error)
    return { filePath: '', publicId: '' }
  }
}

function handleImageDrop(event: DragEvent) {
  event.preventDefault()
  const dataTransfer = event.dataTransfer
  if (dataTransfer) {
    const files = dataTransfer.files
    if (files.length > 0) {
      handleImageSelect(files[0])
    }
  }
}

function handleImageSelect(file: File) {
  coverImage.value = file
  coverImagePreview.value = URL.createObjectURL(file)
}

async function savePost() {
  try {
    const errors = []
    
    if (!title.value.trim()) {
      errors.push(t('editor.titleRequired'))
    }
    
    const contentText = editorContent.value.replace(/<[^>]*>/g, '').trim()
    if (!contentText) {
      errors.push(t('editor.contentRequired'))
    }
    
    if (errors.length > 0) {
      alert(errors.join('\n'))
      return
    }

    let coverImageUrl = props.post?.coverImage || ''
    let coverImagePublicId = props.post?.coverImagePublicId || ''
    
    if (coverImage.value) {
      try {
        const result = await handleImageUpload(coverImage.value)
        if (result) {
          coverImageUrl = result.filePath
          coverImagePublicId = result.publicId
        }
      } catch (error) {
        console.error('Error uploading cover image:', error)
        alert(t('editor.imageUploadError'))
        return
      }
    }

    const postData: Partial<BlogPost> = {
      title: title.value.trim(),
      content: editorContent.value,
      tags: selectedTags.value,
      coverImage: coverImageUrl,
      coverImagePublicId: coverImagePublicId
    }

    if (!props.isEditing) {
      postData.excerpt = contentText.substring(0, 200) + '...'
      postData.date = new Date().toISOString()
    }

    emit('save', postData)
  } catch (error) {
    console.error('Error saving post:', error)
    alert(t('errors.blog.updateFailed'))
  }
}

function onEditorChange({ html }: { html: string }) {
  editorContent.value = html
}

let observer: MutationObserver | null = null

function onEditorReady(editor: any) {
  if (observer) {
    observer.disconnect()
  }
  
  let updateTimeout: ReturnType<typeof setTimeout> | null = null
  const debouncedUpdate = (content: string) => {
    if (updateTimeout) clearTimeout(updateTimeout)
    updateTimeout = setTimeout(() => {
      if (editorContent.value !== content) {
        editorContent.value = content
      }
    }, 100)
  }

  observer = new MutationObserver((mutations) => {
    if (mutations.length > 0) {
      const content = editor.root.innerHTML
      debouncedUpdate(content)
    }
  })

  observer.observe(editor.root, {
    childList: true,
    characterData: true,
    subtree: true
  })
  
  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
    if (updateTimeout) {
      clearTimeout(updateTimeout)
    }
  }
  
  onUnmounted(cleanup)
}
</script>

<template>
  <div class="bg-secondary dark:bg-secondary-dark rounded-lg p-8 shadow-lg">
    <div class="mb-8">
      <label class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2">
        {{ t('editor.titleLabel') }}
      </label>
      <input
        v-model="title"
        type="text"
        :placeholder="t('editor.enterTitle')"
        class="w-full text-2xl font-bold bg-transparent border-b-2 border-gray-300 dark:border-gray-700 focus:border-accent dark:focus:border-accent-light outline-none py-2 text-text-primary dark:text-text-primary-dark"
      />
    </div>

    <div class="mb-8">
      <label class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2">
        {{ t('editor.coverImage') }}
      </label>
      <div
        class="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center"
        :class="{ 'border-accent dark:border-accent-light': isDragging }"
        @dragenter.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @dragover.prevent
        @drop="handleImageDrop"
      >
        <input
          type="file"
          accept="image/*"
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          @change="(e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.files?.[0]) {
              handleImageSelect(target.files[0]);
            }
          }"
        />
        
        <div v-if="!coverImagePreview" class="py-8">
          <div class="text-text-primary dark:text-text-primary-dark mb-2">
            {{ t('editor.dragImageHere') }}
          </div>
          <div class="text-sm text-text-secondary dark:text-text-secondary-dark">
            {{ t('editor.or') }}
          </div>
          <button class="mt-2 px-4 py-2 bg-accent hover:bg-accent-light text-white rounded-lg transition-colors">
            {{ t('editor.selectImage') }}
          </button>
        </div>
        
        <div v-else class="relative group">
          <img
            :src="coverImagePreview"
            alt="Cover preview"
            class="max-h-[300px] w-full object-cover rounded-lg"
          />
          <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              @click.prevent="coverImage = null; coverImagePreview = ''"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              {{ t('editor.removeImage') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-8">
      <label class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2">
        {{ t('editor.tagsLabel') }}
      </label>
      <div class="flex flex-wrap gap-2 mb-3">
        <span
          v-for="tag in selectedTags"
          :key="tag"
          class="px-4 py-1.5 bg-accent/20 dark:bg-accent-light/20 text-accent dark:text-accent-light rounded-full flex items-center gap-2 text-sm"
        >
          {{ tag }}
          <button @click="removeTag(tag)" class="hover:text-red-500 transition-colors">×</button>
        </span>
      </div>
      <div class="flex gap-3">
        <input
          v-model="newTag"
          @keyup.enter="addTag"
          type="text"
          :placeholder="t('editor.addTag')"
          class="flex-1 px-4 py-2 bg-primary dark:bg-primary-dark border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-light text-text-primary dark:text-text-primary-dark"
        />
        <button
          @click="addTag"
          class="px-6 py-2 bg-accent hover:bg-accent-light text-white rounded-lg transition-colors"
        >
          {{ t('editor.add') }}
        </button>
      </div>
    </div>

    <div class="mb-8">
      <label class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2">
        {{ t('editor.contentLabel') }}
      </label>
      <div class="border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
        <QuillEditor
          v-model:content="editorContent"
          :options="editorOptions"
          contentType="html"
          @update:content="onEditorChange"
          @ready="onEditorReady"
          theme="snow"
          toolbar="full"
          class="bg-primary dark:bg-primary-dark text-text-primary dark:text-text-primary-dark editor-container"
          :enable-image-resize="true"
          :enable-image-drop="true"
          :enable-image-paste="true"
        />
      </div>
    </div>

    <div class="flex justify-end gap-3">
      <button
        @click="emit('cancel')"
        class="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium text-text-primary dark:text-text-primary-dark"
      >
        {{ t('common.cancel') }}
      </button>
      <button
        @click="savePost"
        class="px-6 py-2.5 bg-accent hover:bg-accent-light text-white rounded-lg transition-colors font-medium"
      >
        {{ t('common.save') }}
      </button>
    </div>
  </div>
</template>

<style>
/* 工具欄基礎樣式 */
.ql-toolbar {
  position: relative;
  z-index: 40;
  background-color: var(--color-secondary);
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  border-color: var(--color-border) !important;
  padding: 12px !important;
  border-width: 0 0 2px 0 !important;
}

/* 工具欄按鈕組 */
.ql-toolbar.ql-snow .ql-formats {
  display: inline-block;
  vertical-align: middle;
  margin: 0 8px 0 0 !important;
}

/* 按鈕基礎樣式 */
.ql-snow.ql-toolbar button {
  height: 28px;
  width: 28px;
  padding: 4px !important;
  margin: 0 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-primary);
  color: var(--color-text-primary);
}

/* 下拉選單容器 */
.ql-snow .ql-picker {
  height: 28px;
  position: relative;
  display: inline-block;
  vertical-align: middle;
}

/* 下拉選單標籤 */
.ql-snow .ql-picker-label {
  padding: 0 4px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 100%;
  background: var(--color-primary);
  color: var(--color-text-primary);
}

/* 字體大小選擇器 */
.ql-snow .ql-picker.ql-size {
  width: 98px;
}

/* 字體選擇器 */
.ql-snow .ql-picker.ql-font {
  width: 108px;
}

/* 標題選擇器 */
.ql-snow .ql-picker.ql-header {
  width: 98px;
}

/* 下拉選單選項容器 */
.ql-snow .ql-picker-options {
  background-color: var(--color-secondary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 4px;
  width: 100%;
  color: var(--color-text-primary);
}

/* 下拉選單選項 */
.ql-snow .ql-picker-item {
  padding: 4px 8px;
  border-radius: 2px;
  cursor: pointer;
  color: var(--color-text-primary);
}

/* 下拉選單選項懸停 */
.ql-snow .ql-picker-item:hover {
  background-color: var(--color-primary);
  color: var(--color-text-primary);
}

/* 編輯器容器 */
.ql-container {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  border-color: var(--color-border) !important;
  border-width: 0 !important;
  font-family: inherit;
  font-size: 1rem;
  height: 300px;
  overflow-y: auto;
}

/* 編輯器內容區 */
.ql-editor {
  padding: 16px !important;
  min-height: 300px;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text-primary);
}

/* 編輯器內容區佔位符 */
.ql-editor.ql-blank::before {
  font-style: normal;
  color: var(--color-text-secondary);
  font-size: 1rem;
  left: 16px;
  right: 16px;
}

/* 編輯器內容區塊元素 */
.ql-editor p, .ql-editor h1, .ql-editor h2, .ql-editor h3, .ql-editor h4, .ql-editor h5, .ql-editor h6, .ql-editor blockquote, .ql-editor pre {
  margin-bottom: 1rem;
}

/* 編輯器標題樣式 */
.ql-editor h1 {
  font-size: 2rem;
  font-weight: 700;
}

.ql-editor h2 {
  font-size: 1.75rem;
  font-weight: 700;
}

.ql-editor h3 {
  font-size: 1.5rem;
  font-weight: 600;
}

.ql-editor h4 {
  font-size: 1.25rem;
  font-weight: 600;
}

.ql-editor h5 {
  font-size: 1.125rem;
  font-weight: 600;
}

.ql-editor h6 {
  font-size: 1rem;
  font-weight: 600;
}

/* 編輯器引用樣式 */
.ql-editor blockquote {
  border-left: 4px solid var(--color-accent);
  padding-left: 16px;
  color: var(--color-text-secondary);
}

/* 編輯器代碼塊樣式 */
.ql-editor pre {
  background-color: var(--color-primary-dark);
  border-radius: 4px;
  padding: 8px 12px;
  font-family: monospace;
  white-space: pre-wrap;
  color: var(--color-text-primary-dark);
}

/* 編輯器列表樣式 */
.ql-editor ol, .ql-editor ul {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.ql-editor li {
  margin-bottom: 0.5rem;
}

/* 編輯器圖片樣式 */
.ql-editor img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

/* 編輯器連結樣式 */
.ql-editor a {
  color: var(--color-accent);
  text-decoration: none;
}

.ql-editor a:hover {
  text-decoration: underline;
}

/* 編輯器表格樣式 */
.ql-editor table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.ql-editor th, .ql-editor td {
  border: 1px solid var(--color-border);
  padding: 8px 12px;
  text-align: left;
}

.ql-editor th {
  background-color: var(--color-secondary);
  font-weight: 600;
}

/* 懸停效果 */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

/* 暗黑模式變數 */
:root {
  --color-primary: #ffffff;
  --color-primary-dark: #1a1a1a;
  --color-secondary: #f8f9fa;
  --color-secondary-dark: #2a2a2a;
  --color-accent: #3b82f6;
  --color-accent-light: #60a5fa;
  --color-border: #e2e8f0;
  --color-text-primary: #1a1a1a;
  --color-text-primary-dark: #f8f9fa;
  --color-text-secondary: #4b5563;
  --color-text-secondary-dark: #9ca3af;
}

.dark {
  --color-primary: #1a1a1a;
  --color-primary-dark: #0f0f0f;
  --color-secondary: #2a2a2a;
  --color-secondary-dark: #333333;
  --color-accent: #3b82f6;
  --color-accent-light: #60a5fa;
  --color-border: #4b5563;
  --color-text-primary: #f8f9fa;
  --color-text-primary-dark: #ffffff;
  --color-text-secondary: #9ca3af;
  --color-text-secondary-dark: #d1d5db;
}

/* 編輯器容器 */
.editor-container {
  color: var(--color-text-primary) !important;
}

.editor-container .ql-editor {
  color: var(--color-text-primary) !important;
}
</style>
