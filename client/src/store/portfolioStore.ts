import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  imageUrl: string
  liveUrl?: string
  codeUrl?: string
  featured: boolean
}

export const usePortfolioStore = defineStore('portfolio', () => {
  const projects = ref<Project[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProjects() {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await axios.get('/api/projects')
      projects.value = response.data
    } catch (err) {
      console.error('Error fetching projects:', err)
      error.value = 'Failed to load projects'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProjectById(id: string) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await axios.get(`/api/projects/${id}`)
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
    isLoading,
    error,
    fetchProjects,
    fetchProjectById
  }
})
