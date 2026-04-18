import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import i18n from '../i18n'
import { blogService, type PaginationParams } from '../services/blogService'
import { fileService } from '../services/fileService'
import { useAuthStore } from './authStore'

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  date: string
  author: string
  tags: string[]
  coverImage?: string
  coverImagePublicId?: string
  comments: Comment[]
}

export interface Comment {
  id: string
  name: string
  email: string
  content: string
  date: string
}

export interface Pagination {
  total: number
  page: number
  limit: number
  pages: number
}

const t = i18n.global.t

export const useBlogStore = defineStore('blog', () => {
  const posts = ref<BlogPost[]>([])
  const pagination = ref<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  })
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const authStore = useAuthStore()

  const hasNextPage = computed(() => pagination.value.page < pagination.value.pages)
  const hasPrevPage = computed(() => pagination.value.page > 1)

  async function fetchPosts(params: PaginationParams = {}) {
    isLoading.value = true
    error.value = null

    try {
      const response = await blogService.getPosts(params)
      posts.value = response.data
      pagination.value = response.pagination
    } catch (err) {
      console.error('Error fetching blog posts:', err)
      error.value = t('errors.general.message')
    } finally {
      isLoading.value = false
    }
  }

  async function fetchNextPage() {
    if (hasNextPage.value) {
      await fetchPosts({
        page: pagination.value.page + 1,
        limit: pagination.value.limit
      })
    }
  }

  async function fetchPrevPage() {
    if (hasPrevPage.value) {
      await fetchPosts({
        page: pagination.value.page - 1,
        limit: pagination.value.limit
      })
    }
  }

  async function fetchPostById(id: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await blogService.getPostById(id)
      return response
    } catch (err) {
      console.error(`Error fetching blog post with ID ${id}:`, err)
      error.value = t('errors.general.message')
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function createPost(post: Omit<BlogPost, 'id' | 'comments'>) {
    if (!authStore.isAuthenticated) {
      throw new Error(t('errors.auth.unauthorized'))
    }

    try {
      const postWithAuthor = {
        ...post,
        author: authStore.user?.name ?? 'Timmy'
      }
      const response = await blogService.createPost(postWithAuthor)
      await fetchPosts({ page: 1 })
      return response
    } catch (err) {
      console.error('Error creating post:', err)
      throw new Error(t('errors.blog.createFailed'))
    }
  }

  async function updatePost(id: string, post: Partial<BlogPost>) {
    if (!authStore.isAuthenticated) {
      throw new Error(t('errors.auth.unauthorized'))
    }

    try {
      const response = await blogService.updatePost(id, post)
      const index = posts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        posts.value[index] = { ...posts.value[index], ...response }
      }
      return response
    } catch (err) {
      console.error('Error updating post:', err)
      throw new Error(t('errors.blog.updateFailed'))
    }
  }

  async function deletePost(id: string) {
    if (!authStore.isAuthenticated) {
      throw new Error(t('errors.auth.unauthorized'))
    }

    try {
      await blogService.deletePost(id)
      await fetchPosts({ page: pagination.value.page, limit: pagination.value.limit })
    } catch (err) {
      console.error('Error deleting post:', err)
      throw new Error(t('errors.blog.deleteFailed'))
    }
  }

  async function addComment(postId: string, comment: Omit<Comment, 'id' | 'date'>) {
    try {
      const response = await blogService.addComment(postId, comment)
      return response
    } catch (err) {
      console.error('Error adding comment:', err)
      throw new Error(t('blog.commentError'))
    }
  }

  async function uploadImage(file: File) {
    if (!authStore.isAuthenticated) {
      throw new Error(t('errors.auth.unauthorized'))
    }

    try {
      return await fileService.uploadFile(file)
    } catch (err) {
      console.error('Error uploading image:', err)
      throw new Error(t('errors.blog.uploadFailed'))
    }
  }

  async function fetchLatestPosts() {
    isLoading.value = true
    error.value = null

    try {
      const latestPosts = await blogService.getLatestPosts()
      return latestPosts
    } catch (err) {
      console.error('Error fetching latest posts:', err)
      error.value = t('errors.general.message')
      return []
    } finally {
      isLoading.value = false
    }
  }

  return {
    posts,
    pagination,
    isLoading,
    error,
    hasNextPage,
    hasPrevPage,
    fetchPosts,
    fetchNextPage,
    fetchPrevPage,
    fetchPostById,
    fetchLatestPosts,
    createPost,
    updatePost,
    deletePost,
    addComment,
    uploadImage
  }
})
