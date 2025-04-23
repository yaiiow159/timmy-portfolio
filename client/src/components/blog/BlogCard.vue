<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { BlogPost } from '@/store/blogStore.ts'

const { t } = useI18n()

const props = defineProps<{
  post: BlogPost
  compact?: boolean
}>()

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const displayTitle = computed(() => {
  if (!props.compact || props.post.title.length <= 60) {
    return props.post.title
  }
  return props.post.title.substring(0, 60) + '...'
})

const displayExcerpt = computed(() => {
  if (!props.compact || props.post.excerpt.length <= 120) {
    return props.post.excerpt
  }
  return props.post.excerpt.substring(0, 120) + '...'
})
</script>

<template>
  <div 
    class="blog-card bg-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
    :class="{ 'h-full': compact }"
  >
    <div :class="{ 'md:flex': !compact }">
      <div :class="{ 'md:w-1/3 h-48 md:h-auto': !compact, 'h-40': compact }" class="bg-gray-700 relative">
        <div v-if="post.coverImage" class="h-full w-full">
          <img 
            :src="post.coverImage" 
            :alt="post.title" 
            class="h-full w-full object-cover"
          />
        </div>
        <div v-else class="h-full w-full bg-gray-700 flex items-center justify-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      
      <div :class="{ 'md:w-2/3': !compact }" class="p-4 md:p-6 flex flex-col h-full">
        <div class="flex flex-wrap gap-2 mb-2" v-if="!compact && post.tags.length > 0">
          <span 
            v-for="tag in post.tags.slice(0, 3)" 
            :key="tag"
            class="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent"
          >
            {{ tag }}
          </span>
          <span v-if="post.tags.length > 3" class="text-xs px-2 py-1 rounded-full bg-accent/10 text-text-secondary">
            +{{ post.tags.length - 3 }}
          </span>
        </div>
        
        <h2 class="text-xl font-bold mb-2 text-text-primary hover:text-accent transition-colors line-clamp-2">
          {{ displayTitle }}
        </h2>
        
        <p class="text-sm text-text-secondary mb-2">
          {{ t('blog.postedOn') }} {{ formatDate(post.date) }}
        </p>
        
        <p v-if="!compact" class="text-text-secondary mb-4 line-clamp-3">
          {{ displayExcerpt }}
        </p>
        <p v-else class="text-text-secondary mb-4 line-clamp-2 text-sm">
          {{ displayExcerpt }}
        </p>
        
        <div class="mt-auto pt-2">
          <router-link 
            :to="`/blog/${post.id}`" 
            class="inline-flex items-center text-accent hover:text-accent-light transition-colors"
          >
            {{ t('blog.readMore') }}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
