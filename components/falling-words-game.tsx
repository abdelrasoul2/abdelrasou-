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

// Define game content
const gameContent = {
  en: {
    beginner: [
      "the",
      "and",
      "for",
      "you",
      "she",
      "his",
      "her",
      "they",
      "have",
      "with",
      "this",
      "that",
      "from",
      "not",
      "what",
    ],
    intermediate: [
      "computer",
      "keyboard",
      "typing",
      "practice",
      "improve",
      "skills",
      "learning",
      "education",
      "development",
      "progress",
    ],
    advanced: [
      "extraordinary",
      "sophisticated",
      "development",
      "professional",
      "accomplishment",
      "determination",
      "perseverance",
      "opportunity",
    ],
  },
  ar: {
    beginner: ["في", "من", "إلى", "على", "هذا", "هذه", "أنا", "أنت", "هو", "هي", "نحن", "هم", "كان", "كانت", "يكون"],
    intermediate: [
      "الحاسوب",
      "لوحة المفاتيح",
      "الكتابة",
      "الممارسة",
      "التحسين",
      "المهارات",
      "التعلم",
      "التعليم",
      "التطوير",
      "التقدم",
    ],
    advanced: ["الاستثنائية", "المتطورة", "التنمية", "الاحترافية", "الإنجاز", "التصميم", "المثابرة", "الفرصة"],
  },
}

// Define word colors
const WORD_COLORS = [
  "text-orange-500",
  "text-amber-500",
  "text-yellow-500",
  "text-red-500",
  "text-rose-500",
  "text-pink-500",
  "text-purple-500",
  "text-blue-500",
  "text-cyan-500",
  "text-teal-500",
  "text-green-500",
]

interface FallingWord {
  id: string
  word: string
  x: number
  y: number
  speed: number
  color: string
  isActive: boolean
  isCompleted: boolean
}

type Level = "beginner" | "intermediate" | "advanced"

export function FallingWordsGame() {
  const [level, setLevel] = useState<Level>("beginner")
  const [words, setWords] = useState<FallingWord[]>([])
  const [userInput, setUserInput] = useState("")
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [correctChars, setCorrectChars] = useState(0)
  const [totalChars, setTotalChars] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [activeWordId, setActiveWordId] = useState<string | null>(null)
  const [gameSpeed, setGameSpeed] = useState(1)
  const [wordsCompleted, setWordsCompleted] = useState(0)
  const [combo, setCombo] = useState(0)
  const [showComboMessage, setShowComboMessage] = useState(false)
  const [comboMessage, setComboMessage] = useState("")

  const gameAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const animationFrameRef = useRef<number>(0)
  const lastWordTimeRef = useRef<number>(Date.now())
  const { toast } = useToast()
  const { user } = useAuth()
  const { t, currentLanguage } = useLanguage()

  // Start the game
  const startGame = () => {
    setGameActive(true)
    setWords([])
    setUserInput("")
    setScore(0)
    setTimeLeft(60)
    setCorrectChars(0)
    setTotalChars(0)
    setWpm(0)
    setAccuracy(100)
    setActiveWordId(null)
    setGameSpeed(1)
    setWordsCompleted(0)
    setCombo(0)
    lastWordTimeRef.current = Date.now()

    // Focus the input field
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)
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

  // Generate a new falling word
  const generateWord = () => {
    if (!gameAreaRef.current || !gameActive) return

    const gameArea = gameAreaRef.current
    const maxWidth = gameArea.clientWidth - 150
    const wordList = gameContent[currentLanguage as keyof typeof gameContent][level]
    const word = wordList[Math.floor(Math.random() * wordList.length)]
    const x = Math.random() * maxWidth
    const speed = (0.5 + Math.random() * 0.5) * gameSpeed // Base speed adjusted by game speed
    const color = WORD_COLORS[Math.floor(Math.random() * WORD_COLORS.length)]

    const newWord: FallingWord = {
      id: `word-${Date.now()}-${Math.random()}`,
      word,
      x,
      y: -30, // Start above the visible area
      speed,
      color,
      isActive: false,
      isCompleted: false,
    }

    setWords((prev) => [...prev, newWord])
    lastWordTimeRef.current = Date.now()
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!gameActive) return

    const input = e.target.value
    setUserInput(input)

    // Find a matching word
    const matchingWordIndex = words.findIndex(
      (word) => !word.isCompleted && word.word.toLowerCase() === input.toLowerCase(),
    )

    if (matchingWordIndex !== -1) {
      // Word matched
      const matchedWord = words[matchingWordIndex]
      setActiveWordId(null)
      setUserInput("")
      setCorrectChars((prev) => prev + matchedWord.word.length)
      setTotalChars((prev) => prev + matchedWord.word.length)

      // Update combo
      setCombo((prev) => prev + 1)
      if (combo + 1 >= 3) {
        const comboPoints = Math.min(combo + 1, 10) * 5
        setScore((prev) => prev + matchedWord.word.length * 10 + comboPoints)
        setComboMessage(`+${comboPoints} ${t("comboBonus")}!`)
        setShowComboMessage(true)
        setTimeout(() => setShowComboMessage(false), 1500)
      } else {
        setScore((prev) => prev + matchedWord.word.length * 10)
      }

      // Mark word as completed
      setWords((prev) => {
        const newWords = [...prev]
        newWords[matchingWordIndex] = {
          ...newWords[matchingWordIndex],
          isCompleted: true,
        }
        return newWords
      })

      setWordsCompleted((prev) => prev + 1)

      // Increase game speed after every 5 words
      if ((wordsCompleted + 1) % 5 === 0 && gameSpeed < 2.5) {
        setGameSpeed((prev) => prev + 0.1)
        toast({
          title: t("speedIncreased"),
          description: t("gameSpeedingUp"),
        })
      }
    } else if (input.length > 0) {
      // Check if we're starting to type a word
      const potentialMatchIndex = words.findIndex(
        (word) => !word.isCompleted && !word.isActive && word.word.toLowerCase().startsWith(input.toLowerCase()),
      )

      if (potentialMatchIndex !== -1) {
        // Found a potential match, mark it as active
        setActiveWordId(words[potentialMatchIndex].id)
        setWords((prev) => {
          const newWords = [...prev]
          newWords[potentialMatchIndex] = {
            ...newWords[potentialMatchIndex],
            isActive: true,
          }
          return newWords
        })
      } else {
        // No potential match, reset combo
        setCombo(0)
        setTotalChars((prev) => prev + 1)
      }
    }
  }

  // Animation loop for falling words
  const animateWords = () => {
    if (!gameActive || !gameAreaRef.current) return

    const gameArea = gameAreaRef.current
    const maxHeight = gameArea.clientHeight

    setWords((prevWords) => {
      // Move words down
      const updatedWords = prevWords
        .filter((word) => !word.isCompleted) // Remove completed words
        .map((word) => ({
          ...word,
          y: word.y + word.speed,
        }))

      // Check for words that have fallen off the screen
      const wordsOffScreen = updatedWords.filter((word) => word.y > maxHeight)

      // Reset combo if any word falls off screen
      if (wordsOffScreen.length > 0) {
        setCombo(0)
      }

      // Remove words that have fallen off the screen
      return updatedWords.filter((word) => word.y <= maxHeight)
    })

    // Generate new words periodically
    const now = Date.now()
    const timeSinceLastWord = now - lastWordTimeRef.current
    const wordGenerationInterval = Math.max(3000 - gameSpeed * 500, 1000) // Decrease interval as speed increases

    if (timeSinceLastWord > wordGenerationInterval && words.length < 10) {
      generateWord()
    }

    animationFrameRef.current = requestAnimationFrame(animateWords)
  }

  // Start animation loop when game is active
  useEffect(() => {
    if (gameActive) {
      animationFrameRef.current = requestAnimationFrame(animateWords)
      generateWord() // Generate first word
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
          <CardTitle>{t("fallingWords")}</CardTitle>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <li>{t("fallingWordsInstructions1")}</li>
                  <li>{t("fallingWordsInstructions2")}</li>
                  <li>{t("fallingWordsInstructions3")}</li>
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
              {/* Falling words */}
              <AnimatePresence>
                {words.map((word) => (
                  <motion.div
                    key={word.id}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{
                      opacity: 1,
                      y: word.y,
                      x: word.x,
                      scale: word.isActive ? 1.2 : 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 1.5,
                      y: word.y - 20,
                    }}
                    transition={{
                      duration: word.isCompleted ? 0.3 : 0,
                      ease: word.isCompleted ? "easeOut" : "linear",
                    }}
                    className={`absolute px-2 py-1 rounded-md ${
                      word.isActive
                        ? "bg-orange-500/20 border border-orange-500"
                        : word.isCompleted
                          ? "bg-green-500/20 border border-green-500"
                          : ""
                    } ${word.color} font-medium`}
                    style={{ left: word.x }}
                  >
                    {word.word}
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
                placeholder={t("typeTheWords")}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
              />

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {t("wordsCompleted")}: {wordsCompleted}
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
        <div className="text-center w-full text-sm text-muted-foreground">{t("fallingWordsDesc")}</div>
      </CardFooter>
    </Card>
  )
}
