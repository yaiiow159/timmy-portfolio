<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useBlogPostList } from '@/composables/useBlogPostList'
import type { BlogPost } from '@/store/blogStore'
import { getStaticUrl, hasUsableBlogCoverImage } from '@/services/api'
import { formatDescription } from '@/utils/textFormatters'

const { t } = useI18n()
const router = useRouter()
const { blogStore } = useBlogPostList()

const homeBlogCoverFailed = reactive<Record<string, boolean>>({})

watch(
  () => blogStore.posts.map((p) => `${p.id}:${p.coverImage ?? ''}`).join('|'),
  () => {
    for (const k of Object.keys(homeBlogCoverFailed)) {
      delete homeBlogCoverFailed[k]
    }
  }
)

function homeBlogCoverShows(post: BlogPost) {
  return hasUsableBlogCoverImage(post.coverImage) && !homeBlogCoverFailed[post.id]
}

function homeBlogCoverSrc(post: BlogPost) {
  return getStaticUrl(post.coverImage as string)
}

function onHomeBlogCoverError(postId: string) {
  homeBlogCoverFailed[postId] = true
}
</script>

<template>
  <section class="py-16 md:py-24 bg-secondary tech-particles blog-section">
    <div class="container mx-auto px-4 sm:px-6 md:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center mb-12 md:mb-20 gap-4 md:gap-6">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-accent/20 to-tech-purple/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5M5 14h5m5-4h5M5 8h5" />
            </svg>
          </div>
          <h2 class="tech-title text-3xl md:text-4xl lg:text-5xl font-bold">
            {{ t('blog.title') }}
          </h2>
        </div>
        <button
          type="button"
          class="tech-button group"
          @click="router.push('/blog')"
        >
          {{ t('blog.viewAll') }}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 max-w-7xl mx-auto">
        <div v-if="blogStore.isLoading" v-for="i in 3" :key="i" class="tech-card animate-pulse">
          <div class="h-48 bg-gradient-to-br from-primary to-secondary rounded-t-2xl"></div>
          <div class="p-6">
            <div class="h-6 bg-primary rounded w-3/4 mb-4"></div>
            <div class="h-4 bg-primary rounded w-full mb-2"></div>
            <div class="h-4 bg-primary rounded w-5/6 mb-6"></div>
            <div class="h-10 bg-primary rounded w-full"></div>
          </div>
        </div>

        <div
          v-else-if="blogStore.posts.length > 0"
          v-for="post in blogStore.posts.slice(0, 3)"
          :key="post.id"
          class="tech-card group cursor-pointer relative z-10"
          @click="router.push(`/blog/${post.id}`)"
        >
          <div class="h-48 relative overflow-hidden rounded-t-2xl">
            <img
              v-if="homeBlogCoverShows(post)"
              :src="homeBlogCoverSrc(post)"
              :alt="post.title"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              decoding="async"
              @error="onHomeBlogCoverError(post.id)"
            />
            <div
              v-else
              class="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-secondary via-primary/80 to-primary px-4 text-center tech-text-secondary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="mb-2 h-12 w-12 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p class="text-xs font-medium tracking-wide opacity-80">{{ t('blog.noCover') }}</p>
            </div>
            <div class="absolute top-4 right-4 bg-gradient-to-r from-accent to-tech-purple text-white text-xs px-3 py-1 rounded-full font-semibold">
              {{ new Date(post.date).toLocaleDateString() }}
            </div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold mb-3 text-text-primary group-hover:text-accent transition-colors">{{ post.title }}</h3>
            <p class="text-text-secondary mb-6 line-clamp-3" v-html="formatDescription(post.excerpt, 150)"></p>
            <div class="flex items-center text-accent font-semibold group-hover:text-tech-purple transition-colors">
              {{ t('blog.readMore') }}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H6" />
              </svg>
            </div>
          </div>
        </div>

        <div v-else class="col-span-3 text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 mx-auto text-text-secondary mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5M5 14h5m5-4h5M5 8h5" />
          </svg>
          <h3 class="text-2xl font-bold text-text-primary mb-3">{{ t('blog.noPosts') }}</h3>
          <p class="text-text-secondary text-lg">{{ t('blog.checkBack') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
