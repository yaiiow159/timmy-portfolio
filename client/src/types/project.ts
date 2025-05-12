export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  imageUrl?: string | string[]
  liveUrl?: string
  codeUrl?: string
  featured: boolean
  date: string
} 