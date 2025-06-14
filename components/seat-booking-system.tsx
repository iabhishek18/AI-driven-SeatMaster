"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventSelector from "./event-selector"
import SeatMap from "./seat-map"
import BookingSummary from "./booking-summary"
import CheckoutForm from "./checkout-form"
import SuccessMessage from "./success-message"
import EventTypeFilter from "./event-type-filter"
import type { SeatType, BookingStep, Event, EventType } from "@/types/booking"
import { initialEvents } from "@/data/initial-data"
import { generateSeatsForEventType } from "@/lib/seat-generator"
import { useNotification } from "@/context/notification-context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { pageTransitionVariants, buttonHoverVariants } from "@/lib/animation-variants"

export default function SeatBookingSystem() {
  const { notify } = useNotification()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const [events, setEvents] = useState<Event[]>(initialEvents.slice(0, 6)) // Show only first 6 events on homepage
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [seats, setSeats] = useState<SeatType[]>([])
  const [selectedSeats, setSelectedSeats] = useState<SeatType[]>([])
  const [currentStep, setCurrentStep] = useState<BookingStep>("select-event")
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [bookingComplete, setBookingComplete] = useState(false)
  const [selectedEventType, setSelectedEventType] = useState<EventType | "all">("all")
  const [isProcessing, setIsProcessing] = useState(false)

  // Check for pending booking on component mount
  useEffect(() => {
    const pendingBooking = sessionStorage.getItem("pendingBooking")
    if (pendingBooking) {
      try {
        const { event, seats } = JSON.parse(pendingBooking)
        if (event && seats) {
          setSelectedEvent(event)
          const generatedSeats = generateSeatsForEventType(event.type)
          setSeats(generatedSeats)
          // We can't directly restore selected seats, but we can notify the user
          notify("Your previous booking session has been restored", "info")
          setCurrentStep("select-seats")
        }
        sessionStorage.removeItem("pendingBooking")
      } catch (error) {
        console.error("Error parsing pending booking:", error)
      }
    }
  }, [notify])

  // Filter events when event type changes
  useEffect(() => {
    if (selectedEventType === "all") {
      setFilteredEvents(events)
    } else {
      setFilteredEvents(events.filter((event) => event.type === selectedEventType))
    }
  }, [selectedEventType, events])

  const handleEventTypeChange = useCallback(
    (type: EventType | "all") => {
      setSelectedEventType(type)
      notify(`Showing ${type === "all" ? "all events" : type + " events"}`, "info")
    },
    [notify],
  )

  const handleEventSelect = useCallback(
    (event: Event) => {
      try {
        setSelectedEvent(event)
        // Generate seats based on event type
        const generatedSeats = generateSeatsForEventType(event.type)
        setSeats(generatedSeats)
        setSelectedSeats([])
        setCurrentStep("select-seats")
        notify(`You've selected "${event.name}"`, "success")
      } catch (error) {
        console.error("Error selecting event:", error)
        notify("There was an error selecting this event. Please try again.", "error")
      }
    },
    [notify],
  )

  const handleViewAllEvents = useCallback(() => {
    router.push("/events")
  }, [router])

  const handleSeatSelect = useCallback(
    (seatId: string) => {
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
    },
    [seats, notify],
  )

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0)
  }

  const handleProceedToCheckout = useCallback(() => {
    if (!isAuthenticated) {
      notify("Please log in to continue with your booking", "warning")
      // Store current state to return after login
      sessionStorage.setItem(
        "pendingBooking",
        JSON.stringify({
          event: selectedEvent,
          seats: selectedSeats,
          returnTo: "/",
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
  }, [isAuthenticated, selectedSeats, router, notify, selectedEvent])

  const handleBackToEvents = useCallback(() => {
    setCurrentStep("select-event")
    setSelectedEvent(null)
    setSelectedSeats([])
    notify("Returned to event selection", "info")
  }, [notify])

  const handleBackToSeats = useCallback(() => {
    setCurrentStep("select-seats")
    notify("Returned to seat selection", "info")
  }, [notify])

  const handleCustomerInfoChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const handleSubmitBooking = useCallback(
    async (e: React.FormEvent) => {
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

        // Clear selected seats
        setSelectedSeats([])

        // Show success message
        setBookingComplete(true)
        setCurrentStep("success")

        notify("Your booking has been confirmed!", "success", "Booking Successful")
      } catch (error) {
        notify("There was an error processing your booking. Please try again.", "error")
      } finally {
        setIsProcessing(false)
      }
    },
    [customerInfo, selectedEvent, selectedSeats, seats, notify],
  )

  const handleStartNewBooking = useCallback(() => {
    setSelectedEvent(null)
    setSelectedSeats([])
    setCustomerInfo({
      name: "",
      email: "",
      phone: "",
    })
    setBookingComplete(false)
    setCurrentStep("select-event")
    notify("Starting a new booking", "info")
  }, [notify])

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="tagline-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <motion.h1
          className="text-xl md:text-2xl lg:text-3xl font-decorative tracking-wide enhanced-gold-gradient"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Experience seamless booking for all your entertainment needs
        </motion.h1>
      </motion.div>

      <motion.div
        className="max-w-5xl mx-auto perspective-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-2 border-primary/10 shadow-lg">
          <CardContent className="p-6">
            <Tabs
              value={currentStep}
              className="w-full"
              onValueChange={(value) => setCurrentStep(value as BookingStep)}
            >
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="select-event" disabled={currentStep !== "select-event" && !bookingComplete}>
                  Select Event
                </TabsTrigger>
                <TabsTrigger
                  value="select-seats"
                  disabled={!selectedEvent || currentStep === "select-event" || currentStep === "success"}
                >
                  Choose Seats
                </TabsTrigger>
                <TabsTrigger
                  value="checkout"
                  disabled={selectedSeats.length === 0 || currentStep === "select-event" || currentStep === "success"}
                >
                  Checkout
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                {currentStep === "select-event" && (
                  <motion.div
                    key="select-event"
                    variants={pageTransitionVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <TabsContent value="select-event" className="mt-0">
                      <EventTypeFilter selectedType={selectedEventType} onTypeChange={handleEventTypeChange} />
                      <EventSelector events={filteredEvents} onSelectEvent={handleEventSelect} />

                      <div className="mt-8 text-center">
                        <motion.div whileHover="hover" whileTap="tap" initial="initial">
                          <Button
                            onClick={handleViewAllEvents}
                            variant="outline"
                            size="lg"
                            className="group shimmer"
                            variants={buttonHoverVariants}
                            aria-label="View all events"
                          >
                            View All Events
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </motion.div>
                      </div>
                    </TabsContent>
                  </motion.div>
                )}

                {currentStep === "select-seats" && (
                  <motion.div
                    key="select-seats"
                    variants={pageTransitionVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <TabsContent value="select-seats" className="mt-0">
                      <div className="mb-4">
                        <motion.div whileHover="hover" whileTap="tap" initial="initial">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBackToEvents}
                            className="group"
                            variants={buttonHoverVariants}
                            aria-label="Back to events"
                          >
                            <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                            Back to Events
                          </Button>
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                          {selectedEvent && (
                            <motion.div
                              className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/10"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              whileHover={{
                                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                                y: -2,
                              }}
                            >
                              <motion.h3
                                className="subtitle-gradient mb-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.1 }}
                              >
                                {selectedEvent.name}
                              </motion.h3>
                              <motion.p
                                className="text-muted-foreground"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                {selectedEvent.date} at {selectedEvent.time}
                              </motion.p>
                              <motion.p
                                className="text-muted-foreground"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                {selectedEvent.venue}
                              </motion.p>
                              <motion.div
                                className="text-sm mt-2 inline-block bg-primary/10 text-primary px-2 py-1 rounded"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, type: "spring" }}
                              >
                                {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                              </motion.div>
                            </motion.div>
                          )}

                          <SeatMap
                            seats={seats}
                            onSeatSelect={handleSeatSelect}
                            selectedSeats={selectedSeats}
                            eventType={selectedEvent?.type || "general"}
                          />
                        </div>

                        <div>
                          <BookingSummary
                            selectedSeats={selectedSeats}
                            total={calculateTotal()}
                            onProceedToCheckout={handleProceedToCheckout}
                            eventType={selectedEvent?.type || "general"}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </motion.div>
                )}

                {currentStep === "checkout" && (
                  <motion.div
                    key="checkout"
                    variants={pageTransitionVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <TabsContent value="checkout" className="mt-0">
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
                            eventType={selectedEvent?.type || "general"}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </motion.div>
                )}

                {currentStep === "success" && (
                  <motion.div
                    key="success"
                    variants={pageTransitionVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <TabsContent value="success" className="mt-0">
                      <SuccessMessage
                        event={selectedEvent}
                        onStartNewBooking={handleStartNewBooking}
                        selectedSeats={selectedSeats.map((seat) => ({ row: seat.row, number: seat.number }))}
                      />
                    </TabsContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
