"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User, Mail, Phone, CreditCard } from "lucide-react"
import { staggerChildrenVariants, childVariants, buttonHoverVariants } from "@/lib/animation-variants"

interface CheckoutFormProps {
  customerInfo: {
    name: string
    email: string
    phone: string
  }
  onCustomerInfoChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
  isProcessing?: boolean
}

export default function CheckoutForm({
  customerInfo,
  onCustomerInfoChange,
  onSubmit,
  onBack,
  isProcessing = false,
}: CheckoutFormProps) {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border-2 border-primary/10 perspective-container"
      initial={{ opacity: 0, y: 20, rotateX: 5 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      whileHover={{
        boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.1)",
        y: -5,
        transition: { duration: 0.2 },
      }}
    >
      <div className="flex items-center mb-6">
        <motion.div whileHover="hover" whileTap="tap" initial="initial">
          <Button
            variant="outline"
            size="sm"
            className="mr-2 group"
            onClick={onBack}
            aria-label="Back to seat selection"
            variants={buttonHoverVariants}
          >
            <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Seats
          </Button>
        </motion.div>
        <h3 className="text-lg font-semibold">Complete Your Booking</h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <motion.div className="space-y-4" variants={staggerChildrenVariants} initial="initial" animate="animate">
          <motion.div
            variants={childVariants}
            className="perspective-container"
            whileHover={{
              y: -2,
              transition: { duration: 0.2 },
            }}
          >
            <Label htmlFor="name" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              value={customerInfo.name}
              onChange={onCustomerInfoChange}
              required
              placeholder="Enter your full name"
              className="mt-1 focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </motion.div>

          <motion.div
            variants={childVariants}
            className="perspective-container"
            whileHover={{
              y: -2,
              transition: { duration: 0.2 },
            }}
          >
            <Label htmlFor="email" className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={customerInfo.email}
              onChange={onCustomerInfoChange}
              required
              placeholder="Enter your email address"
              className="mt-1 focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </motion.div>

          <motion.div
            variants={childVariants}
            className="perspective-container"
            whileHover={{
              y: -2,
              transition: { duration: 0.2 },
            }}
          >
            <Label htmlFor="phone" className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={customerInfo.phone}
              onChange={onCustomerInfoChange}
              required
              placeholder="Enter your phone number"
              className="mt-1 focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="pt-4 flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <motion.div whileHover="hover" whileTap="tap" initial="initial">
            <Button
              variant="outline"
              type="button"
              onClick={onBack}
              className="sm:w-1/3 group"
              aria-label="Back to seat selection"
              variants={buttonHoverVariants}
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back
            </Button>
          </motion.div>
          <motion.div whileHover="hover" whileTap="tap" initial="initial" className="sm:w-2/3">
            <Button
              type="submit"
              className="w-full button-3d"
              isLoading={isProcessing}
              loadingText="Processing..."
              aria-label="Complete booking"
              variants={buttonHoverVariants}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Complete Booking
            </Button>
          </motion.div>
        </motion.div>
      </form>
    </motion.div>
  )
}
