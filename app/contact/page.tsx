"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const { t, dir } = useLanguage()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon!",
      })
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col min-h-screen" dir={dir}>
      <div className="container py-6 flex-1">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1 hover:text-orange-500">
              <ArrowLeft className="h-4 w-4" />
              {t("home")}
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-muted-foreground mb-8">Get in touch with our team for any questions or feedback</p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <Card className="bg-background">
              <CardContent className="pt-6">
                <div className="rounded-full bg-orange-500/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">Email</h3>
                <p className="text-muted-foreground">
                  <a href="mailto:contact@typingmaster.com" className="hover:text-orange-500">
                    contact@typingmaster.com
                  </a>
                </p>
                <p className="text-muted-foreground mt-1">
                  <a href="mailto:support@typingmaster.com" className="hover:text-orange-500">
                    support@typingmaster.com
                  </a>
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardContent className="pt-6">
                <div className="rounded-full bg-orange-500/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">Phone</h3>
                <p className="text-muted-foreground">
                  <a href="tel:+1234567890" className="hover:text-orange-500">
                    +1 (234) 567-890
                  </a>
                </p>
                <p className="text-muted-foreground mt-1">Monday - Friday, 9AM - 5PM</p>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardContent className="pt-6">
                <div className="rounded-full bg-orange-500/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">Address</h3>
                <p className="text-muted-foreground">123 Typing Street</p>
                <p className="text-muted-foreground mt-1">Keyboard City, TC 12345</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted/10 rounded-lg p-6 border border-orange-500/20">
            <h2 className="text-2xl font-semibold mb-4">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Your Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help you?"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Your message here..."
                  rows={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full md:w-auto bg-orange-500 hover:bg-orange-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="bg-background p-4 rounded-lg border">
                <h3 className="font-medium mb-2">How do I create an account?</h3>
                <p className="text-muted-foreground">
                  You can create an account by clicking the "Sign Up" button in the top right corner of the homepage.
                  Fill in your email address, create a password, and you're ready to go!
                </p>
              </div>

              <div className="bg-background p-4 rounded-lg border">
                <h3 className="font-medium mb-2">Is TypingMaster free to use?</h3>
                <p className="text-muted-foreground">
                  Yes, TypingMaster offers free access to basic typing games and features. We also offer premium plans
                  with additional features and content for users who want to take their typing skills to the next level.
                </p>
              </div>

              <div className="bg-background p-4 rounded-lg border">
                <h3 className="font-medium mb-2">How can I track my progress?</h3>
                <p className="text-muted-foreground">
                  Once you've created an account, you can access your personal dashboard to view detailed statistics
                  about your typing performance, including WPM, accuracy, and improvement over time.
                </p>
              </div>

              <div className="bg-background p-4 rounded-lg border">
                <h3 className="font-medium mb-2">Do you offer typing certificates?</h3>
                <p className="text-muted-foreground">
                  Yes, after completing certain milestones or achieving specific typing speeds, you can earn
                  certificates that verify your typing proficiency. These can be downloaded and shared with employers or
                  educational institutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
