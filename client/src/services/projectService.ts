import api from './api'
import type { Project } from '@/types/project'
import { useActivityStore } from '@/store/activityStore'
import { useAuthStore } from '@/store/authStore'

export const projectService = {
  // ... existing code ...

  async createProject(project: Omit<Project, 'id'>, token: string): Promise<Project> {
    const response = await api.post('/projects', project, {
      headers: {
        'x-auth-token': token
      }
    })
    
    // 記錄活動
    const activityStore = useActivityStore()
    const authStore = useAuthStore()
    await activityStore.createActivity({
      type: 'PROJECT_ADDED',
      title: '添加了新專案',
      description: `《${project.title}》`,
      userName: authStore.user?.name || 'Anonymous',
      targetId: response.data.id,
      targetType: 'project'
    })
    
    return response.data
  }
} 