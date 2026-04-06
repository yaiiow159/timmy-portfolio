export type ProjectType = 'work' | 'personal'
export type VCSType = 'github' | 'gitlab' | 'bitbucket' | 'other'
export type PlatformType = 'web' | 'mobile' | 'desktop' | 'script' | 'api'

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  imageUrl?: string | string[]
  liveUrl?: string
  codeUrl?: string
  featured: boolean
  projectType: ProjectType
  vcsType: VCSType
  platformType: PlatformType
  date: string
} 