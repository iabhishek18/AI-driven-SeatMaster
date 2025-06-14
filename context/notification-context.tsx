"use client"

import type React from "react"
import { createContext, useContext, useCallback, useMemo } from "react"
import { useToast } from "@/hooks/use-toast"

type NotificationType = "success" | "error" | "info" | "warning"

interface NotificationContextType {
  notify: (message: string, type?: NotificationType, title?: string) => void
  confirmAction: (
    title: string,
    message: string,
    onConfirm: () => void,
    options?: {
      confirmText?: string
      cancelText?: string
      variant?: "default" | "destructive"
    },
  ) => any
}

// Move this function outside the component to avoid recreating it on every render
const getDefaultTitle = (type: NotificationType) => {
  switch (type) {
    case "success":
      return "Success"
    case "error":
      return "Error"
    case "warning":
      return "Warning"
    case "info":
    default:
      return "Information"
  }
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()

  // Use useCallback to prevent unnecessary re-renders and ensure the function
  // reference remains stable between renders
  const notify = useCallback(
    (message: string, type: NotificationType = "info", title?: string) => {
      const variant = type === "error" ? "destructive" : "default"

      // Schedule the toast call to happen after the current render cycle
      setTimeout(() => {
        toast({
          title: title || getDefaultTitle(type),
          description: message,
          variant,
        })
      }, 0)
    },
    [toast],
  )

  // Add a new function to show confirmation dialogs
  const confirmAction = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      options?: {
        confirmText?: string
        cancelText?: string
        variant?: "default" | "destructive"
      },
    ) => {
      // We'll implement this in the UI components that need confirmation
      // This is just a placeholder for the API
      return { title, message, onConfirm, options }
    },
    [],
  )

  // Use useMemo to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({ notify, confirmAction }), [notify, confirmAction])

  return <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}
