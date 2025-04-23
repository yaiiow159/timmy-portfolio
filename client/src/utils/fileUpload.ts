export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type)
}

export const validateFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/')
}

export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/')
}

export const createFileURL = (file: File): string => {
  return URL.createObjectURL(file)
}

export const revokeFileURL = (url: string): void => {
  URL.revokeObjectURL(url)
}
