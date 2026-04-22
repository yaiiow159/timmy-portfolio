import type { Activity } from '@/types/activity'

/** 公開站內導向（後台活動紀錄用）；專案無獨立公開頁時導向作品集。 */
export function getActivityLink(activity: Activity): string | null {
  if (!activity.targetId || !activity.targetType) return null
  switch (activity.targetType) {
    case 'post':
      return `/blog/${activity.targetId}`
    case 'project':
      return '/portfolio'
    default:
      return null
  }
}

/** 對應 IconComponent 的 type（document / code / chat；其餘為 undefined → 鈴鐺） */
export function activityIconType(type: string): 'document' | 'code' | 'chat' | undefined {
  if (type === 'post_comment') return 'chat'
  if (type.startsWith('project')) return 'code'
  if (type.startsWith('post')) return 'document'
  return undefined
}
