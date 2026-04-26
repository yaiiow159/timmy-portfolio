import { ref } from 'vue'

/** 全站 Command 面板與導航列按鈕共用同一開關，避免多處重複掛 listener */
const isOpen = ref(false)

export function useGlobalSearch() {
  function open() {
    isOpen.value = true
  }
  function close() {
    isOpen.value = false
  }
  function toggle() {
    isOpen.value = !isOpen.value
  }
  return { isOpen, open, close, toggle }
}
