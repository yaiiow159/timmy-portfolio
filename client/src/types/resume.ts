export interface SkillGroup {
  title: string
  items: {
    label: string
    description: string
  }[]
}

export interface ProjectExperience {
  title: string
  bullets: string[]
}

export interface WorkExperience {
  role: string
  company: string
  date: string
  projects?: ProjectExperience[]
  bullets?: string[]
}

export interface EducationEntry {
  school: string
  degree: string
  period: string
  description: string[]
}

export interface LanguageSkill {
  name: string
  proficiency: string
  level: number
}
