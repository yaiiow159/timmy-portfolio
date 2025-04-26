import api from './api'
import type { BlogPost, Comment } from '../store/blogStore'

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
    try {
      const response = await api.post(`/posts/${postId}/comments`, {
        name: comment.name,
        email: comment.email,
        content: comment.content,
        postId: postId
      })
      
      if (!response.data) {
        throw new Error('No data received from server')
      }
      
      return response.data
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  },

  uploadImage: async (file: File, token: string): Promise<{ fileName: string; filePath: string; publicId: string }> => {
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
