"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Ticket, Download, Share2 } from "lucide-react"
import QRCode from "react-qr-code"

interface ETicketModalProps {
  isOpen: boolean
  onClose: () => void
  booking: {
    id: string
    eventName: string
    date: string
    time: string
    venue: string
    seats: string[]
    type: string
    image?: string
  }
}

export default function ETicketModal({ isOpen, onClose, booking }: ETicketModalProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = () => {
    setIsDownloading(true)
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false)
      // In a real app, this would trigger a PDF download
      alert("Ticket downloaded successfully!")
    }, 1500)
  }

  const handleShare = () => {
    // In a real app, this would open a share dialog
    if (navigator.share) {
      navigator
        .share({
          title: `E-Ticket for ${booking.eventName}`,
          text: `My ticket for ${booking.eventName} on ${booking.date} at ${booking.time}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error))
    } else {
      alert("Sharing is not supported on this browser")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center">E-Ticket</DialogTitle>
          <DialogDescription className="text-center">Your electronic ticket for {booking.eventName}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div className="bg-primary/5 rounded-lg overflow-hidden border border-primary/10">
            <div className="relative h-32 overflow-hidden">
              <img
                src={booking.image || "/placeholder.svg"}
                alt={booking.eventName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
                {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">{booking.eventName}</h3>

              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <span>{booking.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <span>{booking.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <span>{booking.venue}</span>
                </div>
                <div className="flex items-center">
                  <Ticket className="h-4 w-4 mr-2 text-primary" />
                  <span>Seats: {booking.seats.join(", ")}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <motion.div
              className="p-4 bg-white rounded-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <QRCode
                value={`BOOKING:${booking.id}|EVENT:${booking.eventName}|DATE:${booking.date}|SEATS:${booking.seats.join(",")}`}
                size={150}
                level="M"
              />
            </motion.div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Booking ID: {booking.id}</p>
            <p>Please present this QR code at the venue entrance</p>
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={handleDownload} className="gap-2" isLoading={isDownloading}>
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
