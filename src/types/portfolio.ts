export type SkillCategory = 'Все' | 'Frontend' | 'Инструменты' | 'Подход'
export type ProjectVisual = 'signal' | 'forma' | 'orbit'

export interface Project {
  id: string
  title: string
  category: string
  year: string
  description: string
  tags: string[]
  visual: ProjectVisual
  isDemo: boolean
  challenge: string
  solution: string
  details: string[]
  url?: string
  github?: string
}

export interface Experience {
  period: string
  role: string
  company: string
  description: string
  highlights: string[]
}

export interface Skill {
  name: string
  category: Exclude<SkillCategory, 'Все'>
  group: string
  detail: string
}

export interface PortfolioProfile {
  isDraft: boolean
  name: string
  initials: string
  role: string
  location?: string
  availability?: string
  headline: [string, string, string]
  introduction: string
  about: string[]
  facts: { label: string; value: string }[]
  skills: Skill[]
  projects: Project[]
  experience: Experience[]
  education: { title: string; institution: string; period: string }[]
  languages: string[]
  contacts: {
    email?: string
    telegram?: string
    github?: string
    linkedin?: string
    resume?: string
  }
}
