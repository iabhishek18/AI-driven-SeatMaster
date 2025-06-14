"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import SeatMap from "@/components/seat-map"
import BookingSummary from "@/components/booking-summary"
import CheckoutForm from "@/components/checkout-form"
import SuccessMessage from "@/components/success-message"
import type { SeatType, Event, BookingStep } from "@/types/booking"
import { generateSeatsForEventType } from "@/lib/seat-generator"
import { useNotification } from "@/context/notification-context"
import { useAuth } from "@/context/auth-context"
import { motion, AnimatePresence } from "framer-motion"

export default function BookingPage() {
  const router = useRouter()
  const { notify } = useNotification()
  const { isAuthenticated } = useAuth()

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [seats, setSeats] = useState<SeatType[]>([])
  const [selectedSeats, setSelectedSeats] = useState<SeatType[]>([])
  const [currentStep, setCurrentStep] = useState<BookingStep>("select-seats")
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [bookingComplete, setBookingComplete] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [returnPath, setReturnPath] = useState("/events")

  // Load the selected event from sessionStorage
  useEffect(() => {
    const storedEvent = sessionStorage.getItem("selectedEvent")
    const storedReturnPath = sessionStorage.getItem("returnPath")

    if (storedEvent) {
      try {
        const event = JSON.parse(storedEvent) as Event
        setSelectedEvent(event)

        // Generate seats based on event type
        const generatedSeats = generateSeatsForEventType(event.type)
        setSeats(generatedSeats)

        // Clear the stored event to prevent reloading on refresh
        sessionStorage.removeItem("selectedEvent")
      } catch (error) {
        console.error("Error parsing stored event:", error)
        notify("There was an error loading the selected event", "error")
        router.push("/events")
      }
    } else {
      // No event selected, redirect back to events page
      router.push("/events")
    }

    if (storedReturnPath) {
      setReturnPath(storedReturnPath)
      sessionStorage.removeItem("returnPath")
    }
  }, [router, notify])

  const handleSeatSelect = (seatId: string) => {
    const seat = seats.find((s) => s.id === seatId)
    if (!seat || seat.status === "booked") return

    // Apply animation class
    const seatElement = document.getElementById(`seat-${seatId}`)
    if (seatElement) {
      seatElement.classList.add("seat-selected")
      setTimeout(() => {
        seatElement.classList.remove("seat-selected")
      }, 300)
    }

    setSeats(
      seats.map((s) =>
        s.id === seatId
          ? {
              ...s,
              status: s.status === "selected" ? "available" : "selected",
            }
          : s,
      ),
    )

    setSelectedSeats((prev) => {
      const isAlreadySelected = prev.some((s) => s.id === seatId)
      if (isAlreadySelected) {
        const updatedSeats = prev.filter((s) => s.id !== seatId)
        notify(`Seat ${seat.row}${seat.number} unselected`, "info")
        return updatedSeats
      } else {
        const seatToAdd = seats.find((s) => s.id === seatId)
        if (seatToAdd) {
          notify(`Seat ${seatToAdd.row}${seatToAdd.number} selected`, "success")
          return [...prev, seatToAdd]
        }
        return prev
      }
    })
  }

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0)
  }

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      notify("Please log in to continue with your booking", "warning")
      // Store current state to return after login
      sessionStorage.setItem(
        "pendingBooking",
        JSON.stringify({
          event: selectedEvent,
          seats: selectedSeats,
          returnTo: "/booking",
        }),
      )
      router.push("/login")
      return
    }

    if (selectedSeats.length > 0) {
      setCurrentStep("checkout")
      notify("Proceeding to checkout", "info")
    } else {
      notify("Please select at least one seat to continue", "warning")
    }
  }

  const handleBackToEvents = () => {
    router.push(returnPath)
  }

  const handleBackToSeats = () => {
    setCurrentStep("select-seats")
  }

  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      notify("Please fill in all required fields", "error")
      return
    }

    setIsProcessing(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Booking submitted:", {
        event: selectedEvent,
        seats: selectedSeats,
        customer: customerInfo,
        total: calculateTotal(),
      })

      // Update seats to booked status
      setSeats(
        seats.map((seat) => (selectedSeats.some((s) => s.id === seat.id) ? { ...seat, status: "booked" } : seat)),
      )

      // Show success message
      setBookingComplete(true)
      setCurrentStep("success")

      notify("Your booking has been confirmed!", "success", "Booking Successful")
    } catch (error) {
      notify("There was an error processing your booking. Please try again.", "error")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStartNewBooking = () => {
    router.push("/events")
  }

  if (!selectedEvent) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <div className="text-center">
          <p className="text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mr-4 group"
          onClick={handleBackToEvents}
          aria-label="Back to events"
        >
          <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Events
        </Button>
        <div>
          <motion.h1
            className="text-3xl font-bold mb-1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {selectedEvent.name}
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {selectedEvent.date} at {selectedEvent.time} • {selectedEvent.venue}
          </motion.p>
        </div>
      </div>

      <Card className="max-w-5xl mx-auto border-2 border-primary/10 shadow-lg">
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {currentStep === "select-seats" && (
              <motion.div
                key="select-seats"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <SeatMap
                      seats={seats}
                      onSeatSelect={handleSeatSelect}
                      selectedSeats={selectedSeats}
                      eventType={selectedEvent.type}
                    />
                  </div>

                  <div>
                    <BookingSummary
                      selectedSeats={selectedSeats}
                      total={calculateTotal()}
                      onProceedToCheckout={handleProceedToCheckout}
                      eventType={selectedEvent.type}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === "checkout" && (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <CheckoutForm
                      customerInfo={customerInfo}
                      onCustomerInfoChange={handleCustomerInfoChange}
                      onSubmit={handleSubmitBooking}
                      onBack={handleBackToSeats}
                      isProcessing={isProcessing}
                    />
                  </div>

                  <div>
                    <BookingSummary
                      selectedSeats={selectedSeats}
                      total={calculateTotal()}
                      showCheckoutButton={false}
                      eventType={selectedEvent.type}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <SuccessMessage
                  event={selectedEvent}
                  onStartNewBooking={handleStartNewBooking}
                  selectedSeats={selectedSeats.map((seat) => ({ row: seat.row, number: seat.number }))}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
