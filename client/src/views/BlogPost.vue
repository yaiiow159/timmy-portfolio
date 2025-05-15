<template>
  <div class="blog-post-container min-h-screen bg-primary dark:bg-primary-light text-text-primary dark:text-text-primary-light py-8">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-pulse-slow">
          <svg class="w-16 h-16 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <p class="mt-4 text-lg">{{ t('blog.loading') }}</p>
      </div>

      <div v-else-if="post" class="max-w-4xl mx-auto">
        <div class="blog-header mb-8">
          <button
            @click="router.push('/blog')" 
            class="flex items-center text-text-secondary dark:text-text-secondary-light hover:text-accent dark:hover:text-accent-light transition-colors mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {{ t('blog.backToBlog') }}
          </button>
          
          <div class="flex flex-wrap items-center text-text-secondary dark:text-text-secondary-light mb-2">
            <span class="mr-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ new Date(post.date).toLocaleDateString() }}
            </span>
            <span class="mr-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ post.author }}
            </span>
            <div class="flex flex-wrap mt-2 md:mt-0">
              <span 
                v-for="tag in post.tags" 
                :key="tag" 
                class="bg-secondary dark:bg-secondary-light text-text-primary dark:text-text-primary-light text-xs px-2 py-1 rounded mr-2 mb-2"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
          
          <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ post.title }}</h1>
          
          <div v-if="post.coverImage" class="mb-8">
            <img :src="post.coverImage" :alt="post?.title" class="w-full h-auto rounded-lg">
          </div>
          <div v-else class="mb-8 bg-gray-700 rounded-lg h-64 flex items-center justify-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zm-9 9h7v7H4v-7zm9 0h7v7h-7v-7z" />
            </svg>
          </div>
        </div>
        
        <div class="blog-content prose prose-lg dark:prose-invert max-w-none mb-12">
          <div v-html="renderedContent"></div>
        </div>
        
        <div class="max-w-4xl mx-auto mt-12">
          <h3 class="text-xl font-semibold mb-4">{{ t('blog.comments') }}</h3>
          
          <div class="bg-white dark:bg-secondary p-6 rounded-lg shadow-sm">
            <form @submit.prevent="submitComment" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="name" class="block text-sm font-medium mb-1">{{ t('blog.name') }} *</label>
                  <input 
                    id="name"
                    v-model="commentForm.name"
                    type="text" 
                    required
                    class="w-full px-4 py-2 rounded-lg bg-secondary dark:bg-secondary-light text-text-primary dark:text-text-primary-light border border-gray-700 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium mb-1">{{ t('blog.email') }} *</label>
                  <input 
                    id="email"
                    v-model="commentForm.email"
                    type="email" 
                    required
                    class="w-full px-4 py-2 rounded-lg bg-secondary dark:bg-secondary-light text-text-primary dark:text-text-primary-light border border-gray-700 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
              <div>
                <label for="comment" class="block text-sm font-medium mb-1">{{ t('blog.comment') }} *</label>
                <textarea 
                  id="comment"
                  v-model="commentForm.content"
                  rows="4" 
                  required
                  class="w-full px-4 py-2 rounded-lg bg-secondary dark:bg-secondary-light text-text-primary dark:text-text-primary-light border border-gray-700 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                ></textarea>
              </div>
              <div class="flex justify-end">
                <button 
                  type="submit"
                  class="px-6 py-2 bg-accent hover:bg-accent-light text-white font-medium rounded-lg transition-colors"
                  :disabled="isSubmitting"
                >
                  <span v-if="isSubmitting" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ t('blog.submitting') }}
                  </span>
                  <span v-else>{{ t('blog.submitComment') }}</span>
                </button>
              </div>
            </form>
          </div>
          
          <div class="mt-8">
            <h4 class="text-lg font-medium mb-4">{{ t('portfolio.comments') }}</h4>
            
            <div v-if="post.comments && post.comments.length > 0" class="relative">
              <div class="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-accent scrollbar-track-secondary">
                <div class="flex space-x-4 py-2">
                  <div 
                    v-for="comment in post.comments" 
                    :key="comment.id" 
                    class="flex-shrink-0 w-80 bg-white dark:bg-secondary p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div class="flex items-center mb-3">
                      <div class="bg-accent/20 rounded-full w-10 h-10 flex items-center justify-center text-accent font-medium">
                        {{ comment.name.charAt(0).toUpperCase() }}
                      </div>
                      <div class="ml-3">
                        <p class="font-medium">{{ comment.name }}</p>
                        <p class="text-xs text-text-secondary dark:text-text-secondary-light">
                          {{ new Date(comment.date).toLocaleDateString() }}
                        </p>
                      </div>
                    </div>
                    <p class="text-sm">{{ comment.content }}</p>
                  </div>
                </div>
              </div>
              
              <div class="flex justify-center mt-2 space-x-1">
                <div 
                  v-for="(_, index) in post.comments" 
                  :key="index"
                  class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"
                  :class="{ 'bg-accent': index === 0 }"
                ></div>
              </div>
            </div>
            
            <div v-else class="bg-white dark:bg-secondary p-4 rounded-lg text-center text-text-secondary dark:text-text-secondary-light">
              {{ t('blog.noComments') }}
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 class="text-2xl font-bold mb-2">{{ t('blog.postNotFound') }}</h2>
        <p class="text-text-secondary dark:text-text-secondary-light mb-6">{{ t('blog.postNotFoundMessage') }}</p>
        <button 
          @click="router.push('/blog')" 
          class="px-6 py-2 bg-accent hover:bg-accent-light text-white font-medium rounded-lg transition-colors"
        >
          {{ t('blog.backToBlog') }}
        </button>
      </div>
    </div>
    
    <div v-if="post && !isLoading" class="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      <div class="max-w-4xl mx-auto">
        <div class="border-t border-secondary dark:border-secondary-light pt-8">
          <h3 class="text-xl font-semibold mb-4 text-accent">{{ t('blog.relatedPosts') }}</h3>
          <div class="space-y-4">
            <div 
              v-for="relatedPost in blogStore.posts.filter((p: BlogPost) => p.id !== post?.id).slice(0, 3)" 
              :key="relatedPost.id"
              class="flex gap-4"
            >
              <div class="w-20 h-20 flex-shrink-0 bg-secondary dark:bg-secondary-light rounded overflow-hidden">
                <img 
                  v-if="relatedPost.coverImage" 
                  :src="relatedPost.coverImage" 
                  :alt="relatedPost.title" 
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-text-secondary dark:text-text-secondary-light">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zm-9 9h7v7H4v-7zm9 0h7v7h-7v-7z" />
                  </svg>
                </div>
              </div>
              <div class="flex-1">
                <router-link 
                  :to="`/blog/${relatedPost.id}`" 
                  class="text-text-primary dark:text-text-primary-light hover:text-accent dark:hover:text-accent-light transition-colors font-medium"
                >
                  {{ relatedPost.title }}
                </router-link>
                <p class="text-sm text-text-secondary dark:text-text-secondary-light mt-1">
                  {{ new Date(relatedPost.date).toLocaleDateString() }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useBlogStore, type BlogPost } from '../store/blogStore'
import { marked } from 'marked'
import type { MarkedOptions } from 'marked'
import hljs from 'highlight.js'
import gsap from 'gsap'
import { useNotificationStore } from '../store/notificationStore'
import { formatDescription } from '../utils/textFormatters'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const blogStore = useBlogStore()
const notificationStore = useNotificationStore()

const post = ref<BlogPost | null>(null)
const isLoading = ref(true)
const isSubmitting = ref(false)
const commentForm = ref({
  name: '',
  email: '',
  content: ''
})

marked.setOptions({
  highlight: function(code: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  } as any,
  breaks: true,
  gfm: true,
  pedantic: false,
  sanitize: false,  
  smartLists: true,
  smartypants: false
} as MarkedOptions)

onMounted(async () => {
  const postId = route.params.id as string
  
  try {
    const fetchedPost = await blogStore.fetchPostById(postId)
    post.value = fetchedPost
  } catch (error) {
    console.error('Error fetching post:', error)
    router.push('/blog')
  } finally {
    isLoading.value = false
    
    const tl = gsap.timeline()
    
    tl.from('.blog-header', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    })
    .from('.blog-content', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out'
    }, '-=0.3')
  }
})

const renderedContent = computed(() => {
  if (!post.value) return ''
  try {
    const formattedContent = formatDescription(post.value.content)
    return marked(formattedContent)
  } catch (error) {
    console.error('Error rendering markdown:', error)
    return '<p class="text-red-500">Error rendering content</p>'
  }
})

async function submitComment() {
  if (!post.value) return
  
  isSubmitting.value = true
  
  try {
    await blogStore.addComment(post.value.id, {
      name: commentForm.value.name,
      email: commentForm.value.email,
      content: commentForm.value.content
    })
    
    commentForm.value = {
      name: '',
      email: '',
      content: ''
    }
    
    notificationStore.addNotification({
      type: 'success',
      message: t('blog.commentSuccess'),
      duration: 3000
    })
    
    const updatedPost = await blogStore.fetchPostById(post.value.id)
    if (updatedPost) {
      post.value = updatedPost
    }
  } catch (error: any) {
    console.error('Error submitting comment:', error)
    const errorMessage = error?.message || t('blog.commentError')
    notificationStore.addNotification({
      type: 'error',
      message: errorMessage,
      duration: 5000
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style>
@import '../assets/atom-one-dark.css';

/* Basic content styling */
.blog-content {
  font-size: 1.125rem;
  line-height: 1.75;
}

/* Code blocks styling */
.blog-content pre {
  border-radius: 0.5rem;
  padding: 1.25rem;
  margin: 1.5rem 0;
  overflow-x: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.blog-content code {
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
}

.blog-content blockquote {
  border-left: 4px solid var(--accent);
  padding: 0.5rem 0 0.5rem 1.5rem;
  font-style: italic;
  margin: 1.5rem 0;
  background-color: rgba(var(--accent-rgb), 0.05);
  border-radius: 0 0.5rem 0.5rem 0;
}

.blog-content img {
  border-radius: 0.5rem;
  max-width: 100%;
  height: auto;
  margin: 1.5rem 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.blog-content h1,
.blog-content h2,
.blog-content h3,
.blog-content h4,
.blog-content h5,
.blog-content h6 {
  font-weight: 700;
  line-height: 1.25;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.blog-content h1 {
  font-size: 2.25rem;
}

.blog-content h2 {
  font-size: 1.875rem;
  border-bottom: 1px solid rgba(var(--text-primary-rgb), 0.1);
  padding-bottom: 0.5rem;
}

.blog-content h3 {
  font-size: 1.5rem;
}

.blog-content h4 {
  font-size: 1.25rem;
}

.blog-content ul,
.blog-content ol {
  padding-left: 1.5rem;
  margin: 1rem 0;
}

.blog-content li {
  margin-bottom: 0.5rem;
}

.blog-content ul {
  list-style-type: disc;
}

.blog-content ol {
  list-style-type: decimal;
}

.blog-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  overflow: hidden;
  border-radius: 0.5rem;
}

.blog-content th,
.blog-content td {
  padding: 0.75rem 1rem;
  border: 1px solid rgba(var(--text-primary-rgb), 0.1);
}

.blog-content th {
  background-color: rgba(var(--accent-rgb), 0.1);
  font-weight: 600;
}

.blog-content tr:nth-child(even) {
  background-color: rgba(var(--text-primary-rgb), 0.03);
}

/* Animation */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
</style>