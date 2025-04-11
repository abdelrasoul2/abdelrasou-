"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export function Footer() {
  const { t, currentLanguage, changeLanguage } = useLanguage()

  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <div className="flex items-center gap-2">
            <span className="font-bold">TypingMaster</span>
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-start">
            &copy; {new Date().getFullYear()} TypingMaster. {t("allRightsReserved")}
          </p>
          <p className="text-sm text-orange-500 font-medium">{t("developedBy")}</p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <nav className="flex gap-4 md:gap-6">
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-orange-500">
              {t("about")}
            </Link>
            <Link href="/privacy" className="text-sm font-medium text-muted-foreground hover:text-orange-500">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="text-sm font-medium text-muted-foreground hover:text-orange-500">
              {t("terms")}
            </Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-orange-500">
              {t("contact")}
            </Link>
          </nav>
          <div className="flex gap-2">
            <button
              onClick={() => changeLanguage("ar")}
              className={`px-2 py-1 text-xs rounded ${
                currentLanguage === "ar" ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              العربية
            </button>
            <button
              onClick={() => changeLanguage("en")}
              className={`px-2 py-1 text-xs rounded ${
                currentLanguage === "en" ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
