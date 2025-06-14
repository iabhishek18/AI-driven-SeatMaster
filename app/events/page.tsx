"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventSelector from "@/components/event-selector"
import { initialEvents } from "@/data/initial-data"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import type { EventType } from "@/types/booking"

export default function EventsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"all" | EventType>("all")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mr-4 group"
          onClick={() => router.push("/")}
          aria-label="Back to home"
        >
          <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Button>
        <div>
          <motion.h1
            className="text-4xl font-bold text-center mb-2 text-primary"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Upcoming Events
          </motion.h1>
          <motion.p
            className="text-center text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Browse and book tickets for our featured events
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <Tabs
          defaultValue="all"
          className="w-full"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "all" | EventType)}
        >
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="cinema">Cinema</TabsTrigger>
            <TabsTrigger value="train">Train</TabsTrigger>
            <TabsTrigger value="bus">Bus</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <EventSelector events={initialEvents} onSelectEvent={() => {}} standalone={true} returnPath="/events" />
          </TabsContent>

          <TabsContent value="cinema" className="mt-0">
            <EventSelector
              events={initialEvents.filter((event) => event.type === "cinema")}
              onSelectEvent={() => {}}
              standalone={true}
              returnPath="/events"
            />
          </TabsContent>

          <TabsContent value="train" className="mt-0">
            <EventSelector
              events={initialEvents.filter((event) => event.type === "train")}
              onSelectEvent={() => {}}
              standalone={true}
              returnPath="/events"
            />
          </TabsContent>

          <TabsContent value="bus" className="mt-0">
            <EventSelector
              events={initialEvents.filter((event) => event.type === "bus")}
              onSelectEvent={() => {}}
              standalone={true}
              returnPath="/events"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
