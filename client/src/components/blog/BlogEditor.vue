<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { useAuthStore } from '@/store/authStore'
import { blogService } from '@/services/blogService'
import type { BlogPost } from '@/store/blogStore'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
    ]
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

async function handleImageUpload(file: File) {
  const authStore = useAuthStore()

  try {
    const result = await blogService.uploadImage(file, authStore.token as string)
    return result.filePath
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

function savePost() {
  if (!title.value.trim() || !editorContent.value) {
    alert(t('validation.required'))
    return
  }

  const postData: Partial<BlogPost> = {
    title: title.value.trim(),
    content: editorContent.value,
    tags: selectedTags.value
  }

  emit('save', postData)
}

function onEditorChange({ html }: { html: string }) {
  editorContent.value = html
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
.ql-toolbar {
  background-color: var(--color-secondary);
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  border-color: var(--color-border) !important;
  padding: 12px !important;
  border-width: 0 0 2px 0 !important;
}

.ql-container {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  border: none !important;
  min-height: 400px;
  background-color: var(--color-primary);
}

.ql-editor {
  font-size: 1.1rem;
  line-height: 1.75;
  padding: 24px !important;
  color: var(--color-text-primary);
}

.ql-editor.ql-blank::before {
  color: var(--color-text-secondary);
  font-style: normal;
  left: 24px;
  right: 24px;
}

.ql-snow.ql-toolbar button {
  padding: 6px !important;
  margin: 2px;
  border-radius: 4px;
  transition: all 0.2s;
}

.ql-snow.ql-toolbar button:hover {
  background-color: var(--color-accent-light);
}

.ql-snow.ql-toolbar button.ql-active {
  background-color: var(--color-accent);
}

.ql-snow.ql-toolbar button.ql-active .ql-stroke {
  stroke: white;
}

.ql-snow.ql-toolbar button.ql-active .ql-fill {
  fill: white;
}

.dark .ql-snow .ql-stroke {
  stroke: var(--color-text-primary);
}

.dark .ql-snow .ql-fill {
  fill: var(--color-text-primary);
}

.dark .ql-snow .ql-picker {
  color: var(--color-text-primary);
}

.ql-snow .ql-picker-options {
  background-color: var(--color-secondary);
  border-radius: 0.5rem;
  border-color: var(--color-border);
  padding: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.ql-snow .ql-picker-label {
  border-color: var(--color-border);
  padding: 4px 8px;
  border-radius: 4px;
}

.ql-toolbar.ql-snow .ql-formats {
  border-right: 1px solid var(--color-border);
  margin-right: 8px;
  padding-right: 8px;
}

.ql-toolbar.ql-snow .ql-formats:last-child {
  border-right: none;
}

.ql-snow.ql-toolbar button:hover .ql-stroke {
  stroke: var(--color-accent);
}

.ql-snow.ql-toolbar button:hover .ql-fill {
  fill: var(--color-accent);
}

.ql-snow .ql-picker-item {
  color: var(--color-text-primary);
  padding: 4px 8px;
}

.ql-snow .ql-picker-item:hover {
  color: var(--color-accent);
  background-color: var(--color-accent-light);
  border-radius: 4px;
}

.ql-snow .ql-picker-item.ql-selected {
  color: var(--color-accent);
}

.ql-snow .ql-tooltip {
  background-color: var(--color-secondary);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  border-radius: 0.5rem;
  padding: 8px 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.ql-snow .ql-tooltip input[type=text] {
  background-color: var(--color-primary);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  border-radius: 4px;
  padding: 4px 8px;
  margin: 0 8px;
}

.ql-snow .ql-tooltip input[type=text]:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px var(--color-accent-light);
}

.ql-snow.ql-toolbar button + button {
  margin-left: 4px;
}

.ql-snow .ql-picker.ql-header {
  width: auto;
  min-width: 120px;
}

.ql-snow .ql-picker.ql-size {
  width: auto;
  min-width: 100px;
}

.ql-snow .ql-color-picker .ql-picker-label {
  padding: 4px;
}

.ql-snow .ql-color-picker .ql-picker-options {
  padding: 8px;
  width: 192px;
}

.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "輸入連結:";
  margin-right: 8px;
}

.ql-editor {
  color: var(--color-text-primary);
}

.ql-editor blockquote {
  border-left: 4px solid var(--color-accent);
  padding-left: 16px;
  color: var(--color-text-secondary);
}

.ql-editor pre.ql-syntax {
  background-color: var(--color-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

.ql-editor a {
  color: var(--color-accent);
  text-decoration: none;
}

.ql-editor a:hover {
  text-decoration: underline;
}
</style>
