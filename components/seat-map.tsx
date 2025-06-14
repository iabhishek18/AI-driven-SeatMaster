"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import type { SeatType, EventType } from "@/types/booking"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface SeatMapProps {
  seats: SeatType[]
  onSeatSelect: (seatId: string) => void
  selectedSeats: SeatType[]
  eventType: EventType
}

export default function SeatMap({ seats, onSeatSelect, selectedSeats, eventType }: SeatMapProps) {
  const [view, setView] = useState<"all" | "standard" | "premium">("all")
  const [animationComplete, setAnimationComplete] = useState(false)
  const [hoveredSeatId, setHoveredSeatId] = useState<string | null>(null)

  useEffect(() => {
    // Reset animation state when seats change
    setAnimationComplete(false)
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, seats.length * 20) // Staggered animation

    return () => clearTimeout(timer)
  }, [seats])

  const filteredSeats = seats.filter((seat) => {
    if (view === "all") return true
    return seat.category === view
  })

  // Group seats by row
  const seatsByRow = filteredSeats.reduce<Record<string, SeatType[]>>((acc, seat) => {
    const row = seat.row
    if (!acc[row]) {
      acc[row] = []
    }
    acc[row].push(seat)
    return acc
  }, {})

  // Sort rows alphabetically
  const sortedRows = Object.keys(seatsByRow).sort()

  const renderSeatMap = () => {
    switch (eventType) {
      case "cinema":
        return renderCinemaLayout()
      case "train":
        return renderTrainLayout()
      case "bus":
        return renderBusLayout()
      default:
        return renderDefaultLayout()
    }
  }

  const renderCinemaLayout = () => (
    <div className="perspective-container">
      <motion.div
        className="mb-8 text-center p-2 bg-gray-200 dark:bg-gray-700 rounded-lg w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-lg font-bold"
          animate={{
            scale: [1, 1.02, 1],
            transition: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              duration: 2,
            },
          }}
        >
          SCREEN
        </motion.div>
      </motion.div>
      <div className="space-y-4 min-w-[600px]">
        {sortedRows.map((row, rowIndex) => (
          <motion.div
            key={row}
            className="flex justify-center items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
          >
            <div className="w-8 font-bold text-center">{row}</div>
            <div className="flex gap-2 flex-wrap justify-center">
              {seatsByRow[row]
                .sort((a, b) => Number.parseInt(a.number) - Number.parseInt(b.number))
                .map((seat, index) => renderSeat(seat, index + rowIndex * 10))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderTrainLayout = () => (
    <div className="space-y-8 min-w-[600px] perspective-container">
      {sortedRows.map((row, rowIndex) => (
        <motion.div
          key={row}
          className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: rowIndex * 0.1 }}
          whileHover={{
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
            y: -5,
            transition: { duration: 0.2 },
          }}
        >
          <div className="font-bold mb-2 border-b pb-2">Coach {row}</div>
          <div className="grid grid-cols-4 gap-4">
            {seatsByRow[row]
              .sort((a, b) => Number.parseInt(a.number) - Number.parseInt(b.number))
              .map((seat, index) => (
                <div key={seat.id} className="flex justify-center">
                  {renderSeat(seat, index + rowIndex * 10)}
                </div>
              ))}
          </div>
        </motion.div>
      ))}
    </div>
  )

  const renderBusLayout = () => (
    <div className="relative min-w-[600px] bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border perspective-container">
      <motion.div
        className="absolute top-2 right-2 left-2 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.span
          animate={{
            scale: [1, 1.05, 1],
            transition: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              duration: 3,
            },
          }}
        >
          Driver
        </motion.span>
      </motion.div>
      <div className="mt-16 grid grid-cols-2 gap-8">
        <div className="space-y-2">
          {sortedRows
            .filter((row) => row <= "D") // Left side
            .map((row, rowIndex) => (
              <motion.div
                key={row}
                className="flex justify-end gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: rowIndex * 0.1 }}
              >
                {seatsByRow[row]
                  ?.filter((seat) => Number.parseInt(seat.number) <= 2)
                  .sort((a, b) => Number.parseInt(a.number) - Number.parseInt(b.number))
                  .map((seat, index) => renderSeat(seat, index + rowIndex * 4))}
              </motion.div>
            ))}
        </div>
        <div className="space-y-2">
          {sortedRows
            .filter((row) => row <= "D") // Right side
            .map((row, rowIndex) => (
              <motion.div
                key={row}
                className="flex justify-start gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: rowIndex * 0.1 }}
              >
                {seatsByRow[row]
                  ?.filter((seat) => Number.parseInt(seat.number) > 2)
                  .sort((a, b) => Number.parseInt(a.number) - Number.parseInt(b.number))
                  .map((seat, index) => renderSeat(seat, index + rowIndex * 4 + 20))}
              </motion.div>
            ))}
        </div>
      </div>
      <motion.div
        className="mt-8 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="bg-gray-200 dark:bg-gray-700 w-full h-8 rounded flex items-center justify-center">
          Rear Exit
        </div>
      </motion.div>
    </div>
  )

  const renderDefaultLayout = () => (
    <div className="space-y-4 min-w-[600px] perspective-container">
      {sortedRows.map((row, rowIndex) => (
        <motion.div
          key={row}
          className="flex justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
        >
          <div className="w-8 font-bold text-center">{row}</div>
          <div className="flex gap-2 flex-wrap justify-center">
            {seatsByRow[row]
              .sort((a, b) => Number.parseInt(a.number) - Number.parseInt(b.number))
              .map((seat, index) => renderSeat(seat, index + rowIndex * 10))}
          </div>
        </motion.div>
      ))}
    </div>
  )

  const renderSeat = (seat: SeatType, index: number) => {
    const isSelected = selectedSeats.some((s) => s.id === seat.id)
    const isPremium = seat.category === "premium"
    const isHovered = hoveredSeatId === seat.id

    let bgColor = "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
    if (seat.status === "booked") {
      bgColor = "bg-gray-500 cursor-not-allowed"
    } else if (isSelected || seat.status === "selected") {
      bgColor = "bg-green-500 hover:bg-green-600 text-white"
    } else if (isPremium) {
      bgColor = "bg-purple-500 hover:bg-purple-600 text-white"
    }

    return (
      <motion.button
        id={`seat-${seat.id}`}
        key={seat.id}
        className={cn(
          "w-10 h-10 rounded flex items-center justify-center text-sm font-medium transition-colors transform-gpu",
          bgColor,
          seat.status === "booked" ? "opacity-50" : "",
          "perspective-container",
        )}
        onClick={() => onSeatSelect(seat.id)}
        disabled={seat.status === "booked"}
        aria-label={`Seat ${seat.row}${seat.number}, ${seat.category}, ${seat.status}`}
        aria-pressed={isSelected}
        initial={{ scale: 0, opacity: 0, rotateX: 45 }}
        animate={{
          scale: 1,
          opacity: 1,
          rotateX: 0,
          z: isSelected ? 20 : 0,
          y: isSelected ? -5 : 0,
          boxShadow: isSelected ? "0px 10px 15px rgba(0, 0, 0, 0.2)" : "0px 0px 0px rgba(0, 0, 0, 0.1)",
        }}
        whileHover={{
          scale: 1.1,
          z: 10,
          y: -3,
          boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.15)",
        }}
        whileTap={{ scale: 0.95 }}
        transition={{
          duration: 0.3,
          delay: index * 0.02,
          type: "spring",
          stiffness: 300,
          damping: 15,
        }}
        onMouseEnter={() => setHoveredSeatId(seat.id)}
        onMouseLeave={() => setHoveredSeatId(null)}
      >
        {seat.number}
      </motion.button>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Select Your Seats</h3>
        <Tabs value={view} onValueChange={(value) => setView(value as "all" | "standard" | "premium")}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="standard">Standard</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded mr-2"></div>
          <span className="text-sm">Available</span>
        </motion.div>
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="w-6 h-6 bg-green-500 rounded mr-2"></div>
          <span className="text-sm">Selected</span>
        </motion.div>
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="w-6 h-6 bg-gray-500 rounded mr-2"></div>
          <span className="text-sm">Booked</span>
        </motion.div>
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="w-6 h-6 bg-purple-500 rounded mr-2"></div>
          <span className="text-sm">Premium</span>
        </motion.div>
      </div>

      <div className="w-full overflow-x-auto">{renderSeatMap()}</div>
    </div>
  )
}
