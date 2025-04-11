"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { getUserGameSessions } from "@/lib/game-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BarChart, LineChart, PieChart, Activity, Users, Clock, Award, LogOut } from "lucide-react"
import { Footer } from "@/components/footer"
import { AdUnit } from "@/components/ad-unit"

interface GameStats {
  totalGames: number
  averageWpm: number
  averageAccuracy: number
  bestWpm: number
  totalTimePlayed: number // in minutes
  recentGames: {
    date: string
    wpm: number
    accuracy: number
  }[]
}

export default function DashboardPage() {
  const { user, profile, isLoading, signOut } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<GameStats>({
    totalGames: 0,
    averageWpm: 0,
    averageAccuracy: 0,
    bestWpm: 0,
    totalTimePlayed: 0,
    recentGames: [],
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (user) {
      // Fetch user stats
      const fetchStats = async () => {
        try {
          const gameSessions = await getUserGameSessions(user.id)

          if (gameSessions && gameSessions.length > 0) {
            const totalGames = gameSessions.length
            const totalWpm = gameSessions.reduce((sum, game) => sum + (game.words_per_minute || 0), 0)
            const totalAccuracy = gameSessions.reduce((sum, game) => sum + (game.accuracy || 0), 0)
            const bestWpm = Math.max(...gameSessions.map((game) => game.words_per_minute || 0))
            const totalTime = gameSessions.reduce((sum, game) => sum + (game.duration_seconds || 0), 0) / 60

            const recentGames = gameSessions.slice(0, 10).map((game) => ({
              date: new Date(game.created_at || Date.now()).toLocaleDateString(),
              wpm: game.words_per_minute || 0,
              accuracy: game.accuracy || 0,
            }))

            setStats({
              totalGames,
              averageWpm: totalGames > 0 ? Math.round(totalWpm / totalGames) : 0,
              averageAccuracy: totalGames > 0 ? Math.round(totalAccuracy / totalGames) : 0,
              bestWpm,
              totalTimePlayed: Math.round(totalTime),
              recentGames,
            })
          }
        } catch (error) {
          console.error("Error fetching stats:", error)
        }
      }

      fetchStats()
    }
  }, [user, isLoading, router])

  const handleSignOut = async () => {
    await signOut()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <img src="/placeholder-logo.svg" alt="Typing Game Logo" className="h-8 w-8" />
            <span className="font-bold text-xl">TypingMaster</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {profile?.username || user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-6 flex-1">
        <Tabs defaultValue="overview">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              {profile?.is_admin && <TabsTrigger value="admin">Admin</TabsTrigger>}
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Games</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalGames}</div>
                  <p className="text-xs text-muted-foreground">Games played</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average WPM</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.averageWpm}</div>
                  <p className="text-xs text-muted-foreground">Words per minute</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Best WPM</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.bestWpm}</div>
                  <p className="text-xs text-muted-foreground">Personal record</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.averageAccuracy}%</div>
                  <p className="text-xs text-muted-foreground">Average accuracy</p>
                </CardContent>
              </Card>
            </div>

            {/* Ad Unit in dashboard */}
            <div className="my-6">
              <AdUnit
                slot="5678901234"
                className="mx-auto max-w-4xl h-[250px] bg-muted/20 flex items-center justify-center rounded-lg"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                  <CardDescription>Your typing performance over the last 10 games</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    {stats.recentGames.length > 0 ? (
                      <div className="w-full h-full">
                        {/* Placeholder for chart - in a real app, use a chart library */}
                        <div className="w-full h-full flex items-center justify-center">
                          <LineChart className="h-16 w-16" />
                          <span className="ml-2">Performance Chart</span>
                        </div>
                      </div>
                    ) : (
                      <p>Play some games to see your performance chart</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Games</CardTitle>
                  <CardDescription>Your most recent typing sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.recentGames.length > 0 ? (
                    <div className="space-y-2">
                      {stats.recentGames.slice(0, 5).map((game, i) => (
                        <div key={i} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="text-sm font-medium">{game.date}</p>
                            <p className="text-xs text-muted-foreground">Accuracy: {game.accuracy}%</p>
                          </div>
                          <div className="text-sm font-bold">{game.wpm} WPM</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No recent games</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center mt-8">
              <Button size="lg" onClick={() => router.push("/game")}>
                Start New Game
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Statistics</CardTitle>
                <CardDescription>Your typing performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Total Time Played</h3>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span className="text-xl font-bold">{stats.totalTimePlayed} minutes</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Average WPM</h3>
                    <div className="flex items-center">
                      <BarChart className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span className="text-xl font-bold">{stats.averageWpm} WPM</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Average Accuracy</h3>
                    <div className="flex items-center">
                      <PieChart className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span className="text-xl font-bold">{stats.averageAccuracy}%</span>
                    </div>
                  </div>
                </div>

                <div className="h-80 border rounded-lg p-4">
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <LineChart className="h-16 w-16" />
                    <span className="ml-2">Detailed Statistics Chart</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Your typing milestones and badges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Speed Demon</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <Award className="h-8 w-8 mr-2 text-yellow-500" />
                        <div>
                          <p className="text-xs">Reach 80 WPM</p>
                          <p className="text-xs text-muted-foreground">
                            {stats.bestWpm >= 80 ? "Completed" : `${stats.bestWpm}/80 WPM`}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Accuracy Master</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <Award className="h-8 w-8 mr-2 text-blue-500" />
                        <div>
                          <p className="text-xs">Maintain 95% accuracy</p>
                          <p className="text-xs text-muted-foreground">
                            {stats.averageAccuracy >= 95 ? "Completed" : `${stats.averageAccuracy}/95%`}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Dedicated Typist</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <Award className="h-8 w-8 mr-2 text-green-500" />
                        <div>
                          <p className="text-xs">Complete 50 games</p>
                          <p className="text-xs text-muted-foreground">
                            {stats.totalGames >= 50 ? "Completed" : `${stats.totalGames}/50 games`}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Ad Unit in achievements tab */}
            <div className="my-6">
              <AdUnit
                slot="8901234567"
                className="mx-auto max-w-4xl h-[250px] bg-muted/20 flex items-center justify-center rounded-lg"
              />
            </div>
          </TabsContent>

          {profile?.is_admin && (
            <TabsContent value="admin" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Dashboard</CardTitle>
                  <CardDescription>Manage users and game settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">User Management</h3>
                    <div className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>Manage Users</span>
                      </div>
                      <Button size="sm">View Users</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Game Settings</h3>
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Word Lists</span>
                        <Button size="sm">Edit Lists</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Difficulty Levels</span>
                        <Button size="sm">Configure</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
