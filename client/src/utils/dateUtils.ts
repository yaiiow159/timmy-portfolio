export const formatDate = (date: string | Date): string => {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  
  if (diff < 60000) {
    return '剛剛'
  }
  
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes} 分鐘前`
  }
  
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours} 小時前`
  }
  
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000)
    return `${days} 天前`
  }
  
  return d.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
} 