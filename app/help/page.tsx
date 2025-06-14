"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

export default function HelpCenterPage() {
  const faqs = [
    {
      question: "How do I book seats for an event?",
      answer:
        "To book seats, first select an event from our events page. Then, choose your preferred seats from the seating chart. Once you've selected your seats, proceed to checkout to complete your booking by providing your contact information and payment details.",
    },
    {
      question: "Can I cancel or modify my booking?",
      answer:
        "Yes, you can cancel or modify your booking up to 48 hours before the event. To do so, go to 'My Bookings' in your account, select the booking you wish to change, and follow the instructions for cancellation or modification.",
    },
    {
      question: "How do I receive my tickets?",
      answer:
        "After completing your booking, e-tickets will be sent to the email address you provided during checkout. You can also access your tickets at any time by logging into your account and visiting the 'My Bookings' section.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit and debit cards, including Visa, Mastercard, American Express, and Discover. We also support payments through PayPal, Apple Pay, and Google Pay for your convenience.",
    },
    {
      question: "Is there a refund policy?",
      answer:
        "Yes, we offer full refunds for cancellations made at least 48 hours before the event. Cancellations made within 48 hours of the event may be eligible for a partial refund, depending on the specific event's policy. Some special events may have non-refundable tickets, which will be clearly indicated during the booking process.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can reach our customer support team through the 'Contact Us' page on our website, by emailing support@seatmaster.com, or by calling our customer service line at +1 (234) 567-890 during business hours (Monday-Friday, 9AM-6PM EST).",
    },
  ]

  const categories = [
    {
      title: "Booking Process",
      description: "Learn how to book seats for events",
      icon: "📝",
    },
    {
      title: "Account Management",
      description: "Manage your profile and preferences",
      icon: "👤",
    },
    {
      title: "Payments & Refunds",
      description: "Information about payments and refunds",
      icon: "💳",
    },
    {
      title: "Tickets & Access",
      description: "How to access and use your tickets",
      icon: "🎟️",
    },
    {
      title: "Technical Support",
      description: "Help with website and app issues",
      icon: "🔧",
    },
    {
      title: "Event Information",
      description: "Details about venues and events",
      icon: "🏟️",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-4xl font-bold text-center mb-2 text-primary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Help Center
      </motion.h1>
      <motion.p
        className="text-center text-muted-foreground mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Find answers to your questions and get support
      </motion.p>

      <div className="max-w-3xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input placeholder="Search for help articles..." className="pl-10 py-6 text-lg" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
            <TabsTrigger value="categories">Help Categories</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Find answers to the most common questions about our services.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <AccordionItem value={`item-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="text-3xl mb-2">{category.icon}</div>
                      <CardTitle>{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        View Articles
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Can't find what you're looking for? Our support team is here to help.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">Email Support</h3>
                    <p className="text-muted-foreground">Send us an email and we'll get back to you within 24 hours.</p>
                    <a href="mailto:support@seatmaster.com" className="text-primary hover:underline">
                      support@seatmaster.com
                    </a>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Phone Support</h3>
                    <p className="text-muted-foreground">Call us during business hours for immediate assistance.</p>
                    <a href="tel:+1234567890" className="text-primary hover:underline">
                      +1 (234) 567-890
                    </a>
                    <p className="text-sm text-muted-foreground">Monday-Friday, 9AM-6PM EST</p>
                  </div>
                </div>
                <div className="pt-4">
                  <Button asChild className="w-full md:w-auto">
                    <a href="/contact">Go to Contact Page</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
