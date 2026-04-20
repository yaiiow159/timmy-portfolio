<template>
  <div class="rich-text-editor">
    <div class="editor-toolbar">
      <button
        v-for="tool in tools"
        :key="tool.name"
        @click="tool.action"
        :class="['toolbar-btn']"
        :title="tool.title"
        type="button"
      >
        <i :class="tool.icon"></i>
      </button>
    </div>
    <textarea
      ref="textareaRef"
      v-model="localValue"
      @input="handleInput"
      @select="updateSelection"
      :placeholder="placeholder"
      :rows="rows"
      class="editor-textarea"
    ></textarea>
    <div class="editor-preview" v-if="showPreview">
      <div class="preview-label">{{ t('common.preview') }}</div>
      <div class="preview-content" v-html="formattedPreview"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDescription } from '@/utils/textFormatters'

interface Props {
  modelValue: string
  placeholder?: string
  rows?: number
  showPreview?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  rows: 8,
  showPreview: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { t } = useI18n()
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const localValue = ref(props.modelValue)
const selectionStart = ref(0)
const selectionEnd = ref(0)

watch(() => props.modelValue, (newValue) => {
  if (newValue !== localValue.value) {
    localValue.value = newValue
  }
})

const formattedPreview = computed(() => {
  return formatDescription(localValue.value)
})

const tools = [
  {
    name: 'bold',
    icon: 'fas fa-bold',
    title: t('editor.bold'),
    action: () => wrapSelection('**', '**')
  },
  {
    name: 'italic',
    icon: 'fas fa-italic',
    title: t('editor.italic'),
    action: () => wrapSelection('*', '*')
  },
  {
    name: 'heading',
    icon: 'fas fa-heading',
    title: t('editor.heading'),
    action: () => insertAtLineStart('## ')
  },
  {
    name: 'list',
    icon: 'fas fa-list-ul',
    title: t('editor.bulletList'),
    action: () => insertAtLineStart('- ')
  },
  {
    name: 'numbered-list',
    icon: 'fas fa-list-ol',
    title: t('editor.numberedList'),
    action: () => insertAtLineStart('1. ')
  },
  {
    name: 'link',
    icon: 'fas fa-link',
    title: t('editor.link'),
    action: () => insertLink()
  },
  {
    name: 'code',
    icon: 'fas fa-code',
    title: t('editor.code'),
    action: () => wrapSelection('`', '`')
  }
]

function handleInput() {
  emit('update:modelValue', localValue.value)
}

function updateSelection() {
  if (textareaRef.value) {
    selectionStart.value = textareaRef.value.selectionStart
    selectionEnd.value = textareaRef.value.selectionEnd
  }
}

function wrapSelection(before: string, after: string) {
  if (!textareaRef.value) return
  
  const start = textareaRef.value.selectionStart
  const end = textareaRef.value.selectionEnd
  const selectedText = localValue.value.substring(start, end)
  const replacement = `${before}${selectedText || 'text'}${after}`
  
  localValue.value = 
    localValue.value.substring(0, start) +
    replacement +
    localValue.value.substring(end)
  
  emit('update:modelValue', localValue.value)
  
  setTimeout(() => {
    if (textareaRef.value) {
      textareaRef.value.focus()
      const newStart = start + before.length
      const newEnd = newStart + (selectedText || 'text').length
      textareaRef.value.setSelectionRange(newStart, newEnd)
    }
  }, 0)
}

function insertAtLineStart(prefix: string) {
  if (!textareaRef.value) return
  
  const start = textareaRef.value.selectionStart
  const lineStart = localValue.value.lastIndexOf('\n', start - 1) + 1
  
  localValue.value = 
    localValue.value.substring(0, lineStart) +
    prefix +
    localValue.value.substring(lineStart)
  
  emit('update:modelValue', localValue.value)
  
  setTimeout(() => {
    if (textareaRef.value) {
      textareaRef.value.focus()
      textareaRef.value.setSelectionRange(start + prefix.length, start + prefix.length)
    }
  }, 0)
}

function insertLink() {
  if (!textareaRef.value) return
  
  const start = textareaRef.value.selectionStart
  const end = textareaRef.value.selectionEnd
  const selectedText = localValue.value.substring(start, end)
  const linkText = selectedText || 'link text'
  const replacement = `[${linkText}](url)`
  
  localValue.value = 
    localValue.value.substring(0, start) +
    replacement +
    localValue.value.substring(end)
  
  emit('update:modelValue', localValue.value)
  
  setTimeout(() => {
    if (textareaRef.value) {
      textareaRef.value.focus()
      const urlStart = start + linkText.length + 3
      textareaRef.value.setSelectionRange(urlStart, urlStart + 3)
    }
  }, 0)
}
</script>

<style scoped lang="scss">
.rich-text-editor {
  --accent-color: var(--accent);
  --border-color: rgba(var(--accent-rgb), 0.22);
  --bg-hover: rgba(var(--accent-rgb), 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  .editor-toolbar {
    display: flex;
    gap: 0.25rem;
    padding: 0.5rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    flex-wrap: wrap;
    
    .toolbar-btn {
      padding: 0.5rem;
      background: transparent;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      color: var(--text-secondary);
      transition: all 0.2s;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover {
        background: var(--bg-hover);
        color: var(--text-primary);
      }
      
      &.active {
        background: var(--accent);
        color: var(--accent-text-color, #fff);
      }
    }
  }
  
  .editor-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    line-height: 1.5;
    resize: vertical;
    background: var(--bg-primary);
    color: var(--text-primary);
    
    &:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.12);
    }
  }
  
  .editor-preview {
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    overflow: hidden;
    
    .preview-label {
      padding: 0.5rem 0.75rem;
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border-color);
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
    }
    
    .preview-content {
      padding: 0.75rem;
      min-height: 100px;
      background: var(--bg-primary);
      
      :deep(p) {
        margin-bottom: 0.5rem;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
      
      :deep(br) {
        display: block;
        content: "";
        margin-top: 0.25rem;
      }
    }
  }
}
</style>
