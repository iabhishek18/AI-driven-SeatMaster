"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Event } from "@/types/booking"
import { useNotification } from "@/context/notification-context"

export interface Booking {
  id: string
  eventName: string
  date: string
  time: string
  venue: string
  seats: string[]
  type: string
  image?: string
  status?: "upcoming" | "past" | "cancelled"
  createdAt: number // timestamp
  isNew?: boolean // Flag to track new bookings
}

interface BookingContextType {
  upcomingBookings: Booking[]
  pastBookings: Booking[]
  addBooking: (event: Event, seats: string[]) => void
  cancelBooking: (bookingId: string) => void
  getBookingById: (bookingId: string) => Booking | undefined
  clearNewBookingStatus: (bookingId: string) => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const { notify } = useNotification()
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([])
  const [pastBookings, setPastBookings] = useState<Booking[]>([])

  // Load bookings from localStorage on mount
  useEffect(() => {
    const loadBookings = () => {
      try {
        const storedUpcomingBookings = localStorage.getItem("upcomingBookings")
        const storedPastBookings = localStorage.getItem("pastBookings")

        if (storedUpcomingBookings) {
          setUpcomingBookings(JSON.parse(storedUpcomingBookings))
        } else {
          // Set default upcoming bookings if none exist
          const defaultUpcomingBookings = [
            {
              id: "booking-1",
              eventName: "Avengers: Endgame",
              date: "June 15, 2024",
              time: "7:30 PM",
              venue: "AMC Theaters",
              seats: ["A3", "A4"],
              type: "cinema",
              status: "upcoming",
              createdAt: Date.now() - 86400000, // 1 day ago
              image:
                "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
            },
            {
              id: "booking-2",
              eventName: "Express Train to Boston",
              date: "July 22, 2024",
              time: "10:00 AM",
              venue: "Grand Central Station",
              seats: ["1-2", "1-3"],
              type: "train",
              status: "upcoming",
              createdAt: Date.now() - 172800000, // 2 days ago
              image:
                "https://images.unsplash.com/photo-1474487548417-781cb71495f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1684&q=80",
            },
          ]
          setUpcomingBookings(defaultUpcomingBookings)
          localStorage.setItem("upcomingBookings", JSON.stringify(defaultUpcomingBookings))
        }

        if (storedPastBookings) {
          setPastBookings(JSON.parse(storedPastBookings))
        } else {
          // Set default past bookings if none exist
          const defaultPastBookings = [
            {
              id: "booking-3",
              eventName: "Taylor Swift: The Eras Tour",
              date: "April 5, 2024",
              time: "6:00 PM",
              venue: "Madison Square Garden",
              seats: ["C5", "C6", "C7"],
              type: "general",
              status: "past",
              createdAt: Date.now() - 2592000000, // 30 days ago
              image:
                "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
            },
          ]
          setPastBookings(defaultPastBookings)
          localStorage.setItem("pastBookings", JSON.stringify(defaultPastBookings))
        }
      } catch (error) {
        console.error("Error loading bookings:", error)
      }
    }

    loadBookings()
  }, [])

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("upcomingBookings", JSON.stringify(upcomingBookings))
  }, [upcomingBookings])

  useEffect(() => {
    localStorage.setItem("pastBookings", JSON.stringify(pastBookings))
  }, [pastBookings])

  // Add a new booking
  const addBooking = useCallback(
    (event: Event, seats: string[]) => {
      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        eventName: event.name,
        date: event.date,
        time: event.time,
        venue: event.venue,
        seats: seats,
        type: event.type,
        image: event.image,
        status: "upcoming",
        createdAt: Date.now(),
        isNew: true, // Mark as new
      }

      // Add to the beginning of the array to show newest bookings first
      setUpcomingBookings((prev) => {
        const updatedBookings = [newBooking, ...prev]

        // Immediately update localStorage for persistence
        localStorage.setItem("upcomingBookings", JSON.stringify(updatedBookings))

        return updatedBookings
      })

      // Notify about the new booking
      notify(`Booking for ${event.name} has been added to your bookings`, "success")

      // Log for debugging
      console.log("New booking added:", newBooking)

      // Clear the "new" status after 10 seconds
      setTimeout(() => {
        clearNewBookingStatus(newBooking.id)
      }, 10000)

      return newBooking // Return the new booking for immediate use
    },
    [notify],
  )

  // Clear the "new" status of a booking
  const clearNewBookingStatus = useCallback((bookingId: string) => {
    setUpcomingBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              isNew: false,
            }
          : booking,
      ),
    )
  }, [])

  // Cancel a booking
  const cancelBooking = useCallback(
    (bookingId: string) => {
      const booking = upcomingBookings.find((b) => b.id === bookingId)
      if (!booking) return

      // Remove from upcoming bookings
      setUpcomingBookings((prev) => prev.filter((b) => b.id !== bookingId))

      // Add to past bookings with cancelled status
      const cancelledBooking = {
        ...booking,
        status: "cancelled" as const,
      }
      setPastBookings((prev) => [cancelledBooking, ...prev])

      notify(`Your booking for ${booking.eventName} has been cancelled`, "success")
    },
    [upcomingBookings, notify],
  )

  // Get a booking by ID
  const getBookingById = useCallback(
    (bookingId: string) => {
      return [...upcomingBookings, ...pastBookings].find((b) => b.id === bookingId)
    },
    [upcomingBookings, pastBookings],
  )

  return (
    <BookingContext.Provider
      value={{
        upcomingBookings,
        pastBookings,
        addBooking,
        cancelBooking,
        getBookingById,
        clearNewBookingStatus,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBookings() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error("useBookings must be used within a BookingProvider")
  }
  return context
}
