<script setup lang="ts">
import { ref } from 'vue'
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
const coverImagePreview = ref('')
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

function onEditorReady(editor: any) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        const content = editor.root.innerHTML
        editorContent.value = content
      }
    })
  })

  observer.observe(editor.root, {
    childList: true,
    characterData: true,
    subtree: true
  })
}
</script>

<template>
  <div class="bg-secondary dark:bg-secondary-dark rounded-lg p-8 shadow-lg">
    <div class="mb-8">
      <label class="block text-sm font-medium text-text-secondary dark:text-text-secondary-light mb-2">
        {{ t('editor.titleLabel') }}
      </label>
      <input
        v-model="title"
        type="text"
        :placeholder="t('editor.enterTitle')"
        class="w-full text-2xl font-bold bg-transparent border-b-2 border-gray-300 dark:border-gray-700 focus:border-accent dark:focus:border-accent-light outline-none py-2"
      />
    </div>

    <div class="mb-8">
      <label class="block text-sm font-medium text-text-secondary dark:text-text-secondary-light mb-2">
        {{ t('editor.coverImage') }}
      </label>
      <div
        class="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center"
        :class="{ 'border-accent': isDragging }"
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
          <div class="text-text-secondary dark:text-text-secondary-light mb-2">
            {{ t('editor.dragImageHere') }}
          </div>
          <div class="text-sm text-text-secondary dark:text-text-secondary-light">
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
      <label class="block text-sm font-medium text-text-secondary dark:text-text-secondary-light mb-2">
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
          class="flex-1 px-4 py-2 bg-primary dark:bg-primary-dark border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-light"
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
      <label class="block text-sm font-medium text-text-secondary dark:text-text-secondary-light mb-2">
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
          class="bg-primary dark:bg-primary-dark text-text-primary dark:text-text-primary-light"
        />
      </div>
    </div>

    <div class="flex justify-end gap-3">
      <button
        @click="emit('cancel')"
        class="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
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

/* 下拉選單選項 */
.ql-snow .ql-picker-options {
  padding: 4px 8px;
  background-color: var(--color-primary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  white-space: nowrap;
  position: absolute;
  top: 100%;
  margin-top: 4px;
}

/* 顏色選擇器容器 */
.ql-snow .ql-color-picker,
.ql-snow .ql-background {
  position: relative !important;
  width: 28px;
  height: 28px;
}

/* 顏色選擇器標籤 */
.ql-snow .ql-color-picker .ql-picker-label,
.ql-snow .ql-background .ql-picker-label {
  padding: 0;
  width: 100%;
  height: 100%;
}

.ql-snow .ql-color-picker.ql-expanded .ql-picker-options {
  position: absolute !important;
  top: 100% !important;
  left: 0 !important;
  z-index: 9999 !important;
  margin-top: 5px;
  background: var(--color-primary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 5px;
  width: 192px;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.ql-snow .ql-color-picker .ql-picker-item {
  width: 20px !important;
  height: 20px !important;
  border: 1px solid var(--color-border);
  margin: 0;
  padding: 0;
  border-radius: 2px;
}

/* 暗色主題 */
.dark .ql-snow.ql-toolbar {
  background-color: #2d3748;
}

.dark .ql-snow.ql-toolbar button,
.dark .ql-snow .ql-picker-label {
  background-color: #1a202c;
  border-color: #4a5568;
}

.dark .ql-snow .ql-stroke {
  stroke: #e2e8f0;
}

.dark .ql-snow .ql-fill {
  fill: #e2e8f0;
}

.dark .ql-snow .ql-picker {
  color: #e2e8f0;
}

.dark .ql-snow .ql-picker-options {
  background-color: #1a202c;
  border-color: #4a5568;
}

.ql-snow.ql-toolbar button:hover,
.ql-snow .ql-picker-label:hover {
  background-color: var(--color-accent-light);
  color: white;
}

.ql-snow.ql-toolbar button:hover .ql-stroke {
  stroke: white;
}

.ql-snow.ql-toolbar button:hover .ql-fill {
  fill: white;
}

.ql-snow.ql-toolbar button.ql-active,
.ql-snow .ql-picker-label.ql-active,
.ql-snow .ql-picker-item.ql-selected {
  background-color: var(--color-accent);
  color: white;
}

.ql-snow.ql-toolbar button.ql-active .ql-stroke {
  stroke: white;
}

.ql-snow.ql-toolbar button.ql-active .ql-fill {
  fill: white;
}

.ql-container.ql-snow {
  position: relative;
  z-index: 30;
  border: 1px solid var(--color-border);
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  background-color: var(--color-primary);
}

.dark .ql-container.ql-snow {
  background-color: #1a202c;
  border-color: #4a5568;
}

/* 編輯區域 */
.ql-editor {
  min-height: 400px;
  font-size: 1.1rem;
  line-height: 1.75;
  color: var(--color-text-primary);
  padding: 24px !important;
}

.dark .ql-editor {
  color: #e2e8f0;
}

.ql-editor.ql-blank::before {
  color: var(--color-text-secondary);
  font-style: normal;
  left: 24px;
  right: 24px;
}

/* 工具提示 */
.ql-tooltip {
  background-color: var(--color-primary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 8px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.dark .ql-tooltip {
  background-color: #1a202c;
  border-color: #4a5568;
  color: #e2e8f0;
}

.ql-tooltip input[type="text"] {
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 4px 8px;
  margin: 0 8px;
  background-color: var(--color-primary);
  color: var(--color-text-primary);
}

.dark .ql-tooltip input[type="text"] {
  background-color: #2d3748;
  border-color: #4a5568;
  color: #e2e8f0;
}

/* 新增的圖片上傳相關樣式 */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>
