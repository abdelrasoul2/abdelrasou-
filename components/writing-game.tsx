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

// Define content types
type ContentType = "letters" | "words" | "sentences"
type Level = "beginner" | "intermediate" | "advanced"

// Define game content
const gameContent = {
  en: {
    letters: {
      beginner: "abcdefghijklmnopqrstuvwxyz".split(""),
      intermediate: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
      advanced: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(""),
    },
    words: {
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
    sentences: {
      beginner: [
        "The quick brown fox jumps over the lazy dog.",
        "She sells seashells by the seashore.",
        "How much wood would a woodchuck chuck.",
      ],
      intermediate: [
        "Typing is a skill that improves with regular practice and dedication.",
        "The ability to type quickly and accurately can save you hours of time.",
        "Focus on accuracy first, then gradually increase your typing speed.",
      ],
      advanced: [
        "The acquisition of typing proficiency requires consistent practice and attention to proper finger positioning on the keyboard.",
        "Developing muscle memory through repetitive exercises is essential for achieving high-speed typing without looking at the keys.",
        "Professional typists can often reach speeds of over 100 words per minute with near-perfect accuracy after years of dedicated practice.",
      ],
    },
  },
  ar: {
    letters: {
      beginner: "أبتثجحخدذرزسشصضطظعغفقكلمنهوي".split(""),
      intermediate: "أبتثجحخدذرزسشصضطظعغفقكلمنهوي٠١٢٣٤٥٦٧٨٩".split(""),
      advanced: "أبتثجحخدذرزسشصضطظعغفقكلمنهويءؤئإآ٠١٢٣٤٥٦٧٨٩".split(""),
    },
    words: {
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
    sentences: {
      beginner: [
        "القط البني السريع يقفز فوق الكلب الكسول.",
        "تبيع محار البحر على شاطئ البحر.",
        "كم من الخشب يمكن أن يقطع قاطع الخشب.",
      ],
      intermediate: [
        "الكتابة هي مهارة تتحسن مع الممارسة المنتظمة والتفاني.",
        "القدرة على الكتابة بسرعة ودقة يمكن أن توفر لك ساعات من الوقت.",
        "ركز على الدقة أولاً، ثم زد سرعة الكتابة تدريجياً.",
      ],
      advanced: [
        "يتطلب اكتساب مهارة الكتابة ممارسة متسقة واهتمامًا بوضع الأصابع بشكل صحيح على لوحة المفاتيح.",
        "تطوير الذاكرة العضلية من خلال التمارين المتكررة أمر ضروري لتحقيق الكتابة بسرعة عالية دون النظر إلى المفاتيح.",
        "يمكن للكتاب المحترفين غالبًا الوصول إلى سرعات تزيد عن 100 كلمة في الدقيقة مع دقة شبه مثالية بعد سنوات من الممارسة المخصصة.",
      ],
    },
  },
}

export function WritingGame() {
  const [contentType, setContentType] = useState<ContentType>("words")
  const [level, setLevel] = useState<Level>("beginner")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [mistakes, setMistakes] = useState(0)
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [correctChars, setCorrectChars] = useState(0)
  const [totalChars, setTotalChars] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [showCursor, setShowCursor] = useState(true)
  const [shakingError, setShakingError] = useState(false)
  const [completedItems, setCompletedItems] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { user } = useAuth()
  const { t, currentLanguage } = useLanguage()

  // Get current content based on type, level and language
  const getCurrentContent = () => {
    return gameContent[currentLanguage as keyof typeof gameContent][contentType][level]
  }

  // Get current item to type
  const getCurrentItem = () => {
    const content = getCurrentContent()
    return content[currentItemIndex % content.length]
  }

  // Start the game
  const startGame = () => {
    setGameActive(true)
    setCurrentIndex(0)
    setCurrentItemIndex(0)
    setUserInput("")
    setMistakes(0)
    setScore(0)
    setTimeLeft(60)
    setCorrectChars(0)
    setTotalChars(0)
    setWpm(0)
    setAccuracy(100)
    setCompletedItems(0)

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

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!gameActive) return

    const input = e.target.value
    setUserInput(input)

    const currentItem = getCurrentItem()
    const targetChar = contentType === "letters" ? currentItem : currentItem.charAt(currentIndex)
    const inputChar = input.charAt(input.length - 1)

    // For letters mode, check the whole input
    if (contentType === "letters") {
      if (input === currentItem) {
        // Correct letter
        setIsCorrect(true)
        setCorrectChars((prev) => prev + 1)
        setTotalChars((prev) => prev + 1)
        setScore((prev) => prev + 10)

        // Move to next letter
        setTimeout(() => {
          setUserInput("")
          setCurrentItemIndex((prev) => prev + 1)
          setCompletedItems((prev) => prev + 1)
        }, 300)
      } else if (input.length > 0) {
        // Incorrect letter
        setIsCorrect(false)
        setMistakes((prev) => prev + 1)
        setTotalChars((prev) => prev + 1)
        setShakingError(true)
        setTimeout(() => setShakingError(false), 500)
      }
    }
    // For words and sentences, check character by character
    else {
      if (input.length > 0 && input.charAt(input.length - 1) === targetChar) {
        // Correct character
        setIsCorrect(true)
        setCorrectChars((prev) => prev + 1)
        setTotalChars((prev) => prev + 1)

        // If completed the current word/sentence
        if (input.length === currentItem.length) {
          setScore((prev) => prev + (contentType === "words" ? 10 : 30))
          setCompletedItems((prev) => prev + 1)

          // Move to next word/sentence
          setTimeout(() => {
            setUserInput("")
            setCurrentIndex(0)
            setCurrentItemIndex((prev) => prev + 1)
          }, 300)
        } else {
          setCurrentIndex((prev) => prev + 1)
        }
      } else if (input.length > 0 && input.charAt(input.length - 1) !== targetChar) {
        // Incorrect character
        setIsCorrect(false)
        setMistakes((prev) => prev + 1)
        setTotalChars((prev) => prev + 1)
        setShakingError(true)
        setTimeout(() => setShakingError(false), 500)
      }
    }
  }

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

  // Blinking cursor effect
  useEffect(() => {
    if (!gameActive) return

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [gameActive])

  // Focus input when game starts
  useEffect(() => {
    if (gameActive && inputRef.current) {
      inputRef.current.focus()
    }
  }, [gameActive, contentType, level, currentItemIndex])

  // Render the current item with highlighting for typed characters
  const renderCurrentItem = () => {
    const currentItem = getCurrentItem()

    if (contentType === "letters") {
      return <div className="text-4xl font-bold flex justify-center items-center h-20">{currentItem}</div>
    }

    return (
      <div
        className={`text-2xl font-medium ${contentType === "sentences" ? "text-start" : "text-center"} leading-relaxed`}
      >
        {currentItem.split("").map((char, index) => (
          <span
            key={index}
            className={`${
              index < currentIndex
                ? "text-green-500 dark:text-green-400"
                : index === currentIndex
                  ? "bg-orange-500/20 border-b-2 border-orange-500"
                  : "text-muted-foreground"
            } ${showCursor && index === currentIndex ? "animate-pulse" : ""}`}
          >
            {char}
          </span>
        ))}
      </div>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{t(contentType)}</CardTitle>
          <div className="flex gap-4 text-sm">
            <div>
              {t("score")}: {score}
            </div>
            <div>
              {t("completed")}: {completedItems}
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

        <div className="p-6 space-y-6">
          {!gameActive ? (
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
                      <SelectItem value="sentences">{t("sentences")}</SelectItem>
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
                  <li>{t("typingGameInstructions1")}</li>
                  <li>{t("typingGameInstructions2")}</li>
                  <li>{t("typingGameInstructions3")}</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div
                className={`p-6 rounded-lg border-2 ${
                  isCorrect === true
                    ? "border-green-500 bg-green-500/10"
                    : isCorrect === false
                      ? "border-red-500 bg-red-500/10"
                      : "border-orange-500/20 bg-muted/20"
                } transition-colors duration-300`}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentItemIndex}-${currentIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`${shakingError ? "animate-shake" : ""}`}
                  >
                    {renderCurrentItem()}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  className={`w-full p-4 text-xl rounded-lg border-2 bg-background ${
                    isCorrect === true
                      ? "border-green-500"
                      : isCorrect === false
                        ? "border-red-500"
                        : "border-orange-500"
                  } focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300`}
                  placeholder={t("typeHere")}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck="false"
                />

                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex gap-2">
                  {isCorrect === true && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </motion.div>
                  )}

                  {isCorrect === false && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-red-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {t("mistakes")}: {mistakes}
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
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/20">
        <div className="text-center w-full text-sm text-muted-foreground">{t("typingGameFooter")}</div>
      </CardFooter>
    </Card>
  )
}
