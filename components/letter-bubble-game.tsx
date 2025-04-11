"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { saveGameSession } from "@/lib/game-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

interface LetterBubble {
  id: string
  letter: string
  x: number
  y: number
  size: number
  color: string
  exploding: boolean
}

// Arabic and English letters
const ARABIC_LETTERS = "أبتثجحخدذرزسشصضطظعغفقكلمنهوي"
const ENGLISH_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

// Bubble colors with orange theme
const COLORS = [
  "bg-orange-500",
  "bg-orange-600",
  "bg-orange-400",
  "bg-amber-500",
  "bg-amber-600",
  "bg-yellow-500",
  "bg-red-500",
  "bg-rose-500",
]

export function LetterBubbleGame() {
  const [bubbles, setBubbles] = useState<LetterBubble[]>([])
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameActive, setGameActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [correctLetters, setCorrectLetters] = useState(0)
  const [totalLetters, setTotalLetters] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { user } = useAuth()
  const { t, currentLanguage } = useLanguage()

  // Start the game
  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setLevel(1)
    setTimeLeft(60)
    setCorrectLetters(0)
    setTotalLetters(0)
    setWpm(0)
    setAccuracy(100)
    setBubbles([])
    setGameStartTime(new Date())
    generateBubble()
  }

  // End the game
  const endGame = async () => {
    setGameActive(false)
    const finalWpm = Math.round(correctLetters / 5 / (60 / 60)) // 5 letters = 1 word
    const finalAccuracy = totalLetters > 0 ? Math.round((correctLetters / totalLetters) * 100) : 0

    setWpm(finalWpm)
    setAccuracy(finalAccuracy)

    toast({
      title: t("gameOver"),
      description: `${t("score")}: ${score}, ${t("wpm")}: ${finalWpm}, ${t("accuracy")}: ${finalAccuracy}%`,
    })

    // Save game session if user is logged in
    if (user) {
      try {
        await saveGameSession({
          user_id: user.id,
          words_per_minute: finalWpm,
          accuracy: finalAccuracy,
          total_characters: totalLetters,
          correct_characters: correctLetters,
          duration_seconds: 60,
          completed: true,
        })
      } catch (error) {
        console.error("Error saving game session:", error)
      }
    }
  }

  // Generate a random letter bubble
  const generateBubble = () => {
    if (!gameAreaRef.current || !gameActive) return

    const gameArea = gameAreaRef.current
    const maxWidth = gameArea.clientWidth - 80
    const maxHeight = gameArea.clientHeight - 80

    // Choose letter based on language
    const letterSet = currentLanguage === "ar" ? ARABIC_LETTERS : ENGLISH_LETTERS
    const letter = letterSet.charAt(Math.floor(Math.random() * letterSet.length))

    const x = Math.random() * maxWidth
    const y = Math.random() * maxHeight
    const size = Math.floor(Math.random() * 20) + 40 // 40-60px
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]

    const newBubble: LetterBubble = {
      id: `bubble-${Date.now()}-${Math.random()}`,
      letter,
      x,
      y,
      size,
      color,
      exploding: false,
    }

    setBubbles((prev) => [...prev, newBubble])

    // Generate more bubbles based on level
    const bubbleCount = Math.min(level, 5)
    if (bubbles.length < bubbleCount) {
      setTimeout(generateBubble, 1000 / level)
    }
  }

  // Handle key press
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameActive) return

      const key = e.key.toUpperCase()
      setTotalLetters((prev) => prev + 1)

      // Check if the pressed key matches any bubble
      const matchingBubbleIndex = bubbles.findIndex((bubble) => {
        // For Arabic, compare directly; for English, convert to uppercase
        return currentLanguage === "ar" ? bubble.letter === e.key : bubble.letter === key
      })

      if (matchingBubbleIndex !== -1) {
        // Correct key press
        setScore((prev) => prev + 10)
        setCorrectLetters((prev) => prev + 1)

        // Mark the bubble as exploding
        setBubbles((prev) => {
          const newBubbles = [...prev]
          newBubbles[matchingBubbleIndex] = {
            ...newBubbles[matchingBubbleIndex],
            exploding: true,
          }
          return newBubbles
        })

        // Remove the bubble after explosion animation
        setTimeout(() => {
          setBubbles((prev) => prev.filter((_, i) => i !== matchingBubbleIndex))

          // Generate a new bubble
          generateBubble()
        }, 300)

        // Level up every 50 points
        if ((score + 10) % 50 === 0) {
          setLevel((prev) => Math.min(prev + 1, 10))
          toast({
            title: `${t("level")} ${level + 1}!`,
            description: `${t("level")} ${level + 1}!`,
          })
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [bubbles, gameActive, level, score, currentLanguage, t, toast])

  // Game timer
  useEffect(() => {
    if (!gameActive) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          endGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameActive])

  // Calculate WPM and accuracy during the game
  useEffect(() => {
    if (gameActive) {
      const elapsedMinutes = (60 - timeLeft) / 60
      if (elapsedMinutes > 0) {
        const currentWpm = Math.round(correctLetters / 5 / elapsedMinutes)
        const currentAccuracy = totalLetters > 0 ? Math.round((correctLetters / totalLetters) * 100) : 100

        setWpm(currentWpm)
        setAccuracy(currentAccuracy)
      }
    }
  }, [correctLetters, totalLetters, timeLeft, gameActive])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{t("letterBubbles")}</CardTitle>
          <div className="flex gap-4 text-sm">
            <div>
              {t("score")}: {score}
            </div>
            <div>
              {t("level")}: {level}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 border-y">
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-4">
              <div className="text-sm">
                <span className="font-medium">{t("wpm")}:</span> {wpm}
              </div>
              <div className="text-sm">
                <span className="font-medium">{t("accuracy")}:</span> {accuracy}%
              </div>
            </div>
            <div className="text-sm">
              <span className="font-medium">{t("time")}:</span> {timeLeft}s
            </div>
          </div>
          <Progress value={(timeLeft / 60) * 100} className="h-2" />
        </div>

        <div ref={gameAreaRef} className="relative w-full h-[400px] bg-muted/20 overflow-hidden">
          {!gameActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10">
              {score > 0 ? (
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">{t("gameOver")}</h2>
                  <p className="text-lg mb-1">
                    {t("score")}: {score}
                  </p>
                  <p className="text-lg mb-1">
                    {t("wpm")}: {wpm}
                  </p>
                  <p className="text-lg mb-4">
                    {t("accuracy")}: {accuracy}%
                  </p>
                </div>
              ) : (
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">{t("letterBubbles")}</h2>
                  <p className="text-muted-foreground mb-4">{t("letterBubblesDesc")}</p>
                </div>
              )}
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600" onClick={startGame}>
                {score > 0 ? t("playAgain") : t("startTyping")}
              </Button>
            </div>
          )}

          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              className={`absolute rounded-full flex items-center justify-center font-bold text-white ${bubble.color} ${
                bubble.exploding ? "bubble-pop" : ""
              }`}
              style={{
                left: bubble.x,
                top: bubble.y,
                width: bubble.size,
                height: bubble.size,
                fontSize: bubble.size * 0.5,
              }}
            >
              {bubble.letter}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/20">
        <div className="text-center w-full text-sm text-muted-foreground">{t("letterBubblesDesc")}</div>
      </CardFooter>
    </Card>
  )
}
