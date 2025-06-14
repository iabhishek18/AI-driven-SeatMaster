"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  Calendar,
  MapPin,
  Star,
  Info,
  Filter,
  ArrowRight,
  Wifi,
  Zap,
  Thermometer,
  Coffee,
  AlertCircle,
  Users,
} from "lucide-react"
import type { BusRoute } from "@/types/transport"
import { formatCurrency } from "@/lib/utils"
import { busRoutes } from "@/data/transport-data"
import { Progress } from "@/components/ui/progress"
import { useNotification } from "@/context/notification-context"

interface BusSelectorProps {
  onSelectBus: (bus: BusRoute) => void
}

export default function BusSelector({ onSelectBus }: BusSelectorProps) {
  const { notify } = useNotification()
  const [sortBy, setSortBy] = useState<"departure" | "price" | "duration" | "rating">("departure")
  const [filterBusType, setFilterBusType] = useState<string | null>(null)
  const [hoveredBusId, setHoveredBusId] = useState<string | null>(null)

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "WiFi":
        return <Wifi className="h-3 w-3" />
      case "USB Charging":
        return <Zap className="h-3 w-3" />
      case "Air Conditioning":
        return <Thermometer className="h-3 w-3" />
      case "Snacks":
        return <Coffee className="h-3 w-3" />
      default:
        return <Info className="h-3 w-3" />
    }
  }

  const sortedBuses = [...busRoutes].sort((a, b) => {
    switch (sortBy) {
      case "departure":
        return a.departureTime.localeCompare(b.departureTime)
      case "price":
        return a.price - b.price
      case "duration":
        return a.duration.localeCompare(b.duration)
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const filteredBuses = filterBusType
    ? sortedBuses.filter((bus) => bus.busType.toLowerCase() === filterBusType.toLowerCase())
    : sortedBuses

  const getAvailabilityPercentage = (bus: BusRoute) => {
    return Math.round((bus.availableSeats / bus.totalSeats) * 100)
  }

  const getAvailabilityColor = (percentage: number) => {
    if (percentage < 20) return "bg-red-500"
    if (percentage < 50) return "bg-yellow-500"
    return "bg-green-500"
  }

  const handleSortChange = useCallback(
    (sort: "departure" | "price" | "duration" | "rating") => {
      setSortBy(sort)

      const sortMessages = {
        departure: "Sorted by departure time",
        price: "Sorted by price",
        duration: "Sorted by journey duration",
        rating: "Sorted by customer rating",
      }

      notify(sortMessages[sort], "info")
    },
    [notify],
  )

  const handleFilterChange = useCallback(
    (type: string | null) => {
      setFilterBusType(type)

      if (type) {
        notify(`Showing ${type} buses only`, "info")
      } else {
        notify("Showing all bus types", "info")
      }
    },
    [notify],
  )

  const handleSelectBus = useCallback(
    (bus: BusRoute) => {
      try {
        onSelectBus(bus)
        notify(`Selected ${bus.operator} (${bus.busNumber})`, "success")
      } catch (error) {
        console.error("Error selecting bus:", error)
        notify("There was an error selecting this bus. Please try again.", "error")
      }
    },
    [onSelectBus, notify],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Available Buses</h2>
          <p className="text-muted-foreground">
            {filteredBuses.length} buses found from New York to Boston on June 15, 2024
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all" onClick={() => handleFilterChange(null)}>
                All
              </TabsTrigger>
              <TabsTrigger value="standard" onClick={() => handleFilterChange("standard")}>
                Standard
              </TabsTrigger>
              <TabsTrigger value="luxury" onClick={() => handleFilterChange("luxury")}>
                Luxury
              </TabsTrigger>
              <TabsTrigger value="sleeper" onClick={() => handleFilterChange("sleeper")}>
                Sleeper
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Sort by:</span>
        </span>
        <Button
          variant={sortBy === "departure" ? "default" : "outline"}
          size="sm"
          onClick={() => handleSortChange("departure")}
        >
          Departure Time
        </Button>
        <Button
          variant={sortBy === "price" ? "default" : "outline"}
          size="sm"
          onClick={() => handleSortChange("price")}
        >
          Price
        </Button>
        <Button
          variant={sortBy === "duration" ? "default" : "outline"}
          size="sm"
          onClick={() => handleSortChange("duration")}
        >
          Duration
        </Button>
        <Button
          variant={sortBy === "rating" ? "default" : "outline"}
          size="sm"
          onClick={() => handleSortChange("rating")}
        >
          Rating
        </Button>
      </div>

      {filteredBuses.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No buses found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your filters to see more results</p>
          <Button onClick={() => handleFilterChange(null)}>Show All Buses</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBuses.map((bus, index) => (
            <motion.div
              key={bus.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredBusId(bus.id)}
              onMouseLeave={() => setHoveredBusId(null)}
            >
              <Card
                className={`overflow-hidden transition-all duration-300 ${
                  hoveredBusId === bus.id ? "shadow-lg border-primary" : ""
                }`}
              >
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative h-40 md:h-full">
                      <img
                        src={bus.image || "/placeholder.svg"}
                        alt={`${bus.operator} bus`}
                        className={`w-full h-full object-cover transition-all duration-500 ${
                          hoveredBusId === bus.id ? "scale-105" : "scale-100"
                        }`}
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-white/90 text-black">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          {bus.rating}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <Badge className="bg-primary/90">{bus.busType}</Badge>
                      </div>
                    </div>

                    <div className="p-4 md:col-span-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <h3 className="text-lg font-semibold">{bus.operator}</h3>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {bus.busNumber}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>June 15, 2024</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {bus.amenities.slice(0, 4).map((amenity, i) => (
                              <Badge key={i} variant="outline" className="text-xs flex items-center gap-1">
                                {getAmenityIcon(amenity)}
                                {amenity}
                              </Badge>
                            ))}
                            {bus.amenities.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{bus.amenities.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="grid grid-cols-3 items-center">
                            <div className="text-center">
                              <p className="font-semibold">{bus.departureTime}</p>
                              <p className="text-xs text-muted-foreground">{bus.departureCity}</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center">
                                <div className="h-[2px] w-8 bg-muted"></div>
                                <Clock className="h-4 w-4 mx-1 text-muted-foreground" />
                                <div className="h-[2px] w-8 bg-muted"></div>
                              </div>
                              <p className="text-xs text-muted-foreground">{bus.duration}</p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold">{bus.arrivalTime}</p>
                              <p className="text-xs text-muted-foreground">{bus.arrivalCity}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-center text-sm">
                            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">Port Authority Bus Terminal</span>
                          </div>
                        </div>

                        <div className="flex flex-col justify-between">
                          <div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">{formatCurrency(bus.price)}</p>
                              <p className="text-sm text-muted-foreground">per person</p>
                            </div>
                            <div className="text-right text-sm mt-1">
                              <div className="flex items-center justify-end gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span
                                  className={`font-medium ${bus.availableSeats < 10 ? "text-red-500" : "text-green-500"}`}
                                >
                                  {bus.availableSeats} seats left
                                </span>
                              </div>
                              <div className="mt-2">
                                <Progress
                                  value={getAvailabilityPercentage(bus)}
                                  className="h-2"
                                  indicatorClassName={getAvailabilityColor(getAvailabilityPercentage(bus))}
                                />
                              </div>
                            </div>
                          </div>
                          <Button
                            className="mt-2 w-full group"
                            onClick={() => handleSelectBus(bus)}
                            aria-label={`Select seats for ${bus.operator} bus ${bus.busNumber}`}
                          >
                            Select Seats
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
