<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { BlogPost } from '../store/blogStore'
import gsap from 'gsap'
import { blogService } from '../services/blogService'
import { useAuthStore } from '../store/authStore'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const isLoading = ref(true)
const currentPage = ref(1)
const postsPerPage = 6
const posts = ref<BlogPost[]>([])
const totalPostsCount = ref(0)

onMounted(async () => {
  try {
    isLoading.value = true
    const response = await blogService.getPosts({
      page: currentPage.value,
      limit: postsPerPage,
      sortBy: 'date',
      sortOrder: 'desc'
    })
    posts.value = response.data
    totalPostsCount.value = response.pagination.total
  } catch (error) {
    console.error('Error fetching blog posts:', error)
  } finally {
    isLoading.value = false
    
    const tl = gsap.timeline()
    
    tl.from('.blog-header', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    })
    .from('.blog-card', {
      y: 30,
      opacity: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: 'power3.out'
    }, '-=0.3')
    .from('.blog-sidebar', {
      x: 30,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out'
    }, '-=0.4')
  }
})

const categories = computed(() => {
  const allTags = posts.value.flatMap(post => post.tags)
  return [...new Set(allTags)].sort()
})

const filteredPosts = computed(() => {
  let result = posts.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(post => 
      post.title.toLowerCase().includes(query) || 
      post.excerpt.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  if (selectedCategory.value) {
    result = result.filter(post => 
      post.tags.includes(selectedCategory.value)
    )
  }
  
  return result
})

const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  return filteredPosts.value.slice(startIndex, endIndex)
})

const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / postsPerPage)
})

const pageNumbers = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i)
  }
  return pages
})

async function changePage(page: number) {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  try {
    isLoading.value = true
    const response = await blogService.getPosts({
      page: currentPage.value,
      limit: postsPerPage,
      sortBy: 'date',
      sortOrder: 'desc'
    })
    posts.value = response.data
    totalPostsCount.value = response.pagination.total
  } catch (error) {
    console.error('Error fetching blog posts:', error)
  } finally {
    isLoading.value = false
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

function selectCategory(category: string) {
  if (selectedCategory.value === category) {
    selectedCategory.value = ''
  } else {
    selectedCategory.value = category
  }
  currentPage.value = 1
}
</script>

<template>
  <div class="min-h-screen py-12">
    <div class="container mx-auto px-4">
      <div class="blog-header mb-12 text-center">
        <h1 class="text-4xl font-bold mb-4 text-text-primary">{{ t('blog.title') }}</h1>
        <p class="text-lg text-text-secondary max-w-2xl mx-auto">
          {{ t('blog.subtitle') }}
        </p>
        <div v-if="authStore.isAuthenticated" class="mt-4">
          <button
            @click="router.push('/admin/posts/new')"
            class="inline-flex items-center px-4 py-2 bg-accent hover:bg-accent-light text-white rounded-lg transition-colors"
          >
            <span class="material-icons mr-2">add</span>
            {{ t('blog.createPost') }}
          </button>
        </div>
      </div>
      
      <div class="flex flex-col lg:flex-row gap-8">
        <div class="lg:w-2/3">
          <div class="mb-8">
            <div class="relative">
              <input 
                v-model="searchQuery"
                type="text" 
                class="w-full bg-secondary border border-gray-700 rounded-lg py-3 px-4 pl-10 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                :placeholder="'Search articles...'"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-3.5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div v-if="isLoading" class="space-y-8">
            <div v-for="i in 3" :key="i" class="bg-secondary rounded-lg overflow-hidden shadow-lg animate-pulse">
              <div class="h-64 bg-gray-700"></div>
              <div class="p-6">
                <div class="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
                <div class="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div class="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div class="h-4 bg-gray-700 rounded w-2/3 mb-4"></div>
                <div class="h-10 bg-gray-700 rounded w-1/3"></div>
              </div>
            </div>
          </div>
          
          <div v-else-if="paginatedPosts.length > 0" class="space-y-8">
            <div 
              v-for="post in paginatedPosts" 
              :key="post.id"
              class="blog-card bg-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div class="md:flex">
                <div class="md:w-1/3 h-64 md:h-auto bg-gray-700">
                  <div class="h-full w-full bg-gray-700 flex items-center justify-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div class="md:w-2/3 p-6">
                  <div class="flex flex-wrap gap-2 mb-2">
                    <span 
                      v-for="tag in post.tags" 
                      :key="tag"
                      class="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent cursor-pointer hover:bg-accent hover:text-white transition-colors"
                      @click="selectCategory(tag)"
                    >
                      {{ tag }}
                    </span>
                  </div>
                  <h2 class="text-2xl font-bold mb-2 text-text-primary">{{ post.title }}</h2>
                  <p class="text-sm text-text-secondary mb-4">
                    {{ t('blog.postedOn') }} {{ formatDate(post.date) }} {{ t('by') }} {{ post.author }}
                  </p>
                  <p class="text-text-secondary mb-4">{{ post.excerpt }}</p>
                  <router-link 
                    :to="`/blog/${post.id}`" 
                    class="inline-flex items-center text-accent hover:text-accent-light transition-colors"
                  >
                    {{ t('blog.readMore') }}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-text-secondary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-xl font-semibold text-text-primary mb-2">No articles found</h3>
            <p class="text-text-secondary">Try adjusting your search or filter criteria</p>
          </div>
          
          <div v-if="totalPages > 1 && !isLoading" class="flex justify-center mt-12">
            <div class="flex space-x-2">
              <button 
                @click="changePage(currentPage - 1)" 
                :disabled="currentPage === 1"
                class="px-4 py-2 rounded-lg border border-gray-700 text-text-secondary hover:bg-accent hover:text-white hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                v-for="page in pageNumbers" 
                :key="page"
                @click="changePage(page)"
                class="px-4 py-2 rounded-lg border transition-colors"
                :class="page === currentPage ? 'bg-accent text-white border-accent' : 'border-gray-700 text-text-secondary hover:bg-accent hover:text-white hover:border-accent'"
              >
                {{ page }}
              </button>
              
              <button 
                @click="changePage(currentPage + 1)" 
                :disabled="currentPage === totalPages"
                class="px-4 py-2 rounded-lg border border-gray-700 text-text-secondary hover:bg-accent hover:text-white hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="lg:w-1/3 blog-sidebar">
          <div class="bg-secondary rounded-lg p-6 shadow-lg mb-8">
            <h3 class="text-xl font-semibold mb-4 text-accent">{{ t('blog.categories') }}</h3>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="category in categories" 
                :key="category"
                @click="selectCategory(category)"
                class="px-3 py-1.5 rounded-lg text-sm transition-colors"
                :class="selectedCategory === category ? 'bg-accent text-white' : 'bg-primary text-text-secondary hover:bg-accent/20 hover:text-accent'"
              >
                {{ category }}
              </button>
            </div>
          </div>
          
          <div class="bg-secondary rounded-lg p-6 shadow-lg">
            <h3 class="text-xl font-semibold mb-4 text-accent">{{ t('blog.recentPosts') }}</h3>
            <div class="space-y-4">
              <div 
                v-for="post in posts.slice(0, 3)" 
                :key="post.id"
                class="flex gap-4"
              >
                <div class="w-16 h-16 bg-gray-700 rounded-lg flex-shrink-0"></div>
                <div>
                  <router-link 
                    :to="`/blog/${post.id}`" 
                    class="font-medium text-text-primary hover:text-accent transition-colors line-clamp-2"
                  >
                    {{ post.title }}
                  </router-link>
                  <p class="text-xs text-text-secondary mt-1">{{ formatDate(post.date) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here */
</style>
