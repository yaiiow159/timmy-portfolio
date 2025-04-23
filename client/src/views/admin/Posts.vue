<template>
  <div class="space-y-6 bg-slate-50 p-6 min-h-screen">
    <div class="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
      <h2 class="text-2xl font-bold text-slate-800">
        {{ t('admin.managePosts') }}
      </h2>
      <router-link
        :to="{ name: 'AdminNewPost' }"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      >
        <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ t('admin.newPost') }}
      </router-link>
    </div>

    <div class="bg-white shadow-sm rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="t('admin.searchPosts')"
            class="block w-full rounded-lg border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <select
          v-model="sortBy"
          class="block w-full rounded-lg border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
        >
          <option value="date">{{ t('admin.sortByDate') }}</option>
          <option value="title">{{ t('admin.sortByTitle') }}</option>
        </select>

        <select
          v-model="sortOrder"
          class="block w-full rounded-lg border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
        >
          <option value="desc">{{ t('admin.descending') }}</option>
          <option value="asc">{{ t('admin.ascending') }}</option>
        </select>
      </div>
    </div>

    <div class="bg-white shadow-sm rounded-lg overflow-hidden">
      <div v-if="!posts.length" class="p-8 text-center text-slate-500 bg-slate-50">
        <svg class="mx-auto h-12 w-12 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.586-1.414l-4.5-4.5A2 2 0 0015.5 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2z" />
        </svg>
        <p class="mt-4 text-lg font-medium">{{ t('admin.noPosts') }}</p>
      </div>
      
      <div v-else>
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                {{ t('admin.title') }}
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                {{ t('admin.date') }}
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                {{ t('admin.comments') }}
              </th>
              <th scope="col" class="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                {{ t('admin.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-200">
            <tr v-for="post in posts" :key="post.id" class="hover:bg-slate-50 transition-colors duration-150">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-slate-900">{{ post.title }}</div>
                <div class="text-sm text-slate-500 mt-1">{{ post.excerpt }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {{ formatDate(post.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ post.commentsCount }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                <router-link
                  :to="{ name: 'AdminEditPost', params: { id: post.id } }"
                  class="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                >
                  {{ t('admin.edit') }}
                </router-link>
                <button
                  @click="confirmDelete(post)"
                  class="text-red-600 hover:text-red-900 transition-colors duration-200"
                >
                  {{ t('admin.delete') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="bg-white px-6 py-4 flex items-center justify-between border-t border-slate-200">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              :disabled="currentPage === 1"
              @click="currentPage--"
              class="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {{ t('admin.previous') }}
            </button>
            <button
              :disabled="currentPage === totalPages"
              @click="currentPage++"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {{ t('admin.next') }}
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-slate-700">
                {{ t('admin.showing') }}
                <span class="font-medium">{{ startIndex + 1 }}</span>
                {{ t('admin.to') }}
                <span class="font-medium">{{ Math.min(endIndex, totalItems) }}</span>
                {{ t('admin.of') }}
                <span class="font-medium">{{ totalItems }}</span>
                {{ t('admin.results') }}
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  :disabled="currentPage === 1"
                  @click="currentPage--"
                  class="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <span class="sr-only">{{ t('admin.previous') }}</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button
                  :disabled="currentPage === totalPages"
                  @click="currentPage++"
                  class="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <span class="sr-only">{{ t('admin.next') }}</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 刪除確認對話框 -->
    <div v-if="showDeleteDialog" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-slate-900" id="modal-title">
                  {{ t('admin.deletePost') }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-slate-500">
                    {{ t('admin.deleteConfirmation', { title: postToDelete?.title }) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="postToDelete && confirmDelete(postToDelete)"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {{ t('admin.delete') }}
            </button>
            <button
              type="button"
              @click="showDeleteDialog = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '../../store/notificationStore'

interface Post {
  id: string
  title: string
  excerpt: string
  createdAt: string
  commentsCount: number
}

const { t } = useI18n()
const notificationStore = useNotificationStore()

const posts = ref<Post[]>([])
const searchQuery = ref('')
const sortBy = ref('date')
const sortOrder = ref('desc')
const itemsPerPage = ref<number>(10)
const currentPage = ref<number>(1)
const showDeleteDialog = ref(false)
const postToDelete = ref<Post | null>(null)

const filteredPosts = computed(() => {
  return posts.value
    .filter(post => 
      post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    .sort((a, b) => {
      const modifier = sortOrder.value === 'asc' ? 1 : -1
      if (sortBy.value === 'date') {
        return modifier * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      }
      return modifier * a.title.localeCompare(b.title)
    })
})

const totalItems = computed(() => filteredPosts.value.length)
const totalPages = computed<number>(() => {
  const total = Number(filteredPosts.value.length)
  const perPage = Number(itemsPerPage.value) || 1
  return Math.ceil(total / perPage)
})
const startIndex = computed<number>(() => {
  const page = Number(currentPage.value) || 1
  const perPage = Number(itemsPerPage.value) || 1
  return (page - 1) * perPage
})
const endIndex = computed<number>(() => {
  const start = startIndex.value
  const perPage = Number(itemsPerPage.value) || 1
  return Number(start) + Number(perPage)
})
const paginatedPosts = computed(() => 
  filteredPosts.value.slice(startIndex.value, endIndex.value)
)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

async function confirmDelete(post: { id: string; title: string; excerpt: string; createdAt: string; commentsCount: number }) {
  if (postToDelete.value) {
    try {
      await deletePostAPI(postToDelete.value.id)
      posts.value = posts.value.filter(post => post.id !== postToDelete.value?.id)
      notificationStore.addNotification({
        type: 'success',
        message: t('posts.deleteSuccess'),
        duration: 3000
      })
    } catch (error) {
      console.error(error)
      notificationStore.addNotification({
        type: 'error',
        message: t('posts.deleteError'),
        duration: 3000
      })
    } finally {
      showDeleteDialog.value = false
      postToDelete.value = null
    }
  }
}

async function fetchPosts() {
  try {
    const response = await fetch('/api/posts')
    posts.value = await response.json()
  } catch (error) {
    console.error(error)
    notificationStore.addNotification({
      type: 'error',
      message: t('admin.fetchError'),
      duration: 3000
    })
  }
}

async function deletePostAPI(id: string): Promise<void> {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete post')
  }
}

// 初始化
fetchPosts()
</script>
