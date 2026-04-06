import { marked } from 'marked'
import hljs from 'highlight.js'

marked.setOptions({
  highlight: function(code: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  } as any,
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false
})

export const markdownToHtml = (markdown: string): string => {
  return marked.parse(markdown) as string
}

export const createExcerpt = (markdown: string, length: number = 150): string => {
  const plainText = markdown
    .replace(/#+\s+(.*)/g, '$1') // Remove headings
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links but keep text
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
  
  if (plainText.length <= length) {
    return plainText
  }
  
  return plainText.substring(0, length) + '...'
}
