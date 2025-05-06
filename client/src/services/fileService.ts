import api from './api'
import { useActivityStore } from '@/store/activityStore'
import { useAuthStore } from '@/store/authStore'

export interface CloudinaryUploadResponse {
  fileName: string;
  filePath: string;
  publicId: string;
  secure_url?: string;
  format?: string;
  resource_type?: string;
}

export const fileService = {
  async uploadFile(file: File, token: string): Promise<CloudinaryUploadResponse> {
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
  
  async deleteFile(publicId: string, token: string) {
    await api.delete(`/uploads/${encodeURIComponent(publicId)}`, {
      headers: {
        'x-auth-token': token
      }
    })
  },
  
  getCloudinaryUrl(publicId: string, options = {}): string {
    const defaultOptions = {
      quality: 'auto',
      fetch_format: 'auto'
    }
    
    const mergedOptions = { ...defaultOptions, ...options }
    const transformations = Object.entries(mergedOptions)
      .map(([key, value]) => `${key}_${value}`)
      .join(',')
    
    return `https://res.cloudinary.com/dn4rfjyva/image/upload/${transformations}/${publicId}`
  },
  
  getImageThumbnail(publicId: string, width = 200, height = 200): string {
    return this.getCloudinaryUrl(publicId, {
      width,
      height,
      crop: 'fill',
      gravity: 'auto'
    })
  },
  
  getOptimizedImage(publicId: string, maxWidth = 1200): string {
    return this.getCloudinaryUrl(publicId, {
      width: maxWidth,
      crop: 'limit'
    })
  }
}
