"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, ArrowRight, Ticket } from "lucide-react"
import type { Event } from "@/types/booking"
import confetti from "canvas-confetti"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { buttonHoverVariants, floatingAnimation } from "@/lib/animation-variants"
import { useBookings } from "@/context/booking-context"
import { useNotification } from "@/context/notification-context"

interface SuccessMessageProps {
  event: Event | null
  onStartNewBooking: () => void
  selectedSeats?: { row: string; number: string }[]
}

export default function SuccessMessage({ event, onStartNewBooking, selectedSeats = [] }: SuccessMessageProps) {
  const router = useRouter()
  const { addBooking } = useBookings()
  const { notify } = useNotification()

  // Add the booking to the context immediately when the component mounts
  useEffect(() => {
    if (event && selectedSeats && selectedSeats.length > 0) {
      const seatLabels = selectedSeats.map((seat) => `${seat.row}${seat.number}`)

      // Add booking with current timestamp to ensure it's marked as new
      const newBooking = addBooking(event, seatLabels)

      // Log for debugging
      console.log("Booking added to context:", { event, seats: seatLabels, booking: newBooking })

      // Force a refresh of localStorage to ensure data is persisted
      const currentBookings = JSON.parse(localStorage.getItem("upcomingBookings") || "[]")
      localStorage.setItem("upcomingBookings", JSON.stringify(currentBookings))
    }

    // Trigger confetti animation on component mount
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    return () => clearInterval(interval)
  }, [event, selectedSeats, addBooking])

  const handleViewAllEvents = () => {
    router.push("/events")
  }

  const handleViewMyBookings = () => {
    // Navigate to My Bookings page
    router.push("/my-bookings")

    // Notify the user that they can see their new booking
    notify("Your new booking has been added to My Bookings", "success")
  }

  return (
    <div className="text-center py-8 perspective-container">
      <motion.div
        className="flex justify-center mb-4"
        initial={{ scale: 0, rotateY: 180 }}
        animate={{ scale: 1, rotateY: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 0.8,
        }}
      >
        <motion.div variants={floatingAnimation} initial="initial" animate="animate">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </motion.div>
      </motion.div>
      <motion.h2
        className="celebration-gradient letter-spacing-wide"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Booking Successful!
      </motion.h2>
      <motion.p
        className="text-muted-foreground mb-6 accent-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Your booking for {event?.name} has been confirmed. A confirmation email has been sent to your email address.
      </motion.p>
      <motion.div
        className="max-w-md mx-auto bg-muted p-4 rounded-lg mb-6 perspective-container"
        initial={{ opacity: 0, y: 20, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        whileHover={{
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
          y: -5,
          transition: { duration: 0.2 },
        }}
      >
        <motion.div
          className="flex items-center justify-center mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          <p className="font-medium subtitle-gradient">Event Details</p>
        </motion.div>
        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          {event?.date} at {event?.time}
          <br />
          {event?.venue}
          <br />
          Seats: {selectedSeats.map((seat) => `${seat.row}${seat.number}`).join(", ")}
          <br />
          Please arrive 30 minutes before the event starts. Your e-tickets will be sent to your email shortly.
        </motion.p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.3 }}
        className="flex flex-col sm:flex-row justify-center gap-4"
      >
        <motion.div whileHover="hover" whileTap="tap" initial="initial">
          <Button onClick={onStartNewBooking} className="button-3d" variants={buttonHoverVariants}>
            Book Another Event
          </Button>
        </motion.div>
        <motion.div whileHover="hover" whileTap="tap" initial="initial">
          <Button
            variant="outline"
            onClick={handleViewAllEvents}
            className="group shimmer"
            variants={buttonHoverVariants}
          >
            View All Events
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
        <motion.div whileHover="hover" whileTap="tap" initial="initial">
          <Button onClick={handleViewMyBookings} className="pulse group" variants={buttonHoverVariants}>
            <Ticket className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            View My Bookings
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
