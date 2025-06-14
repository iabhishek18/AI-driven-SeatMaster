"use client"

import type React from "react"

// Adapted from: https://github.com/shadcn-ui/ui/blob/main/apps/www/hooks/use-toast.ts
import { useState, useCallback } from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type Toast = ToastProps & {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  dismiss: () => void
}

type UseToastOptions = {
  duration?: number
}

export function useToast({ duration = 5000 }: UseToastOptions = {}) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((toastId: string) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== toastId))
  }, [])

  const toast = useCallback(
    ({ id = genId(), title, description, variant, action }: ToastProps) => {
      // Create the new toast object
      const newToast = {
        id,
        title,
        description,
        variant,
        action,
        dismiss: () => dismiss(id),
      }

      // Update the toasts state
      setToasts((toasts) => {
        return [newToast, ...toasts].slice(0, TOAST_LIMIT)
      })

      // Set up the auto-dismiss timer
      if (duration) {
        setTimeout(() => {
          dismiss(id)
        }, duration)
      }

      return {
        id,
        dismiss: () => dismiss(id),
        update: (props: ToastProps) => setToasts((toasts) => toasts.map((t) => (t.id === id ? { ...t, ...props } : t))),
      }
    },
    [dismiss, duration],
  )

  return {
    toast,
    toasts,
    dismiss,
  }
}
