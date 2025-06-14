"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { SeatType, EventType } from "@/types/booking"
import { formatCurrency } from "@/lib/utils"
import { Ticket, CreditCard, AlertCircle } from "lucide-react"
import { staggerChildrenVariants, childVariants, buttonHoverVariants } from "@/lib/animation-variants"

interface BookingSummaryProps {
  selectedSeats: SeatType[]
  total: number
  onProceedToCheckout?: () => void
  showCheckoutButton?: boolean
  eventType?: EventType
}

export default function BookingSummary({
  selectedSeats,
  total,
  onProceedToCheckout,
  showCheckoutButton = true,
  eventType = "general",
}: BookingSummaryProps) {
  // Group seats by category
  const seatsByCategory = selectedSeats.reduce<Record<string, SeatType[]>>((acc, seat) => {
    const category = seat.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(seat)
    return acc
  }, {})

  const getEventTypeLabel = () => {
    switch (eventType) {
      case "cinema":
        return "Tickets"
      case "train":
        return "Train Seats"
      case "bus":
        return "Bus Seats"
      default:
        return "Seats"
    }
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm h-full border-2 border-primary/10 perspective-container"
      initial={{ opacity: 0, y: 20, rotateX: 5 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{
        boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.1)",
        y: -5,
        transition: { duration: 0.2 },
      }}
    >
      <motion.h3
        className="text-lg font-semibold mb-4 flex items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Ticket className="mr-2 h-5 w-5" />
        Booking Summary
      </motion.h3>

      {selectedSeats.length === 0 ? (
        <motion.div
          className="text-muted-foreground text-center py-6 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 10,
              delay: 0.3,
            }}
          >
            <AlertCircle className="h-12 w-12 mb-2 text-muted-foreground/50" />
          </motion.div>
          <p>No {getEventTypeLabel().toLowerCase()} selected yet</p>
          <p className="text-sm mt-2">Select seats to continue with your booking</p>
        </motion.div>
      ) : (
        <>
          <motion.div className="space-y-4 mb-6" variants={staggerChildrenVariants} initial="initial" animate="animate">
            {Object.entries(seatsByCategory).map(([category, seats], index) => (
              <motion.div
                key={category}
                className="flex justify-between"
                variants={childVariants}
                custom={index}
                whileHover={{
                  x: 5,
                  transition: { duration: 0.2 },
                }}
              >
                <div>
                  <span className="capitalize">{category}</span> {getEventTypeLabel()} ({seats.length})
                  <div className="text-sm text-muted-foreground">
                    {seats.map((seat) => `${seat.row}${seat.number}`).join(", ")}
                  </div>
                </div>
                <div className="font-medium">{formatCurrency(seats.reduce((sum, seat) => sum + seat.price, 0))}</div>
              </motion.div>
            ))}

            <motion.div
              className="border-t pt-4 mt-4"
              variants={childVariants}
              custom={Object.keys(seatsByCategory).length}
            >
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <motion.span
                  className="text-primary text-lg"
                  animate={{
                    scale: [1, 1.05, 1],
                    transition: {
                      repeat: 3,
                      repeatType: "reverse",
                      duration: 0.5,
                      delay: 0.5,
                    },
                  }}
                >
                  {formatCurrency(total)}
                </motion.span>
              </div>
            </motion.div>
          </motion.div>

          {showCheckoutButton && onProceedToCheckout && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <motion.div whileHover="hover" whileTap="tap" initial="initial">
                <Button
                  className="w-full group button-3d"
                  onClick={onProceedToCheckout}
                  disabled={selectedSeats.length === 0}
                  variants={buttonHoverVariants}
                >
                  <CreditCard className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Proceed to Checkout
                </Button>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  )
}
