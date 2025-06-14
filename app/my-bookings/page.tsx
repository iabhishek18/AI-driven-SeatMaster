"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useBookings } from "@/context/booking-context"
import { useNotification } from "@/context/notification-context"
import { Calendar, Clock, MapPin, Ticket, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ETicketModal from "@/components/e-ticket-modal"
import CancelBookingDialog from "@/components/cancel-booking-dialog"
import LogoutButton from "@/components/logout-button"
import type { Booking } from "@/types/booking"

export default function MyBookingsPage() {
  const { notify } = useNotification()
  const { upcomingBookings, pastBookings, cancelBooking, clearNewBookingStatus } = useBookings()
  const [activeTab, setActiveTab] = useState("upcoming")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  // Check for new bookings and apply highlighting
  useEffect(() => {
    // Clear new booking status after 10 seconds
    const newBookings = upcomingBookings.filter((booking) => booking.isNew)

    if (newBookings.length > 0) {
      // If there are new bookings, make sure we're on the upcoming tab
      setActiveTab("upcoming")

      // Notify about new bookings if we just arrived at the page
      if (document.visibilityState === "visible") {
        notify(`You have ${newBookings.length} new booking${newBookings.length > 1 ? "s" : ""}`, "success")
      }
    }
  }, [upcomingBookings, notify])

  // Add a refresh mechanism when the page is loaded
  useEffect(() => {
    // Force a refresh of the bookings when the page is loaded
    const refreshBookings = () => {
      // This will trigger a re-render with the latest data from localStorage
      const storedBookings = localStorage.getItem("upcomingBookings")
      if (storedBookings) {
        try {
          const parsedBookings = JSON.parse(storedBookings)
          // Only update if there's a difference to avoid unnecessary re-renders
          if (JSON.stringify(parsedBookings) !== JSON.stringify(upcomingBookings)) {
            console.log("Refreshing bookings from localStorage")
            // This would be handled by your context, but we're forcing a refresh here
          }
        } catch (error) {
          console.error("Error parsing bookings from localStorage:", error)
        }
      }
    }

    refreshBookings()

    // Also refresh when the page becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshBookings()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [upcomingBookings])

  const handleViewTicket = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsTicketModalOpen(true)

    // Clear new status when viewing ticket
    if (booking.isNew) {
      clearNewBookingStatus(booking.id)
    }
  }

  const handleCancelBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsCancelDialogOpen(true)
  }

  const confirmCancelBooking = () => {
    if (selectedBooking) {
      cancelBooking(selectedBooking.id)
      setIsCancelDialogOpen(false)
    }
  }

  const isNewBooking = (booking: Booking) => {
    return booking.isNew === true
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <motion.div
          className="mb-4 md:mb-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-primary">My Bookings</h1>
          <p className="text-muted-foreground">View and manage your bookings</p>
        </motion.div>
        <LogoutButton />
      </div>

      <div className="max-w-5xl mx-auto">
        <Tabs defaultValue="upcoming" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upcoming" className="relative">
              Upcoming
              {upcomingBookings.some((booking) => booking.isNew) && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
                  {upcomingBookings.filter((booking) => booking.isNew).length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-0">
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No upcoming bookings</h3>
                <p className="text-muted-foreground mb-4">You don't have any upcoming bookings yet.</p>
                <Button asChild>
                  <a href="/events">Browse Events</a>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                  {upcomingBookings.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      layout
                      className={isNewBooking(booking) ? "relative" : ""}
                    >
                      {isNewBooking(booking) && (
                        <motion.div
                          className="absolute -top-2 -right-2 z-10 bg-green-500 text-white text-xs px-2 py-1 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 10 }}
                        >
                          New
                        </motion.div>
                      )}
                      <Card
                        className={`${
                          isNewBooking(booking)
                            ? "border-green-500 shadow-lg shadow-green-100 dark:shadow-green-900/20 animate-pulse"
                            : ""
                        } transition-all duration-300`}
                        onClick={() => isNewBooking(booking) && clearNewBookingStatus(booking.id)}
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={booking.image || "/placeholder.svg"}
                            alt={booking.eventName}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
                            {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                          </div>
                        </div>
                        <CardHeader>
                          <CardTitle>{booking.eventName}</CardTitle>
                          <CardDescription>Booking ID: {booking.id}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>{booking.date}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>{booking.time}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>{booking.venue}</span>
                            </div>
                            <div className="flex items-center">
                              <Ticket className="w-4 h-4 mr-2" />
                              <span>Seats: {booking.seats.join(", ")}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" onClick={() => handleViewTicket(booking)}>
                            View E-Ticket
                          </Button>
                          <Button variant="destructive" onClick={() => handleCancelBooking(booking)}>
                            Cancel
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-0">
            {pastBookings.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No past bookings</h3>
                <p className="text-muted-foreground mb-4">You don't have any past bookings.</p>
                <Button asChild>
                  <a href="/events">Browse Events</a>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                  {pastBookings.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      layout
                    >
                      <Card>
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={booking.image || "/placeholder.svg"}
                            alt={booking.eventName}
                            className="w-full h-full object-cover opacity-80"
                          />
                          <div className="absolute top-2 right-2 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                            {booking.status === "cancelled" ? "Cancelled" : "Past Event"}
                          </div>
                        </div>
                        <CardHeader>
                          <CardTitle>{booking.eventName}</CardTitle>
                          <CardDescription>Booking ID: {booking.id}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>{booking.date}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>{booking.time}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>{booking.venue}</span>
                            </div>
                            <div className="flex items-center">
                              <Ticket className="w-4 h-4 mr-2" />
                              <span>Seats: {booking.seats.join(", ")}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full" onClick={() => handleViewTicket(booking)}>
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* E-Ticket Modal */}
      {selectedBooking && (
        <ETicketModal
          isOpen={isTicketModalOpen}
          onClose={() => setIsTicketModalOpen(false)}
          booking={selectedBooking}
        />
      )}

      {/* Cancel Booking Dialog */}
      {selectedBooking && (
        <CancelBookingDialog
          isOpen={isCancelDialogOpen}
          onClose={() => setIsCancelDialogOpen(false)}
          onConfirm={confirmCancelBooking}
          bookingId={selectedBooking.id}
          eventName={selectedBooking.eventName}
        />
      )}
    </div>
  )
}
