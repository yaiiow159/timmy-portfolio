import api, { normalizeCloudinaryDeliveryUrl } from './api'

export interface CloudinaryUploadResponse {
  fileName: string;
  filePath: string;
  publicId: string;
  secure_url?: string;
  format?: string;
  resource_type?: string;
}

export const fileService = {
  /**
   * Upload a file to the server.
   * Note: activity logging should be handled by the caller (component/store).
   */
  async uploadFile(file: File): Promise<CloudinaryUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },

  async deleteFile(publicId: string) {
    await api.delete(`/uploads/${encodeURIComponent(publicId)}`)
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

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim()
    if (!cloudName) {
      return publicId.startsWith('http') ? normalizeCloudinaryDeliveryUrl(publicId) : ''
    }
    return normalizeCloudinaryDeliveryUrl(
      `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`
    )
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
