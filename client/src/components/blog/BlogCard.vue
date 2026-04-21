<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { BlogPost } from '@/store/blogStore.ts'
import { getStaticUrl, hasUsableBlogCoverImage } from '@/services/api'
import { estimateReadMinutes } from '@/utils/blogReadTime'

const { t } = useI18n()

const props = defineProps<{
  post: BlogPost
  compact?: boolean
}>()

function formatDate(dateString: string) {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
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

const readMinutes = computed(() => estimateReadMinutes(props.post))

const coverImageSrc = computed(() =>
  hasUsableBlogCoverImage(props.post.coverImage) ? getStaticUrl(props.post.coverImage as string) : ''
)

const coverLoadFailed = ref(false)
watch(
  () => [props.post.id, props.post.coverImage] as const,
  () => {
    coverLoadFailed.value = false
  }
)

const showCoverPhoto = computed(
  () => hasUsableBlogCoverImage(props.post.coverImage) && coverImageSrc.value.length > 0 && !coverLoadFailed.value
)

function onCoverError() {
  coverLoadFailed.value = true
}
</script>

<template>
  <div 
    class="blog-card tech-card overflow-hidden group relative"
    :class="{ 'h-full': compact }"
  >
    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent"></div>
      <div class="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-xl"></div>
    </div>
    
    <div :class="{ 'md:flex': !compact }">
      <div :class="{ 'md:w-1/3 h-40 md:h-auto': !compact, 'h-36': compact }" class="bg-gradient-to-br from-secondary to-primary relative overflow-hidden">
        <div v-if="showCoverPhoto" class="relative h-full w-full">
          <img 
            :src="coverImageSrc" 
            :alt="post.title" 
            class="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
            loading="lazy"
            decoding="async"
            @error="onCoverError"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        </div>
        <div v-else class="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-secondary via-primary/80 to-primary text-center tech-text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" class="mb-2 h-12 w-12 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p class="text-xs font-medium tracking-wide opacity-80">{{ t('blog.noCover') }}</p>
        </div>
        
        <div class="absolute top-3 left-3">
          <div class="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full border border-accent/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ readMinutes }} min read
          </div>
        </div>
      </div>
      
      <div :class="{ 'md:w-2/3': !compact }" class="p-6 flex flex-col h-full relative">
        <div class="flex flex-wrap gap-2 mb-4" v-if="!compact && post.tags.length > 0">
          <span 
            v-for="tag in post.tags.slice(0, 4)" 
            :key="tag"
            class="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-accent/10 to-tech-purple/10 text-accent border border-accent/20 hover:border-accent/40 transition-all duration-300 font-medium hover:scale-105 cursor-pointer"
            @click="$emit('tag-click', tag)"
          >
            #{{ tag }}
          </span>
          <span v-if="post.tags.length > 4" class="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-accent/10 to-tech-purple/10 text-accent border border-accent/20 hover:border-accent/40 transition-all duration-300 font-medium hover:scale-105">
            +{{ post.tags.length - 4 }}
          </span>
        </div>
        
        <h2 class="text-xl font-bold mb-3 tech-text-primary group-hover:text-accent transition-colors duration-300 line-clamp-2">
          {{ displayTitle }}
        </h2>
        
        <div class="flex items-center gap-4 text-sm tech-text-secondary mb-4">
          <div class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ formatDate(post.date) }}</span>
          </div>
          <div class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{{ post.author || 'Anonymous' }}</span>
          </div>
        </div>
        
        <p v-if="!compact" class="text-text-secondary mb-6 line-clamp-3 leading-relaxed flex-grow">
          {{ displayExcerpt }}
        </p>
        <p v-else class="text-text-secondary mb-4 line-clamp-2 text-sm leading-relaxed flex-grow">
          {{ displayExcerpt }}
        </p>
        
        <div class="mt-auto pt-2">
          <router-link 
            :to="`/blog/${post.id}`" 
            class="tech-button tech-button-sm inline-flex items-center gap-2"
          >
            {{ t('blog.readMore') }}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.blog-card {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* shimmer 掃光效果 */
.blog-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb), 0.08), transparent);
  transition: left 0.5s ease;
  z-index: 1;
  pointer-events: none;
}

.blog-card:hover::before {
  left: 100%;
}

.blog-card:hover {
  transform: translateY(-6px);
  box-shadow: 
    0 12px 28px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(var(--accent-rgb), 0.28),
    0 0 18px rgba(var(--accent-rgb), 0.1);
}

/* 確保 button 在 z-index 堆疊中可點擊 */
.blog-card .tech-button {
  position: relative;
  z-index: 2;
}

.blog-card img {
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.blog-card:hover img {
  filter: brightness(1.08) contrast(1.03);
}

@media (max-width: 768px) {
  .blog-card:hover {
    transform: translateY(-3px);
  }
  
  .blog-card::before {
    display: none;
  }
}
</style>
