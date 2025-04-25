import api from './api'
import type { Project } from '@/types/project'

export const projectService = {

  async createProject(project: Omit<Project, 'id'>, token: string): Promise<Project> {
    const response = await api.post('/projects', project, {
      headers: {
        'x-auth-token': token
      }
    })
    return response.data
  }
} 