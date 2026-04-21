import type { BlogPost } from '@/store/blogStore'

/** Estimated reading time in minutes (list items may omit full `content`). */
export function estimateReadMinutes(post: BlogPost): number {
  if (post.content && post.content.length > 0) {
    return Math.max(1, Math.ceil(post.content.length / 1000))
  }
  const base = post.excerpt?.length ?? 0
  return Math.max(1, Math.ceil(base / 400))
}
