"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-4xl font-bold text-center mb-2 text-primary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Terms of Service
      </motion.h1>
      <motion.p
        className="text-center text-muted-foreground mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Last updated: April 12, 2024
      </motion.p>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>SeatMaster Terms of Service</CardTitle>
            <CardDescription>Please read these terms carefully before using our service.</CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the SeatMaster service, you agree to be bound by these Terms of Service. If you do
              not agree to these terms, please do not use our service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              SeatMaster provides an online platform for users to browse, select, and book seats for various events,
              including but not limited to cinema screenings, train journeys, bus trips, and general events.
            </p>

            <h2>3. User Accounts</h2>
            <p>
              To access certain features of the service, you may be required to register for an account. You are
              responsible for maintaining the confidentiality of your account information and for all activities that
              occur under your account.
            </p>

            <h2>4. Booking and Payments</h2>
            <p>
              When you book seats through our service, you agree to pay all fees and applicable taxes associated with
              your booking. All bookings are subject to availability and confirmation. Prices for seats may change at
              any time, but changes will not affect confirmed bookings.
            </p>

            <h2>5. Cancellation and Refunds</h2>
            <p>
              Cancellation policies vary depending on the event type and timing. Generally, cancellations made at least
              48 hours before the event are eligible for a full refund. Cancellations made within 48 hours of the event
              may be eligible for a partial refund. Some events may have non-refundable tickets, which will be clearly
              indicated during the booking process.
            </p>

            <h2>6. Prohibited Activities</h2>
            <p>
              You agree not to engage in any of the following prohibited activities: (1) copying, distributing, or
              disclosing any part of the service; (2) using any automated system to access the service; (3) attempting
              to interfere with the proper functioning of the service; (4) making multiple reservations for the same
              event with the intent to resell.
            </p>

            <h2>7. Intellectual Property</h2>
            <p>
              The service and its original content, features, and functionality are owned by SeatMaster and are
              protected by international copyright, trademark, patent, trade secret, and other intellectual property
              laws.
            </p>

            <h2>8. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the service immediately, without prior notice or
              liability, for any reason, including without limitation if you breach the Terms.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              In no event shall SeatMaster, nor its directors, employees, partners, agents, suppliers, or affiliates, be
              liable for any indirect, incidental, special, consequential or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>

            <h2>10. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. It is your responsibility to review
              these Terms periodically for changes.
            </p>

            <h2>11. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at legal@seatmaster.com.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
