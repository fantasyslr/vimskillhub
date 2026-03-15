export interface Profile {
  id: string
  email: string
  display_name: string
  avatar_url: string | null
  bio: string | null
  created_at: string
}

export interface Skill {
  id: string
  author_id: string
  title: string
  description: string
  long_description: string | null
  category: string
  tags: string[]
  github_url: string | null
  file_url: string | null
  file_name: string | null
  version: string
  stars_count: number
  downloads_count: number
  avg_rating: number
  created_at: string
  updated_at: string
  // joined
  author?: Profile
}

export interface Comment {
  id: string
  skill_id: string
  user_id: string
  content: string
  created_at: string
  // joined
  user?: Profile
}

export interface Rating {
  id: string
  skill_id: string
  user_id: string
  score: number
  created_at: string
}

export interface Star {
  id: string
  skill_id: string
  user_id: string
  created_at: string
}

export interface Download {
  id: string
  skill_id: string
  user_id: string | null
  downloaded_at: string
}

export type SkillCategory =
  | 'automation'
  | 'integration'
  | 'analytics'
  | 'ui-component'
  | 'data-processing'
  | 'workflow'
  | 'utility'
  | 'other'

export const CATEGORIES: { value: SkillCategory; label: string }[] = [
  { value: 'automation', label: 'Automation' },
  { value: 'integration', label: 'Integration' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'ui-component', label: 'UI Component' },
  { value: 'data-processing', label: 'Data Processing' },
  { value: 'workflow', label: 'Workflow' },
  { value: 'utility', label: 'Utility' },
  { value: 'other', label: 'Other' },
]

export type SortOption = 'newest' | 'most-stars' | 'most-downloads' | 'highest-rated'
