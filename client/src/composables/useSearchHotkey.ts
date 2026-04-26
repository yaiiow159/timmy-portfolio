import { onMounted, onUnmounted, type Ref } from 'vue'

/**
 * 內容頁搜尋：按 / 聚焦搜尋框，避免在已輸入的欄位內觸發
 */
export function useSearchHotkey(inputRef: Ref<HTMLInputElement | null>) {
  function onKeyDown(e: KeyboardEvent) {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) {
      return
    }
    const el = e.target
    if (
      el instanceof HTMLInputElement ||
      el instanceof HTMLTextAreaElement ||
      (el instanceof HTMLElement && el.isContentEditable)
    ) {
      return
    }
    e.preventDefault()
    inputRef.value?.focus()
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
  })
  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
  })
}
