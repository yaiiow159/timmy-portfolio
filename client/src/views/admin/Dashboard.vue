<template>
  <div class="admin-dashboard bg-slate-50 p-6 min-h-screen space-y-6">
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <h1 class="text-2xl font-bold text-slate-800">
        {{ t('admin.dashboardTitle') }}
      </h1>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-600 text-sm font-medium">
              {{ t('admin.totalPosts') }}
            </p>
            <h2 class="text-3xl font-bold text-slate-800 mt-2">
              {{ stats.posts }}
            </h2>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-600 text-sm font-medium">
              {{ t('admin.totalProjects') }}
            </p>
            <h2 class="text-3xl font-bold text-slate-800 mt-2">
              {{ stats.projects }}
            </h2>
          </div>
          <div class="bg-emerald-50 p-4 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-600 text-sm font-medium">
              {{ t('admin.totalComments') }}
            </p>
            <h2 class="text-3xl font-bold text-slate-800 mt-2">
              {{ stats.comments }}
            </h2>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow-sm">
      <div class="p-6 border-b border-slate-100">
        <h3 class="text-lg font-semibold text-slate-800">
          {{ t('admin.recentActivity') }}
        </h3>
      </div>
      
      <div v-if="isLoading" class="flex justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <div v-else-if="recentPosts.length === 0" class="flex flex-col items-center justify-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        <p class="mt-4 text-lg font-medium text-slate-600">
          {{ t('admin.noRecentActivity') }}
        </p>
      </div>
      
      <ul v-else class="divide-y divide-slate-100">
        <li v-for="post in recentPosts" :key="post.id" class="p-6 hover:bg-slate-50 transition-colors duration-200">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-medium text-slate-800">
                {{ post.title }}
              </h4>
              <p class="text-sm text-slate-500 mt-1">
                {{ new Date(post.date).toLocaleDateString() }}
              </p>
            </div>
            <router-link 
              :to="{ name: 'AdminEditPost', params: { id: post.id } }"
              class="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
            >
              {{ t('admin.edit') }}
            </router-link>
          </div>
        </li>
      </ul>
    </div>
    
    <div class="bg-white rounded-lg shadow-sm">
      <div class="p-6 border-b border-slate-100">
        <h3 class="text-lg font-semibold text-slate-800">
          {{ t('admin.quickActions') }}
        </h3>
      </div>
      
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <router-link 
            :to="{ name: 'AdminNewPost' }"
            class="flex items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200 group"
          >
            <div class="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span class="ml-4 text-slate-800 font-medium">
              {{ t('admin.newPost') }}
            </span>
          </router-link>
          
          <router-link 
            :to="{ name: 'AdminProjects' }"
            class="flex items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200 group"
          >
            <div class="p-3 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span class="ml-4 text-slate-800 font-medium">
              {{ t('admin.manageProjects') }}
            </span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '../../services/api'
import { useAuthStore } from '@/store/authStore.ts'
import type { BlogPost } from '@/store/blogStore.ts'

const { t } = useI18n()
const authStore = useAuthStore()

const isLoading = ref(true)
const stats = ref({
  posts: 0,
  projects: 0,
  comments: 0
})
const recentPosts = ref<BlogPost[]>([])

onMounted(async () => {
  if (!authStore.isAuthenticated) return
  
  try {
    const statsResponse = await api.get('/admin/stats', {
      headers: {
        'x-auth-token': authStore.token
      }
    })
    
    stats.value = {
      posts: statsResponse.data.postsCount,
      projects: statsResponse.data.projectsCount,
      comments: statsResponse.data.commentsCount
    }
    
    const postsResponse = await api.get('/posts', {
      params: { page: 1, limit: 5 }
    })
    
    recentPosts.value = postsResponse.data.posts
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    isLoading.value = false
  }
})
</script>
