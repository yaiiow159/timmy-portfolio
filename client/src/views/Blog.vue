<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useBlogPostList } from '../composables/useBlogPostList'
import { blogService } from '../services/blogService'
import { getStaticUrl } from '../services/api'
import { handleError, ErrorContext } from '../utils/errorHandler'
import { formatDescription } from '../utils/textFormatters'
import { estimateReadMinutes } from '../utils/blogReadTime'
import { useDebouncedWatch } from '../composables/useDebouncedWatch'
import BlogCard from '../components/blog/BlogCard.vue'

const { t, locale } = useI18n()
const { blogStore, loadList } = useBlogPostList()
const { posts, pagination, isLoading } = storeToRefs(blogStore)

const searchQuery = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const postsPerPage = 6
const allTags = ref<string[]>([])

const layoutMode = ref<'grid' | 'masonry' | 'list'>('grid')

const totalPostsCount = computed(() => pagination.value.total)

async function fetchPosts() {
  try {
    await loadList({
      page: currentPage.value,
      limit: postsPerPage,
      search: searchQuery.value || undefined,
      tag: selectedCategory.value || undefined,
      sortBy: 'date',
      sortOrder: 'desc'
    })
  } catch (error) {
    handleError(error, { context: ErrorContext.PUBLIC, showNotification: true })
  }
}

async function fetchAllTags() {
  try {
    allTags.value = await blogService.getTags()
  } catch (error) {
    handleError(error, { context: ErrorContext.PUBLIC, showNotification: false })
    allTags.value = []
  }
}

onMounted(async () => {
  await Promise.all([fetchPosts(), fetchAllTags()])
})

useDebouncedWatch(searchQuery, () => {
  currentPage.value = 1
  void fetchPosts()
}, 300)

watch(selectedCategory, () => {
  currentPage.value = 1
  void fetchPosts()
})

const categories = computed(() => allTags.value)

const totalPages = computed(() => Math.ceil(totalPostsCount.value / postsPerPage))

const pageNumbers = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i)
  }
  return pages
})

async function changePage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
  await fetchPosts()
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    changePage(currentPage.value + 1)
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    changePage(currentPage.value - 1)
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

function selectCategory(category: string) {
  selectedCategory.value = selectedCategory.value === category ? '' : category
}

function updateSearch(value: string) {
  searchQuery.value = value
}

function handleTagClick(tag: string) {
  selectedCategory.value = tag
}

function getImageUrl(imagePath: string | undefined): string {
  if (!imagePath) return ''
  return getStaticUrl(imagePath)
}
</script>

<template>
  <div class="min-h-screen w-full max-w-full min-w-0 overflow-x-hidden py-12 md:py-20 bg-gradient-to-b from-primary to-secondary tech-grid-bg">
    <div class="container mx-auto w-full max-w-full min-w-0 px-4 sm:px-6 md:px-8">
      <div class="blog-header mb-10 text-center md:mb-16">
        <div class="page-hero-panel mx-auto max-w-4xl">
          <h1 class="tech-title mb-5 text-3xl font-bold tracking-tight sm:text-4xl md:mb-7 md:text-5xl lg:text-6xl">
            {{ t('blog.title') }}
          </h1>
          <p class="mx-auto max-w-3xl text-base leading-relaxed text-text-secondary sm:text-lg md:text-xl lg:text-2xl">
            {{ t('blog.subtitle') }}
          </p>
          <div class="page-hero-divider mt-6 md:mt-7" />
        </div>
      </div>
      
      <div class="flex flex-col lg:flex-row gap-8">
        <div class="min-w-0 lg:w-2/3">
          <div class="mb-8">
            <div class="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <div class="flex-1">
                <div class="relative">
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input 
                    :value="searchQuery"
                    @input="updateSearch(($event.target as HTMLInputElement).value)"
                    type="text" 
                    class="tech-input w-full rounded-xl py-3 pr-4 pl-12 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 shadow-lg"
                    :placeholder="'Search articles...'"
                  />
                </div>
              </div>
              
              <div class="flex w-full flex-wrap items-center justify-start gap-2 sm:w-auto sm:justify-end">
                <span class="mr-1 text-sm tech-text-secondary sm:mr-2">{{ t('portfolio.layout') }}:</span>
                <div class="flex bg-secondary rounded-xl p-1">
                  <button
                    @click="layoutMode = 'grid'"
                    class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                    :class="layoutMode === 'grid' ? 'bg-accent text-white shadow-lg' : 'text-text-secondary hover:text-accent'"
                    title="Grid Layout"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    @click="layoutMode = 'masonry'"
                    class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                    :class="layoutMode === 'masonry' ? 'bg-accent text-white shadow-lg' : 'text-text-secondary hover:text-accent'"
                    title="Masonry Layout"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </button>
                  <button
                    @click="layoutMode = 'list'"
                    class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                    :class="layoutMode === 'list' ? 'bg-accent text-white shadow-lg' : 'text-text-secondary hover:text-accent'"
                    title="List Layout"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="isLoading" class="space-y-8">
            <div v-for="i in 3" :key="i" class="tech-card animate-pulse border border-accent/10">
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
          
          <div v-else-if="posts.length > 0">
            <div v-if="layoutMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <BlogCard 
                v-for="post in posts" 
                :key="post.id"
                :post="post"
                @tag-click="handleTagClick"
              />
            </div>
            
            <div v-else-if="layoutMode === 'masonry'" class="columns-1 sm:columns-2 gap-6 md:gap-8 space-y-6 md:space-y-8">
              <div v-for="post in posts" :key="post.id" class="break-inside-avoid">
                <BlogCard 
                  :post="post"
                  @tag-click="handleTagClick"
                />
              </div>
            </div>
            
            <div v-else-if="layoutMode === 'list'" class="space-y-6">
              <div 
                v-for="post in posts" 
                :key="post.id"
                class="blog-card tech-card overflow-hidden group hover:scale-[1.02] transition-all duration-300"
              >
                <div class="flex flex-col md:flex-row">
                  <div class="w-full md:w-64 lg:w-80 h-48 md:h-auto bg-gradient-to-br from-secondary to-primary relative overflow-hidden flex-shrink-0">
                    <div v-if="post.coverImage" class="h-full w-full relative">
                      <img 
                        :src="getImageUrl(post.coverImage)" 
                        :alt="post.title" 
                        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div v-else class="h-full w-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center tech-text-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5M5 12h14" />
                      </svg>
                    </div>
                    
                    <div class="absolute top-3 left-3">
                      <div class="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full border border-accent/30">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ estimateReadMinutes(post) }} min read
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex-1 p-6">
                    <div class="flex flex-col h-full">
                      <div class="mb-4">
                        <h2 class="text-2xl font-bold mb-2 tech-text-primary group-hover:text-accent transition-colors duration-300">
                          {{ post.title }}
                        </h2>
                        <div class="flex items-center gap-4 text-sm tech-text-secondary mb-3">
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
                      </div>
                      
                      <p class="text-text-secondary mb-6 leading-relaxed flex-grow">{{ post.excerpt || formatDescription(post.content, 200) }}</p>
                      
                      <div class="mb-6">
                        <div class="flex flex-wrap gap-2">
                          <span 
                            v-for="tag in post.tags.slice(0, 6)" 
                            :key="tag"
                            class="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-accent/10 to-tech-purple/10 text-accent border border-accent/20 hover:border-accent/40 transition-all duration-300 font-medium hover:scale-105 cursor-pointer"
                            @click="handleTagClick(tag)"
                          >
                            #{{ tag }}
                          </span>
                          <span v-if="post.tags.length > 6" class="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-accent/10 to-tech-purple/10 text-accent border border-accent/20 hover:border-accent/40 transition-all duration-300 font-medium hover:scale-105">
                            +{{ post.tags.length - 6 }}
                          </span>
                        </div>
                      </div>
                      
                      <div class="flex gap-3">
                        <router-link 
                          :to="`/blog/${post.id}`" 
                          class="tech-button inline-flex justify-center items-center gap-2 px-6 py-2.5"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Read Article
                        </router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-xl font-semibold text-text-primary mb-2">{{ t('blog.noPosts') }}</h3>
            <p class="text-text-secondary">{{ t('blog.tryDifferent') }}</p>
          </div>
          
          <div v-if="totalPages > 1 && !isLoading" class="mt-12 flex justify-center px-1 md:mt-20">
            <div class="flex max-w-full flex-wrap items-center justify-center gap-2 rounded-2xl border border-accent/20 bg-secondary p-3 shadow-2xl sm:gap-4 sm:p-5">
              <button 
                @click="prevPage" 
                :disabled="currentPage === 1"
                class="tech-button flex-shrink-0 rounded-xl px-3 py-2 transition-all duration-300 hover:scale-105 sm:px-4"
                :class="{'opacity-50 cursor-not-allowed': currentPage === 1, 'hover:bg-accent hover:text-white hover:shadow-lg': currentPage !== 1}"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div class="-mx-1 flex max-w-[min(100vw-8rem,28rem)] flex-1 flex-wrap justify-center gap-1 overflow-x-auto py-1 sm:max-w-none sm:flex-none sm:gap-2">
                <button 
                  v-for="page in pageNumbers" 
                  :key="page"
                  type="button"
                  @click="changePage(page)"
                  class="tech-button flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-110 sm:h-12 sm:w-12 sm:text-base"
                  :class="currentPage === page ? 'bg-gradient-to-r from-accent to-tech-purple text-white shadow-2xl' : 'bg-primary text-text-primary hover:bg-accent/20'"
                >
                  {{ page }}
                </button>
              </div>
              
              <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages"
                class="tech-button flex-shrink-0 rounded-xl px-3 py-2 transition-all duration-300 hover:scale-105 sm:px-4"
                :class="{'opacity-50 cursor-not-allowed': currentPage === totalPages, 'hover:bg-accent hover:text-white hover:shadow-lg': currentPage !== totalPages}"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="lg:w-1/3 blog-sidebar min-w-0">
          <div class="tech-card mb-8 p-5 sm:p-6 md:p-8">
            <h3 class="tech-title text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {{ t('blog.categories') }}
            </h3>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="category in categories" 
                :key="category"
                @click="selectCategory(category)"
                class="tech-button px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105"
                :class="selectedCategory === category ? 'bg-gradient-to-r from-accent to-tech-purple text-white shadow-lg' : 'bg-secondary text-text-secondary hover:bg-accent/20 hover:text-accent border border-accent/20'"
              >
                #{{ category }}
              </button>
            </div>
            <div v-if="selectedCategory" class="mt-4 pt-4 border-t border-accent/10">
              <button 
                @click="() => { selectedCategory = ''; currentPage = 1; void fetchPosts() }"
                class="tech-button tech-button-ghost text-sm w-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filter
              </button>
            </div>
          </div>
          
          <div class="tech-card p-5 sm:p-6 md:p-8">
            <h3 class="tech-title text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ t('blog.recentPosts') }}
            </h3>
            <div class="space-y-4">
              <div v-for="post in posts.slice(0, 3)" :key="post.id" class="flex gap-3 group cursor-pointer">
                <div class="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-lg flex-shrink-0 overflow-hidden">
                  <img 
                    v-if="post.coverImage" 
                    :src="getImageUrl(post.coverImage)" 
                    :alt="post.title" 
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center tech-text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5M5 12h14" />
                    </svg>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <router-link :to="`/blog/${post.id}`" class="font-medium tech-text-primary hover:text-accent transition-colors line-clamp-2 block">
                    {{ post.title }}
                  </router-link>
                  <div class="flex items-center gap-2 text-xs tech-text-secondary mt-1">
                    <span>{{ formatDate(post.date) }}</span>
                    <span>•</span>
                    <span>{{ estimateReadMinutes(post) }} min read</span>
                  </div>
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
.blog-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.blog-card:hover {
  transform: translateY(-5px);
}
</style>
