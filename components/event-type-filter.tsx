"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Bus, Film, Train, Calendar } from "lucide-react"
import type { EventType } from "@/types/booking"

interface EventTypeFilterProps {
  selectedType: EventType | "all"
  onTypeChange: (type: EventType | "all") => void
}

export default function EventTypeFilter({ selectedType, onTypeChange }: EventTypeFilterProps) {
  const eventTypes = [
    { id: "all", label: "All Events", icon: Calendar },
    { id: "cinema", label: "Cinema", icon: Film },
    { id: "train", label: "Train", icon: Train },
    { id: "bus", label: "Bus", icon: Bus },
  ]

  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-3">Event Type</h2>
      <div className="flex flex-wrap gap-2">
        {eventTypes.map((type, index) => {
          const Icon = type.icon
          const isSelected = selectedType === type.id

          return (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                variant={isSelected ? "default" : "outline"}
                className={`flex items-center gap-2 ${isSelected ? "bg-primary" : ""}`}
                onClick={() => onTypeChange(type.id as EventType | "all")}
              >
                <Icon className="h-4 w-4" />
                {type.label}
              </Button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
