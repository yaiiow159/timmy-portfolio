export interface Activity {
  id: string
  type: string
  title: string
  description?: string
  userId?: string
  userName: string
  targetId?: string
  targetType?: string
  date: string
}

export interface ActivityPagination {
  total: number
  page: number
  limit: number
  pages: number
}

export interface ActivityResponse {
  activities: Activity[]
  pagination: ActivityPagination
} 