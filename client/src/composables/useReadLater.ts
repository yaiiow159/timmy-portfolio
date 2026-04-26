import { ref, watch } from 'vue'

const STORAGE_KEY = 'timmy-read-later-post-ids'

function loadIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

/** 全站單例，多處 BlogCard / Blog 篩選共用同一份 id 清單 */
const ids = ref<string[]>(loadIds())

if (typeof window !== 'undefined') {
  window.addEventListener('storage', () => {
    ids.value = loadIds()
  })
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.value))
  } catch {
    /* 隱私模式或額度滿 */
  }
}

watch(ids, persist, { deep: true })

export function useReadLater() {
  function toggle(postId: string) {
    const i = ids.value.indexOf(postId)
    if (i === -1) {
      ids.value = [...ids.value, postId]
    } else {
      ids.value = ids.value.filter((x) => x !== postId)
    }
  }

  function has(postId: string) {
    return ids.value.includes(postId)
  }

  return { ids, toggle, has }
}
