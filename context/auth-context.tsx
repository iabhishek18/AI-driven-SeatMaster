"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { User, AuthState } from "@/types/user"
import { useNotification } from "@/context/notification-context"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  resetPassword: (email: string) => Promise<boolean>
  updateProfile: (userData: Partial<User>) => void
}

// Mock user data
const mockUser: User = {
  id: "user-1",
  name: "John Doe",
  email: "john.doe@example.com",
  profileImage:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, New York, NY 10001",
  preferences: {
    notifications: true,
    newsletter: false,
    seatPreferences: "Window seat",
  },
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })
  const router = useRouter()
  const pathname = usePathname()
  const { notify } = useNotification()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser)
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          console.error("Failed to parse stored user:", error)
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    }

    checkAuth()
    // This effect should only run once on component mount
  }, [])

  // Protect routes that require authentication
  useEffect(() => {
    const protectedRoutes = ["/profile", "/my-bookings"]
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

    if (!authState.isLoading && !authState.isAuthenticated && isProtectedRoute) {
      // Only show notification and redirect if we're actually on a protected route
      // and not already redirecting
      notify("Please log in to access this page", "warning")
      router.push("/login")
    }
  }, [authState.isAuthenticated, authState.isLoading, pathname, router, notify])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo purposes, accept any email/password combination
        // In a real app, this would validate against a backend
        const newUser = {
          ...mockUser,
          email,
          name: email
            .split("@")[0]
            .replace(/\./g, " ")
            .replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase()),
        }

        setAuthState({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
        })
        localStorage.setItem("user", JSON.stringify(newUser))
        resolve(true)
      }, 1000)
    })
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would create a new user on the server
        const newUser: User = {
          ...mockUser,
          id: `user-${Date.now()}`,
          name,
          email,
          profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        }

        setAuthState({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
        })
        localStorage.setItem("user", JSON.stringify(newUser))
        resolve(true)
      }, 1000)
    })
  }

  const logout = () => {
    // Clear user data
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })

    // Remove from localStorage
    localStorage.removeItem("user")

    // Show notification
    notify("You have been signed out successfully", "success", "Signed Out")

    // Redirect to home page
    if (typeof window !== "undefined") {
      window.location.href = "/"
    }
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    // Simulate API call
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would trigger a password reset email
        setAuthState((prev) => ({ ...prev, isLoading: false }))
        resolve(true)
      }, 1000)
    })
  }

  const updateProfile = (userData: Partial<User>) => {
    if (!authState.user) return

    const updatedUser = {
      ...authState.user,
      ...userData,
    }

    setAuthState({
      user: updatedUser,
      isAuthenticated: true,
      isLoading: false,
    })
    localStorage.setItem("user", JSON.stringify(updatedUser))
    notify("Your profile has been updated successfully", "success")
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
