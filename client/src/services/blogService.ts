import api from './api'
import type { BlogPost, Comment } from '../store/blogStore'

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  tag?: string
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
    try {
      const { page = 1, limit = 10, search, tag, sortBy, sortOrder } = params
      const response = await api.get('/posts', { params: { page, limit, search, tag, sortBy, sortOrder } })
      return {
        data: response.data.posts,
        pagination: response.data.pagination
      }
    } catch (err) {
      throw err
    }
  },

  getPostById: async (id: string): Promise<BlogPost> => {
    try {
      const response = await api.get(`/posts/${id}`)
      return response.data
    } catch (err) {
      throw err
    }
  },

  createPost: async (post: Omit<BlogPost, 'id' | 'comments'>): Promise<BlogPost> => {
    try {
      const response = await api.post('/posts', post)
      return response.data
    } catch (err) {
      throw err
    }
  },

  updatePost: async (id: string, post: Partial<BlogPost>): Promise<BlogPost> => {
    try {
      const response = await api.put(`/posts/${id}`, post)
      return response.data
    } catch (err) {
      throw err
    }
  },

  deletePost: async (id: string): Promise<void> => {
    try {
      await api.delete(`/posts/${id}`)
    } catch (err) {
      throw err
    }
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
    } catch (err) {
      throw err
    }
  },

  getLatestPosts: async (): Promise<BlogPost[]> => {
    try {
      const response = await api.get('/posts/latest')
      return response.data
    } catch (err) {
      throw err
    }
  },

  getTags: async (): Promise<string[]> => {
    try {
      const response = await api.get('/posts/tags')
      return response.data
    } catch (err) {
      throw err
    }
  }
}
