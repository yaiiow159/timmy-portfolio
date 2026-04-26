import DOMPurify from 'dompurify'

/**
 * Sanitize HTML before binding with v-html (blog body, rich previews).
 * Strips scripts and unsafe attributes while keeping typical markdown/code markup.
 */
export function sanitizeBlogHtml(dirty: string): string {
  if (!dirty) {
    return ''
  }
  let clean = DOMPurify.sanitize(dirty, {
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target', 'rel', 'id'],
  })
  // 修復內文曾出現可見的「&nbsp;」：HTML 內層層轉址後之 &amp;nbsp; 或儲存舊稿帶有雙轉
  clean = clean
    .replace(/&amp;nbsp;/gi, '\u00A0')
    .replace(/&amp;#160;/g, '\u00A0')
  return clean
}
