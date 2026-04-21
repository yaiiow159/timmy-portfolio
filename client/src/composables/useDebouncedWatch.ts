import { watch, onUnmounted, type Ref } from 'vue'

/**
 * Run a callback after `ms` quiet time when `source` changes.
 * Returns a disposer for tests; also registers onUnmounted cleanup.
 */
export function useDebouncedWatch<T>(
  source: Ref<T>,
  cb: (value: T) => void,
  ms: number
): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null

  const stop = watch(source, (value) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => cb(value), ms)
  })

  function dispose() {
    if (timer) clearTimeout(timer)
    timer = null
    stop()
  }

  onUnmounted(dispose)
  return dispose
}
