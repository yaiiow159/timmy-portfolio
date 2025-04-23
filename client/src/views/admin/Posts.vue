<template>
  <div class="admin-posts">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-text-primary dark:text-text-primary-light">
        {{ t('admin.managePosts') }}
      </h1>
      
      <router-link 
        :to="{ name: 'AdminNewPost' }"
        class="bg-accent hover:bg-accent-light text-white px-4 py-2 rounded-lg flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ t('admin.newPost') }}
      </router-link>
    </div>
    
    <!-- Search and Filter -->
    <div class="bg-primary dark:bg-primary-light p-4 rounded-lg mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-grow">
          <input 
            v-model="searchQuery"
            type="text"
            class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-text-primary dark:text-text-primary-light"
            :placeholder="t('admin.searchPosts')"
            @input="handleSearch"
          >
        </div>
        
        <div class="flex gap-2">
          <select 
            v-model="filters.sortBy"
            class="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-text-primary dark:text-text-primary-light"
            @change="fetchPosts"
          >
            <option value="date">{{ t('admin.sortByDate') }}</option>
            <option value="title">{{ t('admin.sortByTitle') }}</option>
          </select>
          
          <select 
            v-model="filters.sortOrder"
            class="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-text-primary dark:text-text-primary-light"
            @change="fetchPosts"
          >
            <option value="desc">{{ t('admin.descending') }}</option>
            <option value="asc">{{ t('admin.ascending') }}</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Posts Table -->
    <div class="bg-primary dark:bg-primary-light rounded-lg overflow-hidden">
      <div v-if="blogStore.isLoading" class="flex justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <div v-else-if="blogStore.posts.length === 0" class="text-center py-12 text-text-secondary dark:text-text-secondary-light">
        {{ t('admin.noPosts') }}
      </div>
      
      <table v-else class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('admin.title') }}
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('admin.date') }}
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('admin.comments') }}
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('admin.actions') }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="post in blogStore.posts" :key="post.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-text-primary dark:text-text-primary-light">
                {{ post.title }}
              </div>
              <div class="text-sm text-text-secondary dark:text-text-secondary-light">
                {{ post.tags.join(', ') }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary-light">
              {{ new Date(post.date).toLocaleDateString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary-light">
              {{ post.comments.length }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <router-link 
                  :to="{ name: 'BlogPost', params: { id: post.id } }"
                  class="text-blue-500 hover:text-blue-700"
                  target="_blank"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </router-link>
                
                <router-link 
                  :to="{ name: 'AdminEditPost', params: { id: post.id } }"
                  class="text-indigo-500 hover:text-indigo-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </router-link>
                
                <button 
                  @click="confirmDelete(post)"
                  class="text-red-500 hover:text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Pagination -->
      <div class="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
        <div class="flex-1 flex justify-between sm:hidden">
          <button 
            @click="blogStore.fetchPrevPage()"
            :disabled="!blogStore.hasPrevPage"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-text-primary dark:text-text-primary-light bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            {{ t('admin.previous') }}
          </button>
          <button 
            @click="blogStore.fetchNextPage()"
            :disabled="!blogStore.hasNextPage"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-text-primary dark:text-text-primary-light bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            {{ t('admin.next') }}
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-text-secondary dark:text-text-secondary-light">
              {{ t('admin.showing') }} 
              <span class="font-medium">{{ (blogStore.pagination.page - 1) * blogStore.pagination.limit + 1 }}</span>
              {{ t('admin.to') }}
              <span class="font-medium">
                {{ Math.min(blogStore.pagination.page * blogStore.pagination.limit, blogStore.pagination.total) }}
              </span>
              {{ t('admin.of') }}
              <span class="font-medium">{{ blogStore.pagination.total }}</span>
              {{ t('admin.results') }}
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button 
                @click="blogStore.fetchPrevPage()"
                :disabled="!blogStore.hasPrevPage"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-text-primary dark:text-text-primary-light hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <span class="sr-only">{{ t('admin.previous') }}</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              
              <div 
                v-for="page in paginationPages" 
                :key="page"
                class="relative inline-flex items-center"
              >
                <button 
                  v-if="page !== '...'"
                  @click="goToPage(Number(page))"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    page === blogStore.pagination.page
                      ? 'z-10 bg-accent border-accent text-white'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-text-primary dark:text-text-primary-light hover:bg-gray-50 dark:hover:bg-gray-700'
                  ]"
                >
                  {{ page }}
                </button>
                <span 
                  v-else
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-text-secondary dark:text-text-secondary-light"
                >
                  ...
                </span>
              </div>
              
              <button 
                @click="blogStore.fetchNextPage()"
                :disabled="!blogStore.hasNextPage"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-text-primary dark:text-text-primary-light hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <span class="sr-only">{{ t('admin.next') }}</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showDeleteModal = false"></div>
        
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-text-primary dark:text-text-primary-light" id="modal-title">
                  {{ t('admin.deletePost') }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-text-secondary dark:text-text-secondary-light">
                    {{ t('admin.deleteConfirmation', { title: postToDelete?.title }) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="deletePost"
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              {{ t('admin.delete') }}
            </button>
            <button 
              @click="showDeleteModal = false"
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-text-primary dark:text-text-primary-light hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {{ t('admin.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBlogStore, type BlogPost } from '@/store/blogStore.ts'
import { useNotificationStore } from '@/store/notificationStore.ts'
import { debounce } from 'lodash'

const { t } = useI18n()
const blogStore = useBlogStore()
const notificationStore = useNotificationStore()

const searchQuery = ref('')
const showDeleteModal = ref(false)
const postToDelete = ref<BlogPost | null>(null)
const filters = ref({
  sortBy: 'date',
  sortOrder: 'desc' as 'asc' | 'desc'
})

// Debounced search function
const handleSearch = debounce(() => {
  fetchPosts()
}, 300)

// Fetch posts with current filters
async function fetchPosts() {
  await blogStore.fetchPosts({
    page: 1,
    limit: 10,
    search: searchQuery.value,
    sortBy: filters.value.sortBy,
    sortOrder: filters.value.sortOrder
  })
}

// Generate pagination pages array
const paginationPages = computed(() => {
  const currentPage = blogStore.pagination.page
  const totalPages = blogStore.pagination.pages
  
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  
  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages - 1, totalPages]
  }
  
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }
  
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages
  ]
})

// Go to specific page
function goToPage(page: number) {
  if (typeof page === 'number') {
    blogStore.fetchPosts({
      page,
      limit: blogStore.pagination.limit,
      search: searchQuery.value,
      sortBy: filters.value.sortBy,
      sortOrder: filters.value.sortOrder
    })
  }
}

// Confirm post deletion
function confirmDelete(post: BlogPost) {
  postToDelete.value = post
  showDeleteModal.value = true
}

// Delete post
async function deletePost() {
  if (!postToDelete.value) return
  
  try {
    await blogStore.deletePost(postToDelete.value.id)
    
    notificationStore.addNotification({
      type: 'success',
      message: t('admin.postDeleted'),
      duration: 5000
    })
    
    showDeleteModal.value = false
    postToDelete.value = null
  } catch (error) {
    notificationStore.addNotification({
      type: 'error',
      message: t('admin.deleteError'),
      duration: 5000
    })
  }
}

// Watch for filter changes
watch([() => filters.value.sortBy, () => filters.value.sortOrder], () => {
  fetchPosts()
})

// Initial fetch
onMounted(() => {
  fetchPosts()
})
</script>
