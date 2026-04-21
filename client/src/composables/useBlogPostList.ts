import { useBlogStore } from '@/store/blogStore'
import type { PaginationParams } from '@/services/blogService'

/**
 * Single entry for loading blog post lists with server-side slim payload (`mode=list`).
 */
export function useBlogPostList() {
  const blogStore = useBlogStore()

  function loadList(params: Omit<PaginationParams, 'mode'>) {
    return blogStore.fetchPosts({ ...params, mode: 'list' })
  }

  return { blogStore, loadList }
}
