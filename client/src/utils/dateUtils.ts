export const formatDate = (date: string | Date): string => {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  
  // 如果時間差小於 1 分鐘
  if (diff < 60000) {
    return '剛剛'
  }
  
  // 如果時間差小於 1 小時
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes} 分鐘前`
  }
  
  // 如果時間差小於 24 小時
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours} 小時前`
  }
  
  // 如果時間差小於 7 天
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000)
    return `${days} 天前`
  }
  
  // 否則返回完整日期
  return d.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
} 