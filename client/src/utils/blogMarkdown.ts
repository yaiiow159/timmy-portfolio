import { marked } from 'marked'
import type { Token } from 'marked'

function allocateSlug(text: string, used: Set<string>): string {
  const plain = text.replace(/<[^>]+>/g, '').trim()
  let base = plain
    .toLowerCase()
    .replace(/[\s._/\\]+/g, '-')
    .replace(/[^a-z0-9\u4e00-\u9fff-]/g, '') || 'section'
  if (base.length > 64) {
    base = base.slice(0, 64)
  }
  let id = base
  let n = 0
  while (used.has(id)) {
    n += 1
    id = `${base}-${n}`
  }
  used.add(id)
  return id
}

function walkHeadings(tokens: Token[], used: Set<string>, toc: { id: string; text: string }[]) {
  for (const t of tokens) {
    if (t.type === 'heading' && (t as { depth: number }).depth === 2) {
      const h = t as { type: 'heading'; text: string }
      const id = allocateSlug(h.text, used)
      const text = h.text.replace(/<[^>]+>/g, '')
      toc.push({ id, text })
    } else if (t.type === 'blockquote' && 'tokens' in t) {
      walkHeadings((t as { tokens: Token[] }).tokens, used, toc)
    } else if (t.type === 'list' && 'items' in t) {
      for (const item of (t as { items: { tokens: Token[] }[] }).items) {
        walkHeadings(item.tokens, used, toc)
      }
    } else if ('tokens' in t && Array.isArray((t as { tokens?: Token[] }).tokens)) {
      walkHeadings((t as { tokens: Token[] }).tokens, used, toc)
    }
  }
}

/**
 * 由 Markdown 產出 HTML 並建立 H2 目錄；H2 由後處理注入穩定 id 以配合 TOC 錨點
 */
export function renderMarkdownForBlog(markdown: string): { html: string; toc: { id: string; text: string }[] } {
  const used = new Set<string>()
  const toc: { id: string; text: string }[] = []
  const tokens = marked.lexer(markdown)
  walkHeadings(tokens as Token[], used, toc)

  let html = marked.parse(markdown) as string
  let i = 0
  html = html.replace(/<h2(\s[^>]*)?>/gi, (full, attrs: string | undefined) => {
    if (attrs?.includes('id=')) {
      return full
    }
    if (i >= toc.length) {
      return full
    }
    const id = toc[i].id
    i += 1
    return `<h2 id="${id}"${attrs || ''}>`
  })
  return { html, toc }
}
