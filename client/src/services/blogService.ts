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

  createPost: async (post: Omit<BlogPost, 'id' | 'comments'>): Promise<BlogPost> => {
    const response = await api.post('/posts', post)
    return response.data
  },

  updatePost: async (id: string, post: Partial<BlogPost>): Promise<BlogPost> => {
    const response = await api.put(`/posts/${id}`, post)
    return response.data
  },

  deletePost: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`)
  },

  addComment: async (postId: string, comment: Omit<Comment, 'id' | 'date'>): Promise<Comment[]> => {
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
  },

  uploadImage: async (file: File): Promise<{ fileName: string; filePath: string; publicId: string }> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },

  getLatestPosts: async (): Promise<BlogPost[]> => {
    const response = await api.get('/posts/latest')
    return response.data
  }
}
