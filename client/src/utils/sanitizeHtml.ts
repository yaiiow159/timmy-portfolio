import DOMPurify from 'dompurify'

/**
 * Sanitize HTML before binding with v-html (blog body, rich previews).
 * Strips scripts and unsafe attributes while keeping typical markdown/code markup.
 */
export function sanitizeBlogHtml(dirty: string): string {
  if (!dirty) return ''
  return DOMPurify.sanitize(dirty, {
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target', 'rel', 'id'],
  })
}
