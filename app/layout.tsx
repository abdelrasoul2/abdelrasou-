import type React from "react"
import type { Metadata } from "next"
import { Inter, Noto_Kufi_Arabic } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { CookieConsent } from "@/components/cookie-consent"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const notoKufiArabic = Noto_Kufi_Arabic({ subsets: ["arabic"], variable: "--font-noto-kufi-arabic" })

export const metadata: Metadata = {
  title: "TypingMaster",
  description: "Improve your typing skills with our interactive typing games",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5007628650449617"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.variable} ${notoKufiArabic.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <LanguageProvider>
              {children}
              <CookieConsent />
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'