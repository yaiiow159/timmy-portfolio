import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  imageUrls?: string[]  // New format: array of image URLs
  imageUrl?: string     // Old format: single image URL (for backward compatibility)
  liveUrl?: string
  codeUrl?: string
  featured: boolean
}

export const usePortfolioStore = defineStore('portfolio', () => {
  const projects = ref<Project[]>([])
  const featuredProjects = ref<Project[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProjects() {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.get('/projects')
      projects.value = response.data
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
      const response = await api.get('/projects/featured')
      featuredProjects.value = response.data
    } catch (err) {
      console.error('Error fetching featured projects:', err)
      error.value = 'Failed to load featured projects'
    } finally {
      isLoading.value = false
    }
  }
  async function fetchProjectById(id: string) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/projects/${id}`)
      return response.data
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
    fetchProjectById
  }
})
