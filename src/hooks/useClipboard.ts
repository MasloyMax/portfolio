import { useEffect, useRef, useState } from 'react'

type CopyResult = {
  status: 'idle' | 'success' | 'error'
  message: string
}

const idleResult: CopyResult = { status: 'idle', message: '' }

export function useClipboard() {
  const [result, setResult] = useState<CopyResult>(idleResult)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  async function copy(text: string, successMessage: string) {
    let nextResult: CopyResult

    try {
      await navigator.clipboard.writeText(text)
      nextResult = { status: 'success', message: successMessage }
    } catch {
      nextResult = {
        status: 'error',
        message: 'Не удалось скопировать. Скопируйте адрес вручную.',
      }
    }

    if (!mountedRef.current) return

    setResult(nextResult)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setResult(idleResult), 3500)
  }

  return { copy, status: result.status, message: result.message }
}
