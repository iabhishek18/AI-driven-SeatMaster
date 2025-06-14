"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PerspectiveCardProps {
  children: React.ReactNode
  className?: string
  intensity?: number
  disabled?: boolean
  onClick?: () => void
}

export default function PerspectiveCard({
  children,
  className,
  intensity = 10,
  disabled = false,
  onClick,
}: PerspectiveCardProps) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !cardRef.current) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()

    // Calculate mouse position relative to card center
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX
    const mouseY = e.clientY

    // Calculate rotation based on mouse position
    const rotateY = ((mouseX - centerX) / (rect.width / 2)) * intensity
    const rotateX = -((mouseY - centerY) / (rect.height / 2)) * intensity

    setRotateX(rotateX)
    setRotateY(rotateY)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  // Reset rotation when component unmounts or disabled changes
  useEffect(() => {
    if (disabled) {
      setRotateX(0)
      setRotateY(0)
    }
  }, [disabled])

  return (
    <motion.div
      ref={cardRef}
      className={cn("perspective-card transition-transform", className)}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      }}
    >
      {children}
    </motion.div>
  )
}
