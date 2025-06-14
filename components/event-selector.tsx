"use client"

import { motion } from "framer-motion"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Star, ArrowRight } from "lucide-react"
import type { Event } from "@/types/booking"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import PerspectiveCard from "./perspective-card"
import { childVariants, staggerChildrenVariants } from "@/lib/animation-variants"

interface EventSelectorProps {
  events: Event[]
  onSelectEvent: (event: Event) => void
  standalone?: boolean
  returnPath?: string
}

export default function EventSelector({
  events,
  onSelectEvent,
  standalone = false,
  returnPath = "/",
}: EventSelectorProps) {
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null)
  const router = useRouter()

  // Change the handleSelectEvent function to not require the event parameter
  const handleSelectEvent = useCallback(
    (event: Event) => {
      if (standalone) {
        // Store the event in sessionStorage for the destination page
        sessionStorage.setItem("selectedEvent", JSON.stringify(event))
        // Navigate to the booking page
        router.push("/booking")
      } else {
        // Use the provided callback
        onSelectEvent(event)
      }
    },
    [onSelectEvent, router, standalone],
  )

  return (
    <div>
      <motion.h2
        className="text-xl font-semibold mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Select an Event
      </motion.h2>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={staggerChildrenVariants}
        initial="initial"
        animate="animate"
      >
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            variants={childVariants}
            className="h-full perspective-container"
            whileHover={{ z: 20 }}
          >
            <PerspectiveCard
              className={`cursor-pointer overflow-hidden border-2 h-full flex flex-col ${
                hoveredEventId === event.id ? "border-primary" : "border-transparent"
              }`}
              onClick={() => handleSelectEvent(event)}
              intensity={5}
            >
              <div className="relative h-48 overflow-hidden">
                <motion.img
                  src={event.image || "/placeholder.svg"}
                  alt={event.name}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1 }}
                  animate={{
                    scale: hoveredEventId === event.id ? 1.1 : 1,
                    transition: { duration: 0.5 },
                  }}
                  onError={(e) => {
                    e.currentTarget.src = `/placeholder.svg?height=400&width=600&query=${event.type}%20event`
                  }}
                  onMouseEnter={() => setHoveredEventId(event.id)}
                  onMouseLeave={() => setHoveredEventId(null)}
                />
                <motion.div
                  className="absolute top-2 right-2 bg-primary/90 text-white text-xs px-2 py-1 rounded-full"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </motion.div>
                <motion.div
                  className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  <span>4.8</span>
                </motion.div>
              </div>
              <CardContent className="p-4 flex flex-col flex-grow card-3d-content">
                <motion.h3
                  className="text-lg font-semibold mb-2 card-3d-element"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  {event.name}
                </motion.h3>
                <motion.div
                  className="space-y-2 text-sm text-muted-foreground flex-grow"
                  variants={staggerChildrenVariants}
                  initial="initial"
                  animate="animate"
                >
                  <motion.div className="flex items-center" variants={childVariants}>
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{event.date}</span>
                  </motion.div>
                  <motion.div className="flex items-center" variants={childVariants}>
                    <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{event.time}</span>
                  </motion.div>
                  <motion.div className="flex items-center" variants={childVariants}>
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="line-clamp-1">{event.venue}</span>
                  </motion.div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="mt-4"
                >
                  <Button
                    className="w-full group button-3d"
                    onClick={(e) => handleSelectEvent(event, e)}
                    aria-label={`Select ${event.name}`}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="mr-1">Select</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </CardContent>
            </PerspectiveCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
