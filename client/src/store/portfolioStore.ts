import { defineStore } from 'pinia'
import { ref } from 'vue'
import { projectService } from '@/services/projectService'
import type { Project, ProjectType } from '@/types/project'

export type { Project }

export const usePortfolioStore = defineStore('portfolio', () => {
  const projects = ref<Project[]>([])
  const featuredProjects = ref<Project[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProjects() {
    isLoading.value = true
    error.value = null
    
    try {
      projects.value = await projectService.getAllProjects()
    } catch (err) {
      console.error('Error fetching projects:', err)
      error.value = 'Failed to load projects'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchFeaturedProjects() {
    isLoading.value = true
    error.value = null
    
    try {
      featuredProjects.value = await projectService.getFeaturedProjects()
    } catch (err) {
      console.error('Error fetching featured projects:', err)
      error.value = 'Failed to load featured projects'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProjectsByType(type: ProjectType) {
    isLoading.value = true
    error.value = null
    
    try {
      return await projectService.getProjectsByType(type)
    } catch (err) {
      console.error(`Error fetching projects by type ${type}:`, err)
      error.value = 'Failed to load projects'
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProjectById(id: string) {
    isLoading.value = true
    error.value = null
    
    try {
      return await projectService.getProjectById(id)
    } catch (err) {
      console.error(`Error fetching project with ID ${id}:`, err)
      error.value = 'Failed to load project'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    projects,
    featuredProjects,
    isLoading,
    error,
    fetchProjects,
    fetchFeaturedProjects,
    fetchProjectsByType,
    fetchProjectById
  }
})
