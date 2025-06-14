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
  Coffee,
  Train,
  ArrowDown,
  Users,
  AlertCircle,
} from "lucide-react"
import type { TrainRoute, TrainClass } from "@/types/transport"
import { formatCurrency } from "@/lib/utils"
import { trainRoutes } from "@/data/transport-data"
import { Progress } from "@/components/ui/progress"
import { useNotification } from "@/context/notification-context"

interface TrainSelectorProps {
  onSelectTrain: (train: TrainRoute, trainClass: TrainClass) => void
}

export default function TrainSelector({ onSelectTrain }: TrainSelectorProps) {
  const { notify } = useNotification()
  const [sortBy, setSortBy] = useState<"departure" | "price" | "duration" | "rating">("departure")
  const [filterTrainType, setFilterTrainType] = useState<string | null>(null)
  const [selectedClass, setSelectedClass] = useState<TrainClass>("economy")
  const [expandedTrainId, setExpandedTrainId] = useState<string | null>(null)
  const [hoveredTrainId, setHoveredTrainId] = useState<string | null>(null)

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "WiFi":
        return <Wifi className="h-3 w-3" />
      case "Power Outlets":
        return <Zap className="h-3 w-3" />
      case "Cafe Car":
      case "Dining Car":
      case "Meal Service":
        return <Coffee className="h-3 w-3" />
      default:
        return <Info className="h-3 w-3" />
    }
  }

  const sortedTrains = [...trainRoutes].sort((a, b) => {
    switch (sortBy) {
      case "departure":
        return a.departureTime.localeCompare(b.departureTime)
      case "price":
        return a.price[selectedClass] - b.price[selectedClass]
      case "duration":
        return a.duration.localeCompare(b.duration)
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const filteredTrains = filterTrainType
    ? sortedTrains.filter((train) => train.trainType.toLowerCase() === filterTrainType.toLowerCase())
    : sortedTrains

  const toggleTrainDetails = useCallback(
    (trainId: string) => {
      setExpandedTrainId(expandedTrainId === trainId ? null : trainId)

      const train = trainRoutes.find((t) => t.id === trainId)
      if (train) {
        if (expandedTrainId === trainId) {
          notify(`Collapsed details for ${train.trainName}`, "info")
        } else {
          notify(`Expanded details for ${train.trainName}`, "info")
        }
      }
    },
    [expandedTrainId, notify],
  )

  const getAvailabilityPercentage = (train: TrainRoute) => {
    return Math.round((train.availableSeats[selectedClass] / train.totalSeats[selectedClass]) * 100)
  }

  const getAvailabilityColor = (percentage: number) => {
    if (percentage < 20) return "bg-red-500"
    if (percentage < 50) return "bg-yellow-500"
    return "bg-green-500"
  }

  const handleClassChange = useCallback(
    (value: string) => {
      setSelectedClass(value as TrainClass)
      notify(`Switched to ${value} class`, "info")
    },
    [notify],
  )

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
      setFilterTrainType(type)

      if (type) {
        notify(`Showing ${type} trains only`, "info")
      } else {
        notify("Showing all train types", "info")
      }
    },
    [notify],
  )

  const handleSelectTrain = useCallback(
    (train: TrainRoute) => {
      try {
        onSelectTrain(train, selectedClass)
        notify(`Selected ${train.trainName} (${selectedClass} class)`, "success")
      } catch (error) {
        console.error("Error selecting train:", error)
        notify("There was an error selecting this train. Please try again.", "error")
      }
    },
    [onSelectTrain, selectedClass, notify],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Available Trains</h2>
          <p className="text-muted-foreground">
            {filteredTrains.length} trains found from New York to Boston on June 15, 2024
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all" onClick={() => handleFilterChange(null)}>
                All
              </TabsTrigger>
              <TabsTrigger value="express" onClick={() => handleFilterChange("express")}>
                Express
              </TabsTrigger>
              <TabsTrigger value="regional" onClick={() => handleFilterChange("regional")}>
                Regional
              </TabsTrigger>
              <TabsTrigger value="high speed" onClick={() => handleFilterChange("high speed")}>
                High Speed
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
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

        <div className="flex items-center">
          <span className="text-sm font-medium mr-2">Travel Class:</span>
          <Tabs value={selectedClass} onValueChange={handleClassChange}>
            <TabsList>
              <TabsTrigger value="economy">Economy</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="firstClass">First Class</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {filteredTrains.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No trains found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your filters to see more results</p>
          <Button onClick={() => handleFilterChange(null)}>Show All Trains</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTrains.map((train, index) => (
            <motion.div
              key={train.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredTrainId(train.id)}
              onMouseLeave={() => setHoveredTrainId(null)}
            >
              <Card
                className={`overflow-hidden transition-all duration-300 ${
                  hoveredTrainId === train.id ? "shadow-lg border-primary" : ""
                }`}
              >
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative h-40 md:h-full">
                      <img
                        src={train.image || "/placeholder.svg?height=400&width=600&query=train"}
                        alt={`${train.trainName} train`}
                        className={`w-full h-full object-cover transition-all duration-500 ${
                          hoveredTrainId === train.id ? "scale-105" : "scale-100"
                        }`}
                        onError={(e) => {
                          // If image fails to load, replace with a placeholder
                          e.currentTarget.src = `/placeholder.svg?height=400&width=600&query=${train.trainType}%20train`
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-white/90 text-black">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          {train.rating}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <Badge className="bg-primary/90">{train.trainType}</Badge>
                      </div>
                    </div>

                    <div className="p-4 md:col-span-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <h3 className="text-lg font-semibold">{train.trainName}</h3>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {train.trainNumber}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>June 15, 2024</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {train.amenities.slice(0, 4).map((amenity, i) => (
                              <Badge key={i} variant="outline" className="text-xs flex items-center gap-1">
                                {getAmenityIcon(amenity)}
                                {amenity}
                              </Badge>
                            ))}
                            {train.amenities.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{train.amenities.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="grid grid-cols-3 items-center">
                            <div className="text-center">
                              <p className="font-semibold">{train.departureTime}</p>
                              <p className="text-xs text-muted-foreground">{train.departureCity}</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center">
                                <div className="h-[2px] w-8 bg-muted"></div>
                                <Clock className="h-4 w-4 mx-1 text-muted-foreground" />
                                <div className="h-[2px] w-8 bg-muted"></div>
                              </div>
                              <p className="text-xs text-muted-foreground">{train.duration}</p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold">{train.arrivalTime}</p>
                              <p className="text-xs text-muted-foreground">{train.arrivalCity}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-center text-sm">
                            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">Platform {train.platform}</span>
                          </div>
                          <div className="flex items-center justify-center mt-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-6 px-2 group"
                              onClick={() => toggleTrainDetails(train.id)}
                            >
                              <Train className="h-3 w-3 mr-1" />
                              {train.stops.length} stops
                              <ArrowDown
                                className={`h-3 w-3 ml-1 transition-transform duration-200 ${expandedTrainId === train.id ? "rotate-180" : ""}`}
                              />
                            </Button>
                          </div>
                        </div>

                        <div className="flex flex-col justify-between">
                          <div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">
                                {formatCurrency(train.price[selectedClass])}
                              </p>
                              <p className="text-sm text-muted-foreground">{selectedClass} class</p>
                            </div>
                            <div className="text-right text-sm mt-1">
                              <div className="flex items-center justify-end gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span
                                  className={`font-medium ${
                                    train.availableSeats[selectedClass] < 10 ? "text-red-500" : "text-green-500"
                                  }`}
                                >
                                  {train.availableSeats[selectedClass]} seats left
                                </span>
                              </div>
                              <div className="mt-2">
                                <Progress
                                  value={getAvailabilityPercentage(train)}
                                  className="h-2"
                                  indicatorClassName={getAvailabilityColor(getAvailabilityPercentage(train))}
                                />
                              </div>
                            </div>
                          </div>
                          <Button
                            className="mt-2 w-full group"
                            onClick={() => handleSelectTrain(train)}
                            aria-label={`Select seats for ${train.trainName} (${selectedClass} class)`}
                          >
                            Select Seats
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>

                      {expandedTrainId === train.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2">Stops</h4>
                              <div className="space-y-2">
                                {train.stops.map((stop, i) => (
                                  <div key={i} className="flex items-center">
                                    <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                                    <span className="text-sm">{stop}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-2">Class Information</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Economy:</span>
                                  <span>{formatCurrency(train.price.economy)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Business:</span>
                                  <span>{formatCurrency(train.price.business)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>First Class:</span>
                                  <span>{formatCurrency(train.price.firstClass)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Amenities</h4>
                            <div className="flex flex-wrap gap-2">
                              {train.amenities.map((amenity, i) => (
                                <Badge key={i} variant="outline" className="text-xs flex items-center gap-1">
                                  {getAmenityIcon(amenity)}
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
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
