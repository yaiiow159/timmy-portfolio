import api from './api'
import { useActivityStore } from '@/store/activityStore'
import { useAuthStore } from '@/store/authStore'

export const fileService = {
  async uploadFile(file: File, token: string) {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-auth-token': token
      }
    })
    
    const activityStore = useActivityStore()
    const authStore = useAuthStore()
    await activityStore.createActivity({
      type: 'FILE_UPLOADED',
      title: '上傳了新文件',
      description: file.name,
      userName: authStore.user?.name ?? 'Anonymous',
      targetType: 'file'
    })
    
    return response.data
  },
  
  async deleteFile(filePath: string, token: string) {
    await api.delete(`/files/${encodeURIComponent(filePath)}`, {
      headers: {
        'x-auth-token': token
      }
    })
  }
} 