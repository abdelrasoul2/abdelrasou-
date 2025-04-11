"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { Keyboard, BarChart, Award, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { AdUnit } from "@/components/ad-unit"

export default function HomePage() {
  const { user, profile, isLoading } = useAuth()
  const { t, currentLanguage, changeLanguage, dir } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5007628650449617"
        crossOrigin="anonymous"
      />
      <div className="flex flex-col min-h-screen" dir={dir}>
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Keyboard className="h-6 w-6 text-orange-500" />
              <span className="font-bold text-xl">TypingMaster</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium hover:text-orange-500">
                {t("home")}
              </Link>
              <Link href="/game" className="text-sm font-medium hover:text-orange-500">
                {t("play")}
              </Link>
              {user && (
                <Link href="/dashboard" className="text-sm font-medium hover:text-orange-500">
                  {t("dashboard")}
                </Link>
              )}
              <Link href="/about" className="text-sm font-medium hover:text-orange-500">
                {t("about")}
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-muted"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {isLoading ? (
                <div className="h-9 w-20 bg-muted animate-pulse rounded-md"></div>
              ) : user ? (
                <div className="flex items-center gap-2">
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                    >
                      {t("dashboard")}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                    >
                      {t("signIn")}
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      {t("signUp")}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/10">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t("improveTyping")}</h1>
                  <p className="text-muted-foreground md:text-xl">{t("typingMasterDesc")}</p>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Link href="/game">
                      <Button size="lg" className="w-full min-[400px]:w-auto bg-orange-500 hover:bg-orange-600">
                        {t("startTyping")}
                      </Button>
                    </Link>
                    {!user && (
                      <Link href="/signup">
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full min-[400px]:w-auto border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                        >
                          {t("createAccount")}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="relative w-full max-w-md">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg blur-2xl opacity-20"></div>
                    <Card className="relative overflow-hidden border-2 border-orange-500/20">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="text-2xl font-bold">{t("letterBubbles")}</div>
                            <div className="text-sm">{t("score")}: 120</div>
                          </div>
                          <div className="grid grid-cols-5 gap-2">
                            {Array.from({ length: 10 }).map((_, i) => {
                              const letters = currentLanguage === "ar" ? "أبتثجحخدذر" : "ABCDEFGHIJ"
                              return (
                                <div
                                  key={i}
                                  className={`aspect-square rounded-full flex items-center justify-center text-white font-bold ${[
                                    "bg-orange-500",
                                    "bg-orange-600",
                                    "bg-orange-400",
                                    "bg-amber-500",
                                    "bg-amber-600",
                                  ][i % 5]}`}
                                  style={{
                                    fontSize: `${Math.floor(Math.random() * 10) + 16}px`,
                                  }}
                                >
                                  {letters[i]}
                                </div>
                              )
                            })}
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <div>{t("wpm")}: 45</div>
                            <div>{t("accuracy")}: 92%</div>
                            <div>{t("time")}: 30s</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="container my-8 flex justify-center">
            <div className="w-[728px] h-[90px] max-w-full">
              <AdUnit
                slot="1234567890"
                width={728}
                height={90}
                format="horizontal"
                className="mx-auto bg-muted/20 rounded-lg"
              />
            </div>
          </div>

          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t("features")}</h2>
                  <p className="text-muted-foreground md:text-xl">{t("featuresDesc")}</p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
                <div className="flex flex-col items-center space-y-2 rounded-lg p-4 border border-orange-500/20">
                  <div className="rounded-full bg-orange-500/10 p-2">
                    <Keyboard className="h-6 w-6 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold">{t("interactiveGames")}</h3>
                  <p className="text-center text-muted-foreground">{t("interactiveGamesDesc")}</p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg p-4 border border-orange-500/20">
                  <div className="rounded-full bg-orange-500/10 p-2">
                    <BarChart className="h-6 w-6 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold">{t("progressTracking")}</h3>
                  <p className="text-center text-muted-foreground">{t("progressTrackingDesc")}</p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg p-4 border border-orange-500/20">
                  <div className="rounded-full bg-orange-500/10 p-2">
                    <Award className="h-6 w-6 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold">{t("achievements")}</h3>
                  <p className="text-center text-muted-foreground">{t("achievementsDesc")}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="container my-8 flex justify-center">
            <div className="w-[300px] h-[250px]">
              <AdUnit
                slot="9876543210"
                width={300}
                height={250}
                format="rectangle"
                className="mx-auto bg-muted/20 rounded-lg"
              />
            </div>
          </div>

          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/10">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t("readyToImprove")}</h2>
                  <p className="text-muted-foreground md:text-xl">{t("readyToImproveDesc")}</p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/game">
                    <Button size="lg" className="w-full min-[400px]:w-auto bg-orange-500 hover:bg-orange-600">
                      {t("startTyping")}
                    </Button>
                  </Link>
                  {!user && (
                    <Link href="/signup">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full min-[400px]:w-auto border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                      >
                        {t("createAccount")}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}
