"use client"

import { useEffect, useRef, useState } from "react"

interface AdUnitProps {
  slot: string
  format?: "auto" | "rectangle" | "horizontal" | "vertical"
  responsive?: boolean
  className?: string
  width?: string | number
  height?: string | number
}

export function AdUnit({
  slot,
  format = "auto",
  responsive = true,
  className = "",
  width = 300,
  height = 250,
}: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const [adLoaded, setAdLoaded] = useState(false)
  const [adError, setAdError] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Convert width and height to pixels if they're numbers
  const widthPx = typeof width === "number" ? `${width}px` : width
  const heightPx = typeof height === "number" ? `${height}px` : height

  // Check if the element is visible in the viewport
  useEffect(() => {
    if (!adRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)
        })
      },
      { threshold: 0.1 },
    )

    observer.observe(adRef.current)
    return () => observer.disconnect()
  }, [])

  // Load the ad when the component is visible
  useEffect(() => {
    if (!isVisible || !adRef.current || adLoaded) return

    // Make sure the container has explicit dimensions
    const container = adRef.current

    // Force explicit dimensions
    container.style.width = widthPx
    container.style.height = heightPx
    container.style.display = "block"
    container.style.overflow = "hidden"

    // Longer delay to ensure the container is fully rendered
    const timer = setTimeout(() => {
      try {
        // Log dimensions for debugging
        console.log(`Ad container dimensions: ${container.offsetWidth}x${container.offsetHeight}`)

        // Only try to load ad if container has width
        if (container.offsetWidth === 0) {
          console.warn("Ad container has zero width, not loading ad")
          setAdError(true)
          return
        }

        // Check if adsbygoogle is loaded
        if (window.adsbygoogle === undefined) {
          console.warn("AdSense not loaded yet")
          setAdError(true)
          return
        }
        // Push the ad
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        setAdLoaded(true)
      } catch (error) {
        console.error("Error loading Google AdSense ad:", error)
        setAdError(true)
      }
    }, 1000) // Increased delay to 1 second

    return () => clearTimeout(timer)
  }, [isVisible, adLoaded, widthPx, heightPx])

  // Fallback content when ad fails to load or is loading
  if (adError || !isVisible) {
    return (
      <div
        ref={adRef}
        className={`ad-container ${className}`}
        style={{
          width: widthPx,
          height: heightPx,
          minWidth: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.05)",
          borderRadius: "0.5rem",
        }}
      >
        <span className="text-sm text-muted-foreground">Advertisement</span>
      </div>
    )
  }

  return (
    <div
      className={`ad-container ${className}`}
      style={{
        width: widthPx,
        height: heightPx,
        minWidth: "300px",
        display: "block",
        overflow: "hidden",
      }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
          width: widthPx,
          height: heightPx,
        }}
        data-ad-client="ca-pub-5007628650449617"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      ></ins>
    </div>
  )
}

// Add this to make TypeScript happy with the adsbygoogle global
declare global {
  interface Window {
    adsbygoogle: any[]
  }
}
