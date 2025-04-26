import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { blogService, type PaginationParams } from '../services/blogService'
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
      error.value = 'Failed to load blog posts'
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
      error.value = 'Failed to load blog post'
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function createPost(post: Omit<BlogPost, 'id' | 'comments'>) {
    if (!authStore.isAuthenticated) {
      throw new Error('Authentication required')
    }
    
    try {
      const postWithAuthor = {
        ...post,
        author: 'Timmy'
      }
      const response = await blogService.createPost(postWithAuthor, authStore.token as string)
      await fetchPosts({ page: 1 })
      return response
    } catch (err) {
      console.error('Error creating post:', err)
      throw new Error('Failed to create post')
    }
  }

  async function updatePost(id: string, post: Partial<BlogPost>) {
    if (!authStore.isAuthenticated) {
      throw new Error('Authentication required')
    }
    
    try {
      const response = await blogService.updatePost(id, post, authStore.token as string)
      const index = posts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        posts.value[index] = { ...posts.value[index], ...response }
      }
      return response
    } catch (err) {
      console.error('Error updating post:', err)
      throw new Error('Failed to update post')
    }
  }

  async function deletePost(id: string) {
    if (!authStore.isAuthenticated) {
      throw new Error('Authentication required')
    }
    
    try {
      await blogService.deletePost(id, authStore.token as string)
      posts.value = posts.value.filter(p => p.id !== id)
      await fetchPosts({ page: pagination.value.page, limit: pagination.value.limit })
    } catch (err) {
      console.error('Error deleting post:', err)
      throw new Error('Failed to delete post')
    }
  }

  async function addComment(postId: string, comment: Omit<Comment, 'id' | 'date'>) {
    try {
      const response = await blogService.addComment(postId, comment)
      return response
    } catch (err) {
      console.error('Error adding comment:', err)
      throw new Error('Failed to add comment')
    }
  }

  async function uploadImage(file: File) {
    if (!authStore.isAuthenticated) {
      throw new Error('Authentication required')
    }
    
    try {
      return await blogService.uploadImage(file, authStore.token as string)
    } catch (err) {
      console.error('Error uploading image:', err)
      throw new Error('Failed to upload image')
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
    createPost,
    updatePost,
    deletePost,
    addComment,
    uploadImage
  }
})
