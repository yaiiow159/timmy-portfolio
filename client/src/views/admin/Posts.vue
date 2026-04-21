<template>
  <div class="min-h-screen">
    <div class="mb-8">
      <h1 class="tech-title text-3xl font-bold mb-2">{{ t('admin.managePosts') }}</h1>
      <p class="text-text-secondary">{{ t('admin.managePostsDescription') }}</p>
    </div>

    <div class="mb-6">
      <router-link
        :to="{ name: 'AdminNewPost' }"
        class="tech-button inline-flex items-center px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 tech-glow"
      >
        <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ t('admin.newPost') }}
      </router-link>
    </div>

    <div class="tech-card p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <svg class="h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="t('admin.searchPosts')"
            class="tech-input w-full pl-12 pr-4"
          />
        </div>

        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <svg class="h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <select
            v-model="sortBy"
            class="tech-input w-full pl-12 pr-10 appearance-none"
          >
            <option value="title">{{ t('admin.sortByTitle') }}</option>
            <option value="date">{{ t('admin.sortByDate') }}</option>
            <option value="comments">{{ t('admin.sortByComments') }}</option>
          </select>
          <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <svg class="h-4 w-4 text-text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <svg class="h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          </div>
          <select
            v-model="sortOrder"
            class="tech-input w-full pl-12 pr-10 appearance-none"
          >
            <option value="asc">{{ t('admin.ascending') }}</option>
            <option value="desc">{{ t('admin.descending') }}</option>
          </select>
          <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <svg class="h-4 w-4 text-text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="tech-card overflow-hidden">
      <div v-if="isLoading" class="p-12 text-center tech-hologram-overlay">
        <div class="inline-block h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p class="mt-4 text-text-secondary">{{ t('common.loading') }}</p>
      </div>
      <div v-else-if="!posts.length" class="p-12 text-center tech-hologram-overlay">
        <svg class="mx-auto h-16 w-16 text-text-secondary dark:text-text-secondary-dark tech-glow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.586-1.414l-4.5-4.5A2 2 0 0015.5 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2z" />
        </svg>
        <p class="mt-4 text-xl font-medium text-text-secondary dark:text-text-secondary-dark tech-text-glow">{{ t('admin.noPosts') }}</p>
      </div>
      
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-secondary dark:bg-secondary-dark tech-scan-lines">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider whitespace-nowrap tech-text-glow">
                  {{ t('admin.title') }}
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider whitespace-nowrap tech-text-glow">
                  {{ t('admin.date') }}
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider whitespace-nowrap tech-text-glow">
                  {{ t('admin.comments') }}
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider whitespace-nowrap tech-text-glow">
                  {{ t('admin.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-secondary dark:bg-secondary-dark divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="post in posts" :key="post.id" class="hover:bg-primary dark:hover:bg-primary-light transition-colors duration-150 tech-card tech-glow">
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
                    {{ commentCount(post) }}
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
                      type="button"
                      @click="openDeleteDialog(post)"
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

        <div class="bg-secondary dark:bg-secondary-dark px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 tech-data-stream">
          <div class="flex-1 flex justify-between items-center">
            <p class="text-sm text-text-secondary dark:text-text-secondary-dark tech-scan-lines">
              {{ t('admin.showing') }}
              <span class="font-medium tech-text-glow">{{ startIndex + 1 }}</span>
              {{ t('admin.to') }}
              <span class="font-medium tech-text-glow">{{ Math.min(endIndex, totalItems) }}</span>
              {{ t('admin.of') }}
              <span class="font-medium tech-text-glow">{{ totalItems }}</span>
              {{ t('admin.results') }}
            </p>
            
            <div class="flex space-x-2">
              <button
                :disabled="currentPage === 1"
                type="button"
                @click="goPrev"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-text-primary dark:text-text-primary-dark bg-secondary dark:bg-secondary-dark hover:bg-primary dark:hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 tech-button tech-pulse"
              >
                {{ t('admin.previous') }}
              </button>
              <button
                :disabled="currentPage === totalPages"
                type="button"
                @click="goNext"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-text-primary dark:text-text-primary-dark bg-secondary dark:bg-secondary-dark hover:bg-primary dark:hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 tech-button tech-pulse"
              >
                {{ t('admin.next') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDeleteDialog" class="fixed z-50 inset-0 overflow-y-auto tech-matrix-bg tech-particles" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity tech-scan-lines" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-secondary dark:bg-secondary-dark rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full tech-card tech-glow">
          <div class="bg-secondary dark:bg-secondary-dark px-4 pt-5 pb-4 sm:p-6 sm:pb-4 tech-hologram-overlay">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10 tech-pulse">
                <svg class="h-6 w-6 text-red-600 dark:text-red-400 tech-glow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-text-primary dark:text-text-primary-dark tech-text-glow" id="modal-title">
                  {{ t('admin.deletePost') }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-text-secondary dark:text-text-secondary-dark tech-scan-lines">
                    {{ t('admin.deleteConfirmation', { title: postToDelete?.title }) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-secondary dark:bg-secondary-dark px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse tech-data-stream">
            <button
              type="button"
              @click="confirmDelete(postToDelete)"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 dark:bg-red-500 text-base font-medium text-white hover:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm tech-button tech-pulse"
            >
              {{ t('admin.delete') }}
            </button>
            <button
              type="button"
              @click="showDeleteDialog = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-secondary dark:bg-secondary-dark text-base font-medium text-text-primary dark:text-text-primary-dark hover:bg-primary dark:hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent dark:focus:ring-accent-light sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm tech-button"
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
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/store/notificationStore'
import { useBlogStore } from '@/store/blogStore'
import type { BlogPost } from '@/store/blogStore'
import { useDebouncedWatch } from '@/composables/useDebouncedWatch'

const { t } = useI18n()
const notificationStore = useNotificationStore()
const blogStore = useBlogStore()
const { posts, pagination, isLoading } = storeToRefs(blogStore)

const searchQuery = ref('')
const sortBy = ref<'title' | 'date' | 'comments'>('date')
const sortOrder = ref<'asc' | 'desc'>('desc')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showDeleteDialog = ref(false)
const postToDelete = ref<BlogPost | null>(null)

function listQueryParams() {
  return {
    page: currentPage.value,
    limit: itemsPerPage.value,
    search: searchQuery.value.trim() || undefined,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
    mode: 'list' as const
  }
}

async function loadPosts() {
  try {
    await blogStore.fetchPosts(listQueryParams())
  } catch (error) {
    console.error('fetch posts error:', error)
    notificationStore.addNotification({
      type: 'error',
      message: t('admin.fetchError'),
      duration: 3000
    })
  }
}

useDebouncedWatch(searchQuery, () => {
  currentPage.value = 1
  void loadPosts()
}, 300)

watch([sortBy, sortOrder], () => {
  currentPage.value = 1
  void loadPosts()
})

function goPrev() {
  if (currentPage.value <= 1) return
  currentPage.value--
  void loadPosts()
}

function goNext() {
  if (currentPage.value >= totalPages.value) return
  currentPage.value++
  void loadPosts()
}

const totalItems = computed(() => pagination.value.total)

const totalPages = computed(() => Math.max(1, pagination.value.pages || 1))

onMounted(() => {
  void loadPosts()
})

const startIndex = computed(() => {
  if (totalItems.value === 0) return 0
  return (currentPage.value - 1) * itemsPerPage.value
})

const endIndex = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, totalItems.value)
})

function commentCount(post: BlogPost) {
  return post.commentsCount ?? post.comments.length
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function openDeleteDialog(post: BlogPost) {
  showDeleteDialog.value = true
  postToDelete.value = post
}

async function confirmDelete(post: BlogPost | null) {
  if (!post) return

  try {
    await blogStore.deletePost(post.id, listQueryParams())
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
</script>

<style scoped>
.line-clamp-1 {
  line-clamp: 1;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
