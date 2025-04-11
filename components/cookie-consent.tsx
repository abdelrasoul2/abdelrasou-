"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Link from "next/link"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem("cookie-consent")
    if (!hasConsented) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "all")
    setShowBanner(false)
    // Here you would initialize additional tracking/analytics if needed
  }

  const acceptNecessary = () => {
    localStorage.setItem("cookie-consent", "necessary")
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-2">We use cookies</h3>
            <p className="text-sm text-muted-foreground">
              This website uses cookies to enhance your browsing experience, serve personalized ads or content, and
              analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Read our{" "}
              <Link href="/privacy" className="text-orange-500 hover:underline">
                Privacy Policy
              </Link>{" "}
              to learn more.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-2 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
              onClick={acceptNecessary}
            >
              Necessary Only
            </Button>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={acceptAll}>
              Accept All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-8 w-8 rounded-full"
              onClick={acceptNecessary}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
