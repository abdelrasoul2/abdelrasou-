"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { saveGameSession } from "@/lib/game-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"

interface Bubble {
  id: string
  content: string
  x: number
  y: number
  size: number
  color: string
  exploding: boolean
  speed: number
  angle: number
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

type Level = "beginner" | "intermediate" | "advanced"
type ContentType = "letters" | "words"

// Define game content for words
const WORDS_CONTENT = {
  en: {
    beginner: ["the", "and", "for", "you", "she", "his", "her", "they", "have", "with"],
    intermediate: ["computer", "keyboard", "typing", "practice", "improve", "skills"],
    advanced: ["extraordinary", "sophisticated", "development", "professional"],
  },
  ar: {
    beginner: ["في", "من", "إلى", "على", "هذا", "هذه", "أنا", "أنت", "هو", "هي"],
    intermediate: ["الحاسوب", "لوحة المفاتيح", "الكتابة", "الممارسة", "التحسين"],
    advanced: ["الاستثنائية", "المتطورة", "التنمية", "الاحترافية", "الإنجاز"],
  },
}

export function BubbleShooterGame() {
  const [contentType, setContentType] = useState<ContentType>("letters")
  const [level, setLevel] = useState<Level>("beginner")
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [userInput, setUserInput] = useState("")
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [correctChars, setCorrectChars] = useState(0)
  const [totalChars, setTotalChars] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [gameSpeed, setGameSpeed] = useState(1)
  const [combo, setCombo] = useState(0)
  const [showComboMessage, setShowComboMessage] = useState(false)
  const [comboMessage, setComboMessage] = useState("")
  const [bubblesPopped, setBubblesPopped] = useState(0)
  const [specialEffects, setSpecialEffects] = useState<{ x: number; y: number; type: string }[]>([])

  const gameAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const animationFrameRef = useRef<number>(0)
  const lastBubbleTimeRef = useRef<number>(Date.now())
  const { toast } = useToast()
  const { user } = useAuth()
  const { t, currentLanguage } = useLanguage()

  // Start the game
  const startGame = () => {
    setGameActive(true)
    setBubbles([])
    setUserInput("")
    setScore(0)
    setTimeLeft(60)
    setCorrectChars(0)
    setTotalChars(0)
    setWpm(0)
    setAccuracy(100)
    setGameSpeed(1)
    setCombo(0)
    setBubblesPopped(0)
    setSpecialEffects([])
    lastBubbleTimeRef.current = Date.now()

    // Focus the input field
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)

    // Generate initial bubbles
    for (let i = 0; i < 5; i++) {
      generateBubble()
    }
  }

  // End the game
  const endGame = async () => {
    setGameActive(false)
    cancelAnimationFrame(animationFrameRef.current)

    const finalWpm = Math.round(correctChars / 5 / (60 / 60)) // 5 chars = 1 word
    const finalAccuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0

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
          total_characters: totalChars,
          correct_characters: correctChars,
          duration_seconds: 60,
          completed: true,
        })
      } catch (error) {
        console.error("Error saving game session:", error)
      }
    }
  }

  // Generate bubble content based on content type and level
  const generateContent = () => {
    if (contentType === "letters") {
      // Choose letter based on language
      const letterSet = currentLanguage === "ar" ? ARABIC_LETTERS : ENGLISH_LETTERS
      return letterSet.charAt(Math.floor(Math.random() * letterSet.length))
    } else {
      // Choose word based on language and level
      const wordList = WORDS_CONTENT[currentLanguage as keyof typeof WORDS_CONTENT][level]
      return wordList[Math.floor(Math.random() * wordList.length)]
    }
  }

  // Generate a new bubble
  const generateBubble = () => {
    if (!gameAreaRef.current || !gameActive) return

    const gameArea = gameAreaRef.current
    const maxWidth = gameArea.clientWidth - 80
    const maxHeight = gameArea.clientHeight - 80

    const content = generateContent()
    const size =
      contentType === "letters"
        ? Math.floor(Math.random() * 20) + 40 // 40-60px for letters
        : Math.floor(Math.random() * 20) + 60 // 60-80px for words

    // Random position
    const x = Math.random() * (maxWidth - size)
    const y = Math.random() * (maxHeight - size)

    // Random movement
    const speed = (0.2 + Math.random() * 0.3) * gameSpeed
    const angle = Math.random() * Math.PI * 2 // Random angle in radians

    const color = COLORS[Math.floor(Math.random() * COLORS.length)]

    const newBubble: Bubble = {
      id: `bubble-${Date.now()}-${Math.random()}`,
      content,
      x,
      y,
      size,
      color,
      exploding: false,
      speed,
      angle,
    }

    setBubbles((prev) => [...prev, newBubble])
    lastBubbleTimeRef.current = Date.now()
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!gameActive) return

    const input = e.target.value
    setUserInput(input)

    // For letters, check if the input matches any bubble content exactly
    if (contentType === "letters" && input.length === 1) {
      checkBubbleMatch(input)
      setUserInput("")
    }
    // For words, check if the complete input matches any bubble content
    else if (contentType === "words") {
      const matchingBubbleIndex = bubbles.findIndex(
        (bubble) => !bubble.exploding && bubble.content.toLowerCase() === input.toLowerCase(),
      )

      if (matchingBubbleIndex !== -1) {
        // Word matched
        popBubble(matchingBubbleIndex)
        setUserInput("")
      }
    }
  }

  // Check if input matches any bubble
  const checkBubbleMatch = (input: string) => {
    const matchingBubbleIndex = bubbles.findIndex((bubble) => {
      // For Arabic, compare directly; for English, convert to uppercase
      return currentLanguage === "ar" ? bubble.content === input : bubble.content.toLowerCase() === input.toLowerCase()
    })

    if (matchingBubbleIndex !== -1) {
      popBubble(matchingBubbleIndex)
    } else {
      // No match found
      setCombo(0)
      setTotalChars((prev) => prev + 1)

      // Show error effect
      if (gameAreaRef.current) {
        const gameArea = gameAreaRef.current
        setSpecialEffects((prev) => [
          ...prev,
          {
            x: gameArea.clientWidth / 2,
            y: gameArea.clientHeight / 2,
            type: "error",
          },
        ])

        // Remove effect after animation
        setTimeout(() => {
          setSpecialEffects((prev) => prev.filter((effect) => effect.type !== "error"))
        }, 500)
      }
    }
  }

  // Pop a bubble
  const popBubble = (index: number) => {
    const bubble = bubbles[index]

    // Mark bubble as exploding
    setBubbles((prev) => {
      const newBubbles = [...prev]
      newBubbles[index] = {
        ...newBubbles[index],
        exploding: true,
      }
      return newBubbles
    })

    // Update stats
    const contentLength = bubble.content.length
    setCorrectChars((prev) => prev + contentLength)
    setTotalChars((prev) => prev + contentLength)
    setBubblesPopped((prev) => prev + 1)

    // Update combo
    setCombo((prev) => prev + 1)

    // Calculate points based on content length and combo
    const basePoints = contentLength * 10
    let comboPoints = 0

    if (combo >= 2) {
      comboPoints = Math.min(combo, 10) * 5
      setComboMessage(`+${comboPoints} ${t("comboBonus")}!`)
      setShowComboMessage(true)
      setTimeout(() => setShowComboMessage(false), 1500)
    }

    setScore((prev) => prev + basePoints + comboPoints)

    // Add special effect
    setSpecialEffects((prev) => [
      ...prev,
      {
        x: bubble.x + bubble.size / 2,
        y: bubble.y + bubble.size / 2,
        type: "pop",
      },
    ])

    // Remove bubble after explosion animation
    setTimeout(() => {
      setBubbles((prev) => prev.filter((_, i) => i !== index))
      setSpecialEffects((prev) => prev.filter((effect) => effect.type !== "pop"))

      // Increase game speed after every 10 bubbles
      if ((bubblesPopped + 1) % 10 === 0 && gameSpeed < 2.5) {
        setGameSpeed((prev) => prev + 0.2)
        toast({
          title: t("speedIncreased"),
          description: t("gameSpeedingUp"),
        })
      }
    }, 300)
  }

  // Animation loop for moving bubbles
  const animateBubbles = () => {
    if (!gameActive || !gameAreaRef.current) return

    const gameArea = gameAreaRef.current
    const maxWidth = gameArea.clientWidth - 80
    const maxHeight = gameArea.clientHeight - 80

    setBubbles((prevBubbles) => {
      // Move bubbles
      return prevBubbles.map((bubble) => {
        if (bubble.exploding) return bubble

        // Calculate new position
        let newX = bubble.x + Math.cos(bubble.angle) * bubble.speed
        let newY = bubble.y + Math.sin(bubble.angle) * bubble.speed
        let newAngle = bubble.angle

        // Bounce off walls
        if (newX <= 0 || newX >= maxWidth - bubble.size) {
          newAngle = Math.PI - newAngle
          newX = Math.max(0, Math.min(newX, maxWidth - bubble.size))
        }
        if (newY <= 0 || newY >= maxHeight - bubble.size) {
          newAngle = -newAngle
          newY = Math.max(0, Math.min(newY, maxHeight - bubble.size))
        }

        return {
          ...bubble,
          x: newX,
          y: newY,
          angle: newAngle,
        }
      })
    })

    // Generate new bubbles periodically
    const now = Date.now()
    const timeSinceLastBubble = now - lastBubbleTimeRef.current
    const bubbleGenerationInterval = Math.max(3000 - gameSpeed * 500, 1000) // Decrease interval as speed increases

    if (timeSinceLastBubble > bubbleGenerationInterval && bubbles.length < 10) {
      generateBubble()
    }

    animationFrameRef.current = requestAnimationFrame(animateBubbles)
  }

  // Start animation loop when game is active
  useEffect(() => {
    if (gameActive) {
      animationFrameRef.current = requestAnimationFrame(animateBubbles)
    }

    return () => {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [gameActive, gameSpeed])

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
        const currentWpm = Math.round(correctChars / 5 / elapsedMinutes)
        const currentAccuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100

        setWpm(currentWpm)
        setAccuracy(currentAccuracy)
      }
    }
  }, [correctChars, totalChars, timeLeft, gameActive])

  // Focus input when game starts
  useEffect(() => {
    if (gameActive && inputRef.current) {
      inputRef.current.focus()
    }
  }, [gameActive])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{t("bubbleShooter")}</CardTitle>
          <div className="flex gap-4 text-sm">
            <div>
              {t("score")}: {score}
            </div>
            <div>
              {t("combo")}: {combo}
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

        {!gameActive ? (
          <div className="p-6 space-y-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("contentType")}</label>
                  <Select value={contentType} onValueChange={(value) => setContentType(value as ContentType)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectContentType")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="letters">{t("letters")}</SelectItem>
                      <SelectItem value="words">{t("words")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("level")}</label>
                  <Select value={level} onValueChange={(value) => setLevel(value as Level)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectLevel")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">{t("beginner")}</SelectItem>
                      <SelectItem value="intermediate">{t("intermediate")}</SelectItem>
                      <SelectItem value="advanced">{t("advanced")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={startGame}>
                    {t("startGame")}
                  </Button>
                </div>
              </div>

              <div className="bg-muted/20 rounded-lg p-6 border border-orange-500/20">
                <h3 className="text-lg font-medium mb-2">{t("howToPlay")}</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>{t("bubbleShooterInstructions1")}</li>
                  <li>{t("bubbleShooterInstructions2")}</li>
                  <li>{t("bubbleShooterInstructions3")}</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div
              ref={gameAreaRef}
              className="relative w-full h-[400px] bg-muted/20 overflow-hidden"
              onClick={() => inputRef.current?.focus()}
            >
              {/* Bubbles */}
              <AnimatePresence>
                {bubbles.map((bubble) => (
                  <motion.div
                    key={bubble.id}
                    initial={{ scale: 0 }}
                    animate={{
                      scale: bubble.exploding ? 1.5 : 1,
                      opacity: bubble.exploding ? 0 : 1,
                      x: bubble.x,
                      y: bubble.y,
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      duration: bubble.exploding ? 0.3 : 0.2,
                      ease: bubble.exploding ? "easeOut" : "linear",
                    }}
                    className={`absolute rounded-full flex items-center justify-center font-bold text-white ${bubble.color} ${
                      bubble.exploding ? "bubble-pop" : ""
                    }`}
                    style={{
                      width: bubble.size,
                      height: bubble.size,
                      fontSize: contentType === "letters" ? bubble.size * 0.5 : bubble.size * 0.3,
                    }}
                  >
                    {bubble.content}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Special effects */}
              <AnimatePresence>
                {specialEffects.map((effect, index) => (
                  <motion.div
                    key={`effect-${index}-${effect.type}`}
                    initial={{
                      opacity: 1,
                      scale: 0.5,
                      x: effect.x,
                      y: effect.y,
                    }}
                    animate={{
                      opacity: 0,
                      scale: effect.type === "pop" ? 2 : 1.5,
                      x: effect.x,
                      y: effect.type === "pop" ? effect.y - 30 : effect.y,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none ${
                      effect.type === "pop" ? "text-green-500 font-bold text-xl" : "text-red-500 font-bold text-xl"
                    }`}
                  >
                    {effect.type === "pop" ? "+10" : "✗"}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Combo message */}
              <AnimatePresence>
                {showComboMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 0, scale: 0.5 }}
                    animate={{ opacity: 1, y: -50, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-orange-500"
                  >
                    {comboMessage}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 space-y-4">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                className="w-full p-4 text-xl rounded-lg border-2 bg-background border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder={contentType === "letters" ? t("typeLetters") : t("typeWords")}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
              />

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {t("bubblesPopped")}: {bubblesPopped}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                  onClick={endGame}
                >
                  {t("endGame")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 bg-muted/20">
        <div className="text-center w-full text-sm text-muted-foreground">{t("bubbleShooterDesc")}</div>
      </CardFooter>
    </Card>
  )
}
