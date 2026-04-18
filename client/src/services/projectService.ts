/**
 * Project Service
 * Handles all project-related API calls with proper error handling and separation of concerns
 */

import api from './api'
import type { Project, ProjectType, VCSType } from '@/types/project'
import { handleError, ErrorContext } from '@/utils/errorHandler'

export interface CreateProjectDTO {
  title: string
  description: string
  technologies: string[]
  imageUrl?: string[]
  liveUrl?: string
  codeUrl?: string
  featured: boolean
  projectType: ProjectType
  vcsType: VCSType
}

export interface UpdateProjectDTO extends Partial<CreateProjectDTO> {
  id: string
}

class ProjectService {

  /**
   * Fetch all projects (public)
   */
  async getAllProjects(): Promise<Project[]> {
    try {
      const response = await api.get('/projects')
      // 後端已加分頁，回應為 { projects, pagination }；向下相容舊的陣列格式
      const list = Array.isArray(response.data) ? response.data : (response.data.projects ?? [])
      return this.normalizeProjects(list)
    } catch (error) {
      handleError(error, {
        context: ErrorContext.PUBLIC,
        showNotification: false
      })
      return []
    }
  }

  /**
   * Fetch featured projects (public)
   */
  async getFeaturedProjects(): Promise<Project[]> {
    try {
      const response = await api.get('/projects/featured')
      return this.normalizeProjects(response.data)
    } catch (error) {
      handleError(error, {
        context: ErrorContext.PUBLIC,
        showNotification: false
      })
      return []
    }
  }

  /**
   * Fetch projects by type (public)
   */
  async getProjectsByType(type: ProjectType): Promise<Project[]> {
    try {
      const response = await api.get(`/projects/type/${type}`)
      // 後端已加分頁，回應為 { projects, pagination }；向下相容舊的陣列格式
      const list = Array.isArray(response.data) ? response.data : (response.data.projects ?? [])
      return this.normalizeProjects(list)
    } catch (error) {
      handleError(error, {
        context: ErrorContext.PUBLIC,
        showNotification: false
      })
      return []
    }
  }

  /**
   * Fetch single project by ID (public)
   */
  async getProjectById(id: string): Promise<Project | null> {
    try {
      const response = await api.get(`/projects/${id}`)
      return this.normalizeProject(response.data)
    } catch (error) {
      handleError(error, {
        context: ErrorContext.PUBLIC,
        showNotification: false
      })
      return null
    }
  }

  /**
   * Create new project (admin)
   */
  async createProject(project: CreateProjectDTO): Promise<Project> {
    try {
      const response = await api.post('/projects', project)
      return this.normalizeProject(response.data)
    } catch (error) {
      throw handleError(error, {
        context: ErrorContext.ADMIN,
        showNotification: true
      })
    }
  }

  /**
   * Update existing project (admin)
   */
  async updateProject(project: UpdateProjectDTO): Promise<Project> {
    try {
      const { id, ...data } = project
      const response = await api.put(`/projects/${id}`, data)
      return this.normalizeProject(response.data)
    } catch (error) {
      throw handleError(error, {
        context: ErrorContext.ADMIN,
        showNotification: true
      })
    }
  }

  /**
   * Delete project (admin)
   */
  async deleteProject(id: string): Promise<void> {
    try {
      await api.delete(`/projects/${id}`)
    } catch (error) {
      throw handleError(error, {
        context: ErrorContext.ADMIN,
        showNotification: true
      })
    }
  }

  /**
   * Normalize project data to ensure consistent structure
   */
  private normalizeProject(project: any): Project {
    return {
      ...project,
      imageUrl: Array.isArray(project.imageUrl) 
        ? project.imageUrl 
        : project.imageUrl 
          ? [project.imageUrl] 
          : [],
      projectType: project.projectType || 'personal',
      vcsType: project.vcsType || 'github'
    }
  }

  /**
   * Normalize array of projects
   */
  private normalizeProjects(projects: any[]): Project[] {
    return projects.map(p => this.normalizeProject(p))
  }
}

export const projectService = new ProjectService()