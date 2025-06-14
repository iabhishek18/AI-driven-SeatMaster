"use client"

import { useState } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import SignOutDialog from "@/components/sign-out-dialog"

interface LogoutButtonProps extends Omit<ButtonProps, "onClick"> {
  showIcon?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export default function LogoutButton({
  showIcon = true,
  variant = "default",
  size = "default",
  className = "",
  ...props
}: LogoutButtonProps) {
  const { logout } = useAuth()
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false)

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`${variant === "default" ? "bg-red-500 hover:bg-red-600" : ""} ${className}`}
        onClick={() => setIsSignOutDialogOpen(true)}
        {...props}
      >
        {showIcon && <LogOut className={`${size !== "icon" ? "mr-2" : ""} h-4 w-4`} />}
        {size !== "icon" && "Sign Out"}
      </Button>

      <SignOutDialog
        isOpen={isSignOutDialogOpen}
        onClose={() => setIsSignOutDialogOpen(false)}
        onConfirm={() => {
          logout()
          setIsSignOutDialogOpen(false)
        }}
      />
    </>
  )
}
