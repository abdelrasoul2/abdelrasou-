"use client"

import type React from "react"
import { createContext, useContext, useEffect } from "react"
import { useAuth } from "./auth-context"

// Define translations
const translations = {
  en: {
    // Navigation
    home: "Home",
    play: "Play",
    dashboard: "Dashboard",
    about: "About",
    signIn: "Sign in",
    signUp: "Sign up",
    signOut: "Sign out",
    welcome: "Welcome",

    // Home page
    improveTyping: "Improve Your Typing Skills with Fun Games",
    typingMasterDesc:
      "TypingMaster helps you become a faster and more accurate typist through interactive games and challenges. Track your progress and compete with others.",
    startTyping: "Start Typing",
    createAccount: "Create Account",
    features: "Features",
    featuresDesc: "Everything you need to improve your typing skills",
    interactiveGames: "Interactive Games",
    interactiveGamesDesc: "Fun and engaging typing games that make practice enjoyable",
    progressTracking: "Progress Tracking",
    progressTrackingDesc: "Monitor your WPM, accuracy, and improvement over time",
    achievements: "Achievements",
    achievementsDesc: "Earn badges and rewards as you reach typing milestones",
    readyToImprove: "Ready to Improve Your Typing?",
    readyToImproveDesc: "Start playing now and see how quickly your skills improve",

    // Game
    letterBubbles: "Letter Bubbles",
    letterBubblesDesc:
      "Type the letters that appear in bubbles. Each correct letter pops the bubble and earns you points. The letters explode when typed correctly!",
    fallingWords: "Falling Words",
    fallingWordsDesc:
      "Type the words before they reach the bottom of the screen. The faster you type, the higher your score!",
    writingGame: "Writing Game",
    writingGameDesc:
      "Type the letters, words, or sentences that appear on the screen. Practice your typing skills with different difficulty levels.",
    bubbleShooter: "Bubble Shooter",
    bubbleShooterDesc:
      "Type the letters or words in the bubbles to pop them. Build combos for bonus points. The bubbles move around the screen!",
    comingSoon: "Coming Soon!",
    score: "Score",
    level: "Level",
    wpm: "WPM",
    accuracy: "Accuracy",
    time: "Time",
    gameOver: "Game Over!",
    playAgain: "Play Again",
    startGame: "Start Game",
    endGame: "End Game",
    combo: "Combo",
    comboBonus: "Combo Bonus",
    speedIncreased: "Speed Increased!",
    gameSpeedingUp: "The game is speeding up!",
    bubblesPopped: "Bubbles Popped",
    wordsCompleted: "Words Completed",
    typeLetters: "Type the letters...",
    typeWords: "Type the words...",
    typeTheWords: "Type the falling words...",

    // Writing Game
    letters: "Letters",
    words: "Words",
    sentences: "Sentences",
    contentType: "Content Type",
    selectContentType: "Select content type",
    selectLevel: "Select level",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    howToPlay: "How to Play",
    typingGameInstructions1: "Type the text exactly as it appears on the screen.",
    typingGameInstructions2: "Focus on accuracy first, then speed.",
    typingGameInstructions3: "The game will end after 60 seconds.",
    fallingWordsInstructions1: "Type the words before they reach the bottom of the screen.",
    fallingWordsInstructions2: "Build combos by typing words correctly in succession.",
    fallingWordsInstructions3: "The game gets faster as you progress.",
    bubbleShooterInstructions1: "Type the letters or words in the bubbles to pop them.",
    bubbleShooterInstructions2: "Build combos by popping bubbles in succession.",
    bubbleShooterInstructions3: "The bubbles move around the screen and new ones appear over time.",
    typeHere: "Type here...",
    mistakes: "Mistakes",
    completed: "Completed",
    typingGameFooter: "Practice regularly to improve your typing speed and accuracy!",

    // Auth
    emailAddress: "Email address",
    password: "Password",
    confirmPassword: "Confirm Password",
    username: "Username (optional)",
    createAccountTitle: "Create an account",
    createAccountDesc: "Enter your details to sign up",
    signInTitle: "Sign in to your account",
    signInDesc: "Enter your email and password to sign in",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",

    // Footer
    developedBy: "Developed by abdelrassoul",
    allRightsReserved: "All rights reserved.",
    privacy: "Privacy",
    terms: "Terms",
    contact: "Contact",
  },
  ar: {
    // Navigation
    home: "الرئيسية",
    play: "العب",
    dashboard: "لوحة التحكم",
    about: "حول",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    signOut: "تسجيل الخروج",
    welcome: "مرحباً",

    // Home page
    improveTyping: "حسّن مهارات الكتابة لديك مع ألعاب ممتعة",
    typingMasterDesc:
      "يساعدك TypingMaster على أن تصبح كاتبًا أسرع وأكثر دقة من خلال الألعاب والتحديات التفاعلية. تتبع تقدمك وتنافس مع الآخرين.",
    startTyping: "ابدأ الكتابة",
    createAccount: "إنشاء حساب",
    features: "المميزات",
    featuresDesc: "كل ما تحتاجه لتحسين مهارات الكتابة لديك",
    interactiveGames: "ألعاب تفاعلية",
    interactiveGamesDesc: "ألعاب كتابة ممتعة وجذابة تجعل الممارسة ممتعة",
    progressTracking: "تتبع التقدم",
    progressTrackingDesc: "راقب سرعة الكتابة والدقة والتحسن مع مرور الوقت",
    achievements: "الإنجازات",
    achievementsDesc: "اكسب شارات ومكافآت عند الوصول إلى معالم الكتابة",
    readyToImprove: "هل أنت مستعد لتحسين الكتابة لديك؟",
    readyToImproveDesc: "ابدأ اللعب الآن وشاهد مدى سرعة تحسن مهاراتك",

    // Game
    letterBubbles: "فقاعات الحروف",
    letterBubblesDesc:
      "اكتب الحروف التي تظهر في الفقاعات. كل حرف صحيح يفجر الفقاعة ويمنحك نقاطًا. الحروف تنفجر عند كتابتها بشكل صحيح!",
    fallingWords: "الكلمات المتساقطة",
    fallingWordsDesc: "اكتب الكلمات قبل أن تصل إلى أسفل الشاشة. كلما كتبت بشكل أسرع، كلما ارتفعت نقاطك!",
    writingGame: "لعبة الكتابة",
    writingGameDesc:
      "اكتب الحروف أو الكلمات أو الجمل التي تظهر على الشاشة. مارس مهارات الكتابة لديك بمستويات صعوبة مختلفة.",
    bubbleShooter: "قاذف الفقاعات",
    bubbleShooterDesc:
      "اكتب الحروف أو الكلمات في الفقاعات لتفجيرها. ابنِ تسلسلات للحصول على نقاط إضافية. الفقاعات تتحرك حول الشاشة!",
    comingSoon: "قريباً!",
    score: "النقاط",
    level: "المستوى",
    wpm: "كلمة/دقيقة",
    accuracy: "الدقة",
    time: "الوقت",
    gameOver: "انتهت اللعبة!",
    playAgain: "العب مرة أخرى",
    startGame: "ابدأ اللعبة",
    endGame: "إنهاء اللعبة",
    combo: "تسلسل",
    comboBonus: "مكافأة التسلسل",
    speedIncreased: "زادت السرعة!",
    gameSpeedingUp: "اللعبة تتسارع!",
    bubblesPopped: "الفقاعات المفجرة",
    wordsCompleted: "الكلمات المكتملة",
    typeLetters: "اكتب الحروف...",
    typeWords: "اكتب الكلمات...",
    typeTheWords: "اكتب الكلمات المتساقطة...",

    // Writing Game
    letters: "الحروف",
    words: "الكلمات",
    sentences: "الجمل",
    contentType: "نوع المحتوى",
    selectContentType: "اختر نوع المحتوى",
    selectLevel: "اختر المستوى",
    beginner: "مبتدئ",
    intermediate: "متوسط",
    advanced: "متقدم",
    howToPlay: "كيفية اللعب",
    typingGameInstructions1: "اكتب النص تمامًا كما يظهر على الشاشة.",
    typingGameInstructions2: "ركز على الدقة أولاً، ثم السرعة.",
    typingGameInstructions3: "ستنتهي اللعبة بعد 60 ثانية.",
    fallingWordsInstructions1: "اكتب الكلمات قبل أن تصل إلى أسفل الشاشة.",
    fallingWordsInstructions2: "ابنِ تسلسلات بكتابة الكلمات بشكل صحيح بالتتابع.",
    fallingWordsInstructions3: "تزداد سرعة اللعبة مع تقدمك.",
    bubbleShooterInstructions1: "اكتب الحروف أو الكلمات في الفقاعات لتفجيرها.",
    bubbleShooterInstructions2: "ابنِ تسلسلات بتفجير الفقاعات بالتتابع.",
    bubbleShooterInstructions3: "تتحرك الفقاعات حول الشاشة وتظهر فقاعات جديدة مع مرور الوقت.",
    typeHere: "اكتب هنا...",
    mistakes: "الأخطاء",
    completed: "المكتملة",
    typingGameFooter: "مارس بانتظام لتحسين سرعة الكتابة والدقة!",

    // Auth
    emailAddress: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    username: "اسم المستخدم (اختياري)",
    createAccountTitle: "إنشاء حساب",
    createAccountDesc: "أدخل بياناتك للتسجيل",
    signInTitle: "تسجيل الدخول إلى حسابك",
    signInDesc: "أدخل بريدك الإلكتروني وكلمة المرور لتسجيل الدخول",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    dontHaveAccount: "ليس لديك حساب؟",

    // Footer
    developedBy: "تم التطوير بواسطة عبدالرسول",
    allRightsReserved: "جميع الحقوق محفوظة.",
    privacy: "الخصوصية",
    terms: "الشروط",
    contact: "اتصل بنا",
  },
}

type LanguageContextType = {
  t: (key: string) => string
  currentLanguage: string
  changeLanguage: (lang: string) => void
  dir: string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { language, setLanguage } = useAuth()

  // Get translation for a key
  const t = (key: string) => {
    return translations[language as keyof typeof translations]?.[key as keyof (typeof translations)["en"]] || key
  }

  // Change language
  const changeLanguage = async (lang: string) => {
    await setLanguage(lang)
  }

  // Get text direction based on language
  const dir = language === "ar" ? "rtl" : "ltr"

  // Set document direction
  useEffect(() => {
    document.documentElement.dir = dir
    document.documentElement.lang = language
  }, [language, dir])

  const value = {
    t,
    currentLanguage: language,
    changeLanguage,
    dir,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
