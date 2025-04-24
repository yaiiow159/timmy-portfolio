<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
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

// 編輯器配置
const editor = useEditor({
  content: props.post?.content || '',
  extensions: [
    StarterKit,
    Image.configure({
      HTMLAttributes: {
        class: 'max-w-full rounded-lg',
      },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-accent hover:text-accent-light underline',
      },
    }),
  ],
  editorProps: {
    attributes: {
      class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-2',
    },
  },
})

// 編輯器命令
const editorCommands = [
  { name: 'bold', icon: 'format_bold', action: () => editor.value?.chain().focus().toggleBold().run() },
  { name: 'italic', icon: 'format_italic', action: () => editor.value?.chain().focus().toggleItalic().run() },
  { name: 'strike', icon: 'strikethrough_s', action: () => editor.value?.chain().focus().toggleStrike().run() },
  { name: 'code', icon: 'code', action: () => editor.value?.chain().focus().toggleCode().run() },
  { name: 'h1', icon: 'looks_one', action: () => editor.value?.chain().focus().toggleHeading({ level: 1 }).run() },
  { name: 'h2', icon: 'looks_two', action: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run() },
  { name: 'bulletList', icon: 'format_list_bulleted', action: () => editor.value?.chain().focus().toggleBulletList().run() },
  { name: 'orderedList', icon: 'format_list_numbered', action: () => editor.value?.chain().focus().toggleOrderedList().run() },
  { name: 'blockquote', icon: 'format_quote', action: () => editor.value?.chain().focus().toggleBlockquote().run() },
  { name: 'horizontalRule', icon: 'horizontal_rule', action: () => editor.value?.chain().focus().setHorizontalRule().run() },
  { name: 'undo', icon: 'undo', action: () => editor.value?.chain().focus().undo().run() },
  { name: 'redo', icon: 'redo', action: () => editor.value?.chain().focus().redo().run() },
]

// 標籤管理
function addTag() {
  if (newTag.value.trim() && !selectedTags.value.includes(newTag.value.trim())) {
    selectedTags.value.push(newTag.value.trim())
    newTag.value = ''
  }
}

function removeTag(tag: string) {
  selectedTags.value = selectedTags.value.filter(t => t !== tag)
}

// 圖片上傳
async function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  const authStore = useAuthStore()

  try {
    const result = await blogService.uploadImage(file, authStore.token as string)
    editor.value?.chain().focus().setImage({ src: result.filePath }).run()
  } catch (error) {
    console.error('Error uploading image:', error)
  } finally {
    input.value = ''
  }
}

// 儲存文章
function savePost() {
  if (!title.value.trim() || !editor.value?.getHTML()) {
    alert(t('fillAllFields'))
    return
  }

  const postData: Partial<BlogPost> = {
    title: title.value.trim(),
    content: editor.value.getHTML(),
    tags: selectedTags.value
  }

  emit('save', postData)
}

// 組件生命週期
onMounted(() => {
  if (editor.value) {
    editor.value.commands.focus()
  }
})

onUnmounted(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<template>
  <div class="bg-secondary dark:bg-secondary-dark rounded-lg p-6 shadow-lg">
    <!-- 標題輸入 -->
    <div class="mb-6">
      <input
        v-model="title"
        type="text"
        :placeholder="t('enterTitle')"
        class="w-full text-2xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-700 focus:border-accent dark:focus:border-accent-light outline-none py-2"
      />
    </div>

    <!-- 標籤管理 -->
    <div class="mb-6">
      <div class="flex flex-wrap gap-2 mb-2">
        <span
          v-for="tag in selectedTags"
          :key="tag"
          class="px-3 py-1 bg-accent/20 dark:bg-accent-light/20 text-accent dark:text-accent-light rounded-full flex items-center gap-2"
        >
          {{ tag }}
          <button @click="removeTag(tag)" class="hover:text-red-500">×</button>
        </span>
      </div>
      <div class="flex gap-2">
        <input
          v-model="newTag"
          @keyup.enter="addTag"
          type="text"
          :placeholder="t('addTag')"
          class="px-3 py-1 bg-primary dark:bg-primary-dark border border-gray-300 dark:border-gray-700 rounded-lg"
        />
        <button
          @click="addTag"
          class="px-3 py-1 bg-accent hover:bg-accent-light text-white rounded-lg"
        >
          {{ t('add') }}
        </button>
      </div>
    </div>

    <!-- 編輯器工具列 -->
    <div class="border border-gray-300 dark:border-gray-700 rounded-t-lg p-2 flex flex-wrap gap-2">
      <button
        v-for="item in editorCommands"
        :key="item.name"
        @click="item.action"
        :class="[
          'p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors',
          { 'bg-gray-200 dark:bg-gray-700': editor?.isActive(item.name) }
        ]"
        :title="item.name"
      >
        <span class="material-icons">{{ item.icon }}</span>
      </button>
      
      <label class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors">
        <input
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleImageUpload"
        />
        <span class="material-icons">image</span>
      </label>
    </div>

    <!-- 編輯器內容區 -->
    <div class="border border-t-0 border-gray-300 dark:border-gray-700 rounded-b-lg bg-primary dark:bg-primary-dark">
      <editor-content :editor="editor" />
    </div>

    <!-- 操作按鈕 -->
    <div class="mt-6 flex justify-end gap-2">
      <button
        @click="emit('cancel')"
        class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {{ t('cancel') }}
      </button>
      <button
        @click="savePost"
        class="px-4 py-2 bg-accent hover:bg-accent-light text-white rounded-lg transition-colors"
      >
        {{ t('save') }}
      </button>
    </div>
  </div>
</template>

<style>
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }
}

.ProseMirror img {
  max-width: 100%;
  height: auto;
}

.ProseMirror img.ProseMirror-selectednode {
  outline: 3px solid var(--accent);
}
</style>
