<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import hljs from 'highlight.js'

const props = defineProps<{
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
}>()

const highlightedCode = ref('')
const copied = ref(false)

onMounted(() => {
  highlight()
})

function highlight() {
  try {
    if (props.language && hljs.getLanguage(props.language)) {
      highlightedCode.value = hljs.highlight(props.code, { language: props.language }).value
    } else {
      highlightedCode.value = hljs.highlightAuto(props.code).value
    }
  } catch (error) {
    console.error('Error highlighting code:', error)
    highlightedCode.value = props.code
  }
}

function copyCode() {
  navigator.clipboard.writeText(props.code).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}

const codeWithLineNumbers = computed(() => {
  if (!props.showLineNumbers) {
    return highlightedCode.value
  }
  
  const lines = highlightedCode.value.split('\n')
  return lines.map((line, index) => {
    return `<span class="line-number">${index + 1}</span>${line}`
  }).join('\n')
})
</script>

<template>
  <div class="code-block bg-[#282c34] rounded-lg overflow-hidden mb-6">
    <div class="flex justify-between items-center px-4 py-2 bg-[#21252b] border-b border-[#181a1f]">
      <div class="text-sm text-gray-400">
        {{ filename || (language ? language : 'code') }}
      </div>
      <button 
        @click="copyCode" 
        class="text-gray-400 hover:text-white transition-colors text-sm flex items-center"
      >
        <span v-if="copied" class="mr-1 text-green-400">Copied!</span>
        <span v-else class="mr-1">Copy</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="copied" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
    
    <pre :class="{ 'line-numbers': showLineNumbers }"><code v-html="codeWithLineNumbers"></code></pre>
  </div>
</template>

<style scoped>
.code-block pre {
  margin: 0;
  padding: 1rem;
  overflow-x: auto;
}

.code-block code {
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}

.line-numbers {
  counter-reset: line;
}

.line-number {
  display: inline-block;
  width: 2rem;
  color: #636d83;
  text-align: right;
  margin-right: 1rem;
  padding-right: 0.5rem;
  border-right: 1px solid #3e4451;
  user-select: none;
}
</style>
