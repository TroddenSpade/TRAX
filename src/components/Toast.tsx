import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, X } from 'lucide-react'

export type ToastState = {
  message: string
  tone: 'success' | 'error'
} | null

export function useToast() {
  const [toast, setToast] = useState<ToastState>(null)
  const timer = useRef<number | null>(null)

  const dismiss = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = null
    setToast(null)
  }, [])

  const showToast = useCallback(
    (message: string, tone: 'success' | 'error' = 'success') => {
      if (timer.current) window.clearTimeout(timer.current)
      setToast({ message, tone })
      timer.current = window.setTimeout(() => {
        setToast(null)
        timer.current = null
      }, 4_200)
    },
    [],
  )

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
    },
    [],
  )

  return { toast, showToast, dismiss }
}

export function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastState
  onDismiss: () => void
}) {
  if (!toast) return null

  return (
    <div className={`toast toast--${toast.tone}`} role="status" aria-live="polite">
      <span className="toast-icon">
        {toast.tone === 'success' ? <Check size={15} /> : <X size={15} />}
      </span>
      <span>{toast.message}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss notification">
        <X size={14} />
      </button>
    </div>
  )
}
