"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-4xl font-bold text-center mb-2 text-primary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Privacy Policy
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
            <CardTitle>SeatMaster Privacy Policy</CardTitle>
            <CardDescription>
              This Privacy Policy describes how your personal information is collected, used, and shared when you use
              our service.
            </CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h2>1. Information We Collect</h2>
            <p>When you use our service, we collect several types of information:</p>
            <ul>
              <li>
                <strong>Personal Information:</strong> Name, email address, phone number, and billing information.
              </li>
              <li>
                <strong>Booking Information:</strong> Details about the events you book, including seat selections and
                preferences.
              </li>
              <li>
                <strong>Usage Information:</strong> How you interact with our service, including pages visited and
                features used.
              </li>
              <li>
                <strong>Device Information:</strong> Information about the device you use to access our service,
                including IP address, browser type, and operating system.
              </li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and manage your bookings</li>
              <li>Communicate with you about your bookings and account</li>
              <li>Improve and optimize our service</li>
              <li>Detect and prevent fraudulent activities</li>
              <li>Comply with legal obligations</li>
              <li>Send you marketing communications (with your consent)</li>
            </ul>

            <h2>3. Information Sharing and Disclosure</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>
                <strong>Service Providers:</strong> Third-party companies that help us provide our service, such as
                payment processors and email service providers.
              </li>
              <li>
                <strong>Event Organizers:</strong> Information necessary for event access and verification.
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect our rights.
              </li>
            </ul>

            <h2>4. Data Retention</h2>
            <p>
              We will retain your information for as long as your account is active or as needed to provide you with our
              services. We will also retain and use your information as necessary to comply with legal obligations,
              resolve disputes, and enforce our agreements.
            </p>

            <h2>5. Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul>
              <li>The right to access the personal information we hold about you</li>
              <li>The right to request correction or deletion of your personal information</li>
              <li>The right to restrict or object to our processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent at any time</li>
            </ul>

            <h2>6. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our service and hold certain
              information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being
              sent.
            </p>

            <h2>7. Children's Privacy</h2>
            <p>
              Our service is not intended for individuals under the age of 16. We do not knowingly collect personal
              information from children under 16.
            </p>

            <h2>8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2>9. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@seatmaster.com.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
