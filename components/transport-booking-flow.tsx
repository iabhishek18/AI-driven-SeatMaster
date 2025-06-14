"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import BusSelector from "./bus-selector"
import TrainSelector from "./train-selector"
import SeatMap from "./seat-map"
import BookingSummary from "./booking-summary"
import type { BusRoute, TrainRoute, TrainClass } from "@/types/transport"
import type { SeatType } from "@/types/booking"
import { generateSeatsForEventType } from "@/lib/seat-generator"
import { useNotification } from "@/context/notification-context"

type TransportType = "bus" | "train"
type BookingStep = "select-transport" | "select-seats" | "checkout" | "success"

export default function TransportBookingFlow() {
  const { notify } = useNotification()
  const [transportType, setTransportType] = useState<TransportType>("bus")
  const [selectedBus, setSelectedBus] = useState<BusRoute | null>(null)
  const [selectedTrain, setSelectedTrain] = useState<TrainRoute | null>(null)
  const [selectedTrainClass, setSelectedTrainClass] = useState<TrainClass>("economy")
  const [currentStep, setCurrentStep] = useState<BookingStep>("select-transport")
  const [seats, setSeats] = useState<SeatType[]>([])
  const [selectedSeats, setSelectedSeats] = useState<SeatType[]>([])

  const handleSelectBus = useCallback(
    (bus: BusRoute) => {
      try {
        setSelectedBus(bus)
        setSelectedTrain(null)
        const generatedSeats = generateSeatsForEventType("bus")
        setSeats(generatedSeats)
        setSelectedSeats([])
        setCurrentStep("select-seats")
        notify(`Selected ${bus.operator} bus (${bus.busNumber})`, "success")
      } catch (error) {
        console.error("Error selecting bus:", error)
        notify("There was an error selecting this bus. Please try again.", "error")
      }
    },
    [notify],
  )

  const handleSelectTrain = useCallback(
    (train: TrainRoute, trainClass: TrainClass) => {
      try {
        setSelectedTrain(train)
        setSelectedTrainClass(trainClass)
        setSelectedBus(null)
        const generatedSeats = generateSeatsForEventType("train")
        setSeats(generatedSeats)
        setSelectedSeats([])
        setCurrentStep("select-seats")
        notify(`Selected ${train.trainName} (${trainClass} class)`, "success")
      } catch (error) {
        console.error("Error selecting train:", error)
        notify("There was an error selecting this train. Please try again.", "error")
      }
    },
    [notify],
  )

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

  const handleBackToTransport = useCallback(() => {
    setCurrentStep("select-transport")
    setSelectedSeats([])
    notify("Returned to transport selection", "info")
  }, [notify])

  const handleProceedToCheckout = useCallback(() => {
    if (selectedSeats.length > 0) {
      setCurrentStep("checkout")
      notify("Proceeding to checkout", "info")
    } else {
      notify("Please select at least one seat to continue", "warning")
    }
  }, [selectedSeats.length, notify])

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0)
  }

  const getTransportDetails = () => {
    if (selectedBus) {
      return {
        name: `${selectedBus.operator} Bus`,
        date: "June 15, 2024",
        time: selectedBus.departureTime,
        venue: "Port Authority Bus Terminal",
        type: "bus" as const,
      }
    } else if (selectedTrain) {
      return {
        name: selectedTrain.trainName,
        date: "June 15, 2024",
        time: selectedTrain.departureTime,
        venue: `Grand Central Terminal, Platform ${selectedTrain.platform}`,
        type: "train" as const,
      }
    }
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-4xl font-bold text-center mb-2 text-primary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Transport Booking
      </motion.h1>
      <motion.p
        className="text-center text-muted-foreground mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Book bus and train tickets with ease
      </motion.p>

      <Card className="max-w-6xl mx-auto">
        <CardContent className="p-6">
          <Tabs value={currentStep} className="w-full" onValueChange={(value) => setCurrentStep(value as BookingStep)}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger
                value="select-transport"
                disabled={currentStep !== "select-transport" && !selectedSeats.length}
              >
                Select Transport
              </TabsTrigger>
              <TabsTrigger
                value="select-seats"
                disabled={(!selectedBus && !selectedTrain) || currentStep === "select-transport"}
              >
                Choose Seats
              </TabsTrigger>
              <TabsTrigger value="checkout" disabled={selectedSeats.length === 0 || currentStep === "select-transport"}>
                Checkout
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              {currentStep === "select-transport" && (
                <motion.div
                  key="select-transport"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="select-transport" className="mt-0">
                    <Tabs
                      value={transportType}
                      onValueChange={(value) => setTransportType(value as TransportType)}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="bus">Bus</TabsTrigger>
                        <TabsTrigger value="train">Train</TabsTrigger>
                      </TabsList>

                      <TabsContent value="bus" className="mt-0">
                        <BusSelector onSelectBus={handleSelectBus} />
                      </TabsContent>

                      <TabsContent value="train" className="mt-0">
                        <TrainSelector onSelectTrain={handleSelectTrain} />
                      </TabsContent>
                    </Tabs>
                  </TabsContent>
                </motion.div>
              )}

              {currentStep === "select-seats" && (
                <motion.div
                  key="select-seats"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="select-seats" className="mt-0">
                    <div className="mb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBackToTransport}
                        aria-label={`Back to ${transportType === "bus" ? "buses" : "trains"}`}
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to {transportType === "bus" ? "buses" : "trains"}
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        {(selectedBus || selectedTrain) && (
                          <motion.div
                            className="mb-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <h2 className="text-xl font-semibold mb-2">
                              {selectedBus
                                ? `${selectedBus.operator} - ${selectedBus.busNumber}`
                                : `${selectedTrain?.trainName} - ${selectedTrain?.trainNumber}`}
                            </h2>
                            <p className="text-muted-foreground">
                              June 15, 2024 at {selectedBus ? selectedBus.departureTime : selectedTrain?.departureTime}
                            </p>
                            <p className="text-muted-foreground">
                              {selectedBus
                                ? "Port Authority Bus Terminal"
                                : `Grand Central Terminal, Platform ${selectedTrain?.platform}`}
                            </p>
                            <div className="text-sm mt-2 inline-block bg-primary/10 text-primary px-2 py-1 rounded">
                              {selectedBus
                                ? selectedBus.busType
                                : selectedTrainClass.charAt(0).toUpperCase() + selectedTrainClass.slice(1)}
                            </div>
                          </motion.div>
                        )}

                        <SeatMap
                          seats={seats}
                          onSeatSelect={handleSeatSelect}
                          selectedSeats={selectedSeats}
                          eventType={selectedBus ? "bus" : "train"}
                        />
                      </div>

                      <div>
                        <BookingSummary
                          selectedSeats={selectedSeats}
                          total={calculateTotal()}
                          onProceedToCheckout={handleProceedToCheckout}
                          eventType={selectedBus ? "bus" : "train"}
                        />
                      </div>
                    </div>
                  </TabsContent>
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
                  <TabsContent value="checkout" className="mt-0">
                    <div className="text-center py-8">
                      <h2 className="text-2xl font-bold mb-4">Checkout Page</h2>
                      <p className="text-muted-foreground mb-4">
                        This is a placeholder for the checkout page. In a real application, this would include payment
                        processing, passenger details, and confirmation.
                      </p>
                      <div className="max-w-md mx-auto bg-muted p-4 rounded-lg mb-6">
                        <h3 className="font-medium mb-2">Booking Summary</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedBus
                            ? `${selectedBus.operator} Bus (${selectedBus.busNumber})`
                            : `${selectedTrain?.trainName} (${selectedTrain?.trainNumber})`}
                          <br />
                          June 15, 2024 at {selectedBus ? selectedBus.departureTime : selectedTrain?.departureTime}
                          <br />
                          {selectedBus
                            ? `${selectedBus.departureCity} to ${selectedBus.arrivalCity}`
                            : `${selectedTrain?.departureCity} to ${selectedTrain?.arrivalCity}`}
                          <br />
                          Seats: {selectedSeats.map((seat) => `${seat.row}${seat.number}`).join(", ")}
                          <br />
                          Total: ${calculateTotal().toFixed(2)}
                        </p>
                      </div>
                      <Button onClick={handleBackToTransport} aria-label="Return to transport selection">
                        Return to Transport Selection
                      </Button>
                    </div>
                  </TabsContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
