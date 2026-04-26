import type { Project } from '@/types/project'

/**
 * 專案描述欄位可能帶 Rich HTML，與清單篩選、全站搜尋共用剝除方式以維持行為一致
 */
export function htmlToPlainText(html: string): string {
  return (html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getProjectDescriptionSearchPlain(description: string): string {
  return htmlToPlainText(description).toLowerCase()
}

/**
 * 與歷史行為一致：標題、純文字描述、技術陣列分別子字串比對（OR）
 */
export function projectMatchesSearchQuery(project: Project, queryLower: string): boolean {
  const s = queryLower.trim()
  if (!s) {
    return true
  }
  return (
    (project.title || '').toLowerCase().includes(s) ||
    getProjectDescriptionSearchPlain(project.description).includes(s) ||
    project.technologies.some((tech) => tech.toLowerCase().includes(s))
  )
}

/** 專案載入一次後重複查詢用，避免每次鍵入重跑剝 HTML */
export type ProjectSearchIndexRow = {
  project: Project
  titleL: string
  descL: string
  techsL: string[]
}

export function buildProjectSearchIndexRow(project: Project): ProjectSearchIndexRow {
  return {
    project,
    titleL: (project.title || '').toLowerCase(),
    descL: getProjectDescriptionSearchPlain(project.description),
    techsL: project.technologies.map((t) => t.toLowerCase())
  }
}

export function projectIndexRowMatches(row: ProjectSearchIndexRow, s: string): boolean {
  if (!s) {
    return true
  }
  return (
    row.titleL.includes(s) ||
    row.descL.includes(s) ||
    row.techsL.some((t) => t.includes(s))
  )
}

export function filterProjectsByIndex(
  index: ProjectSearchIndexRow[],
  queryLower: string,
  limit: number
): Project[] {
  const s = queryLower.trim().toLowerCase()
  if (!s) {
    return []
  }
  const out: Project[] = []
  for (const row of index) {
    if (projectIndexRowMatches(row, s)) {
      out.push(row.project)
      if (out.length >= limit) {
        break
      }
    }
  }
  return out
}
