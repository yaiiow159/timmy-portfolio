<template>
  <div class="min-h-screen bg-primary dark:bg-primary-dark p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-text-primary dark:text-text-primary-dark mb-2">{{ t('admin.managePosts') }}</h1>
      <p class="text-text-secondary dark:text-text-secondary-dark">{{ t('admin.managePostsDescription') }}</p>
    </div>

    <div class="mb-6">
      <router-link
        :to="{ name: 'AdminNewPost' }"
        class="inline-flex items-center px-4 py-2 bg-accent dark:bg-accent-light hover:bg-accent-light dark:hover:bg-accent text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200"
      >
        <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ t('admin.newPost') }}
      </router-link>
    </div>

    <div class="bg-secondary dark:bg-secondary-dark rounded-lg shadow-sm p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-text-secondary dark:text-text-secondary-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="t('admin.searchPosts')"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm placeholder-gray-500 dark:placeholder-gray-400 bg-secondary dark:bg-secondary-dark text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-light focus:border-accent dark:focus:border-accent-light"
          />
        </div>

        <select
          v-model="sortBy"
          class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 rounded-md bg-secondary dark:bg-secondary-dark text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-light focus:border-accent dark:focus:border-accent-light"
        >
          <option value="title">{{ t('admin.sortByTitle') }}</option>
          <option value="date">{{ t('admin.sortByDate') }}</option>
          <option value="comments">{{ t('admin.sortByComments') }}</option>
        </select>

        <select
          v-model="sortOrder"
          class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 rounded-md bg-secondary dark:bg-secondary-dark text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-light focus:border-accent dark:focus:border-accent-light"
        >
          <option value="asc">{{ t('admin.ascending') }}</option>
          <option value="desc">{{ t('admin.descending') }}</option>
        </select>
      </div>
    </div>

    <div class="bg-secondary dark:bg-secondary-dark rounded-lg shadow-sm overflow-hidden">
      <div v-if="!posts.length" class="p-12 text-center">
        <svg class="mx-auto h-16 w-16 text-text-secondary dark:text-text-secondary-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.586-1.414l-4.5-4.5A2 2 0 0015.5 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2z" />
        </svg>
        <p class="mt-4 text-xl font-medium text-text-secondary dark:text-text-secondary-dark">{{ t('admin.noPosts') }}</p>
      </div>
      
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-secondary dark:bg-secondary-dark">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider whitespace-nowrap">
                  {{ t('admin.title') }}
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider whitespace-nowrap">
                  {{ t('admin.date') }}
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider whitespace-nowrap">
                  {{ t('admin.comments') }}
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider whitespace-nowrap">
                  {{ t('admin.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-secondary dark:bg-secondary-dark divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="post in paginatedPosts" :key="post.id" class="hover:bg-primary dark:hover:bg-primary-light transition-colors duration-150">
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <div class="text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1">{{ post.title }}</div>
                    <div class="text-sm text-text-secondary dark:text-text-secondary-dark line-clamp-1">{{ post.excerpt }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary-dark">
                  {{ formatDate(post.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-accent/10 dark:bg-accent-light/10 text-accent dark:text-accent-light">
                    {{ post.comments.length }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-4">
                    <router-link
                      :to="{ name: 'AdminEditPost', params: { id: post.id } }"
                      class="text-accent dark:text-accent-light hover:text-accent-light dark:hover:text-accent transition-colors duration-200"
                    >
                      {{ t('admin.edit') }}
                    </router-link>
                    <button
                      @click="() => { showDeleteDialog = true; postToDelete = post }"
                      class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
                    >
                      {{ t('admin.delete') }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-secondary dark:bg-secondary-dark px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div class="flex-1 flex justify-between items-center">
            <p class="text-sm text-text-secondary dark:text-text-secondary-dark">
              {{ t('admin.showing') }}
              <span class="font-medium">{{ startIndex + 1 }}</span>
              {{ t('admin.to') }}
              <span class="font-medium">{{ Math.min(endIndex, totalItems) }}</span>
              {{ t('admin.of') }}
              <span class="font-medium">{{ totalItems }}</span>
              {{ t('admin.results') }}
            </p>
            
            <div class="flex space-x-2">
              <button
                :disabled="currentPage === 1"
                @click="currentPage--"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-text-primary dark:text-text-primary-dark bg-secondary dark:bg-secondary-dark hover:bg-primary dark:hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {{ t('admin.previous') }}
              </button>
              <button
                :disabled="currentPage === totalPages"
                @click="currentPage++"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-text-primary dark:text-text-primary-dark bg-secondary dark:bg-secondary-dark hover:bg-primary dark:hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {{ t('admin.next') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDeleteDialog" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-secondary dark:bg-secondary-dark rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-secondary dark:bg-secondary-dark px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-text-primary dark:text-text-primary-dark" id="modal-title">
                  {{ t('admin.deletePost') }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-text-secondary dark:text-text-secondary-dark">
                    {{ t('admin.deleteConfirmation', { title: postToDelete?.title }) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-secondary dark:bg-secondary-dark px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="confirmDelete(postToDelete)"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 dark:bg-red-500 text-base font-medium text-white hover:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {{ t('admin.delete') }}
            </button>
            <button
              type="button"
              @click="showDeleteDialog = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-secondary dark:bg-secondary-dark text-base font-medium text-text-primary dark:text-text-primary-dark hover:bg-primary dark:hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent dark:focus:ring-accent-light sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '@/store/notificationStore'
import { useBlogStore } from '@/store/blogStore'
import type { BlogPost } from '@/store/blogStore'

const { t } = useI18n()
const notificationStore = useNotificationStore()
const blogStore = useBlogStore()

const posts = ref<BlogPost[]>([])
const searchQuery = ref('')
const sortBy = ref('date')
const sortOrder = ref('desc')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showDeleteDialog = ref(false)
const postToDelete = ref<BlogPost | null>(null)

const filteredPosts = computed(() => {
  if (!posts.value.length) return []
  
  return posts.value.filter(post => {
    const query = searchQuery.value.toLowerCase()
    return (
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query)
    )
  })
})

const sortedPosts = computed(() => {
  if (!filteredPosts.value.length) return []
  
  return [...filteredPosts.value].sort((a, b) => {
    let valueA, valueB
    
    if (sortBy.value === 'title') {
      valueA = a.title.toLowerCase()
      valueB = b.title.toLowerCase()
    } else if (sortBy.value === 'date') {
      valueA = new Date(a.date).getTime()
      valueB = new Date(b.date).getTime()
    } else if (sortBy.value === 'comments') {
      valueA = a.comments.length
      valueB = b.comments.length
    } else {
      return 0
    }
    
    if (sortOrder.value === 'asc') {
      return valueA > valueB ? 1 : -1
    } else {
      return valueA < valueB ? 1 : -1
    }
  })
})

const totalItems = computed(() => sortedPosts.value.length)

const totalPages = computed(() => {
  return Math.ceil(sortedPosts.value.length / itemsPerPage.value)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value
})

const endIndex = computed(() => {
  return Math.min(startIndex.value + itemsPerPage.value, sortedPosts.value.length)
})

const paginatedPosts = computed(() => {
  return sortedPosts.value.slice(startIndex.value, endIndex.value)
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function confirmDelete(post: BlogPost | null) {
  if (!post) return
  
  try {
    blogStore.deletePost(post.id)
    posts.value = posts.value.filter(p => p.id !== post.id)
    notificationStore.addNotification({
      type: 'success',
      message: t('admin.deleteSuccess'),
      duration: 3000
    })
  } catch (error) {
    console.error('delete post error:', error)
    notificationStore.addNotification({
      type: 'error',
      message: t('admin.deleteError'),
      duration: 3000
    })
  } finally {
    showDeleteDialog.value = false
    postToDelete.value = null
  }
}

async function fetchPosts() {
  try {
    await blogStore.fetchPosts()
    posts.value = blogStore.posts
  } catch (error) {
    console.error('fetch posts error:', error)
    notificationStore.addNotification({
      type: 'error',
      message: t('admin.fetchError'),
      duration: 3000
    })
  }
}

onMounted(() => {
  fetchPosts()
})
 
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
