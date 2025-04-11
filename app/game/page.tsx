"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { BubbleShooterGame } from "@/components/bubble-shooter-game"
import { WritingGame } from "@/components/writing-game"
import { FallingWordsGame } from "@/components/falling-words-game"
import { Footer } from "@/components/footer"
import { AdUnit } from "@/components/ad-unit"

export default function GamePage() {
  const { user } = useAuth()
  const { t, dir } = useLanguage()
  const router = useRouter()
  const [gameMode, setGameMode] = useState<"bubbles" | "writing" | "falling">("writing")

  return (
    <div className="flex flex-col min-h-screen" dir={dir}>
      <div className="container py-6 flex-1">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="gap-1 hover:text-orange-500">
            <ArrowLeft className="h-4 w-4" />
            {t("home")}
          </Button>
          <div className="flex items-center gap-2">
            {user ? (
              <Button size="sm" onClick={() => router.push("/dashboard")} className="bg-orange-500 hover:bg-orange-600">
                {t("dashboard")}
              </Button>
            ) : (
              <Button size="sm" onClick={() => router.push("/login")} className="bg-orange-500  hover:bg-orange-600">
                {t("signIn")}
              </Button>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">TypingMaster</h1>
          <p className="text-muted-foreground">{t("typingMasterDesc")}</p>
        </div>

        {/* Ad Unit before game tabs with fixed dimensions */}
        <div className="mb-8 flex justify-center">
          <div className="w-[728px] h-[90px] max-w-full">
            <AdUnit
              slot="3456789012"
              width={728}
              height={90}
              format="horizontal"
              className="mx-auto bg-muted/20 rounded-lg"
            />
          </div>
        </div>

        <Tabs
          defaultValue="writing"
          value={gameMode}
          onValueChange={(value) => setGameMode(value as "bubbles" | "writing" | "falling")}
          className="space-y-4"
        >
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted/20 p-1">
            <TabsTrigger value="writing" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              {t("writingGame")}
            </TabsTrigger>
            <TabsTrigger value="bubbles" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              {t("bubbleShooter")}
            </TabsTrigger>
            <TabsTrigger value="falling" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              {t("fallingWords")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="writing" className="space-y-4">
            <div className="bg-muted/10 p-4 rounded-lg mb-4 border border-orange-500/20">
              <h2 className="font-medium mb-2">{t("writingGame")}</h2>
              <p className="text-sm text-muted-foreground">{t("writingGameDesc")}</p>
            </div>
            <WritingGame />
          </TabsContent>

          <TabsContent value="bubbles" className="space-y-4">
            <div className="bg-muted/10 p-4 rounded-lg mb-4 border border-orange-500/20">
              <h2 className="font-medium mb-2">{t("bubbleShooter")}</h2>
              <p className="text-sm text-muted-foreground">{t("bubbleShooterDesc")}</p>
            </div>
            <BubbleShooterGame />
          </TabsContent>

          <TabsContent value="falling" className="space-y-4">
            <div className="bg-muted/10 p-4 rounded-lg mb-4 border border-orange-500/20">
              <h2 className="font-medium mb-2">{t("fallingWords")}</h2>
              <p className="text-sm text-muted-foreground">{t("fallingWordsDesc")}</p>
            </div>
            <FallingWordsGame />
          </TabsContent>
        </Tabs>

        {/* Ad Unit after game with fixed dimensions */}
        <div className="mt-8 flex justify-center">
          <div className="w-[300px] h-[250px]">
            <AdUnit
              slot="6789012345"
              width={300}
              height={250}
              format="rectangle"
              className="mx-auto bg-muted/20 rounded-lg"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
