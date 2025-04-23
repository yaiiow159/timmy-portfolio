import api from './api'
import type { Project } from '../store/portfolioStore'

export const portfolioService = {
  getProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects')
    return response.data
  },

  getProjectById: async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}`)
    return response.data
  },

  createProject: async (project: Omit<Project, 'id'>): Promise<Project> => {
    const response = await api.post('/projects', project)
    return response.data
  },

  updateProject: async (id: string, project: Partial<Project>): Promise<Project> => {
    const response = await api.put(`/projects/${id}`, project)
    return response.data
  },

  deleteProject: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`)
  },

  uploadImage: async (file: File): Promise<{ fileName: string; filePath: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  }
}
