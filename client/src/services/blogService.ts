import api from './api'
import type { BlogPost, Comment } from '../store/blogStore'
import { useActivityStore } from '@/store/activityStore'
import { useAuthStore } from '@/store/authStore'

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

export const blogService = {
  getPosts: async (params: PaginationParams = {}): Promise<PaginatedResponse<BlogPost>> => {
    const { page = 1, limit = 10, search, sortBy, sortOrder } = params
    const response = await api.get('/posts', { params: { page, limit, search, sortBy, sortOrder } })
    return {
      data: response.data.posts,
      pagination: response.data.pagination
    }
  },

  getPostById: async (id: string): Promise<BlogPost> => {
    const response = await api.get(`/posts/${id}`)
    return response.data
  },

  createPost: async (post: Omit<BlogPost, 'id' | 'comments'>, token: string): Promise<BlogPost> => {
    const response = await api.post('/posts', post, {
      headers: {
        'x-auth-token': token
      }
    })
    
    // 記錄活動
    const activityStore = useActivityStore()
    const authStore = useAuthStore()
    await activityStore.createActivity({
      type: 'POST_CREATED',
      title: '發布了新文章',
      description: `《${post.title}》`,
      userName: authStore.user?.name || 'Anonymous',
      targetId: response.data.id,
      targetType: 'post'
    })
    
    return response.data
  },

  updatePost: async (id: string, post: Partial<BlogPost>, token: string): Promise<BlogPost> => {
    const response = await api.put(`/posts/${id}`, post, {
      headers: {
        'x-auth-token': token
      }
    })
    return response.data
  },

  deletePost: async (id: string, token: string): Promise<void> => {
    await api.delete(`/posts/${id}`, {
      headers: {
        'x-auth-token': token
      }
    })
  },

  addComment: async (postId: string, comment: Omit<Comment, 'id' | 'date'>): Promise<Comment[]> => {
    const response = await api.post(`/posts/${postId}/comments`, comment)
    
    // 記錄活動
    const activityStore = useActivityStore()
    await activityStore.createActivity({
      type: 'COMMENT_ADDED',
      title: '發表了評論',
      description: comment.content.substring(0, 50) + (comment.content.length > 50 ? '...' : ''),
      userName: comment.name,
      targetId: postId,
      targetType: 'post'
    })
    
    return response.data
  },

  uploadImage: async (file: File, token: string): Promise<{ fileName: string; filePath: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-auth-token': token
      }
    })
    
    return response.data
  }
}
