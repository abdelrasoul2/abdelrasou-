"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AdUnit } from "@/components/ad-unit"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { user, signUp, isLoading } = useAuth()
  const { t, dir } = useLanguage()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      const { error: signUpError, user } = await signUp(email, password, username || undefined)

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (user) {
        setSuccess("Account created successfully! Redirecting to home page...")
      }
    } catch (err) {
      console.error("Signup error:", err)
      setError("An unexpected error occurred. Please try again.")
    }
  }

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col" dir={dir}>
      <div className="flex flex-1 items-center justify-center bg-muted/5 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Ad Unit above signup form with explicit dimensions */}
          <div className="mb-6">
            <AdUnit
              slot="3456789012"
              width="100%"
              height="90px"
              format="horizontal"
              className="mx-auto bg-muted/20 rounded-lg"
            />
          </div>

          <Card className="border-orange-500/20">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">{t("createAccountTitle")}</CardTitle>
              <CardDescription>{t("createAccountDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="mb-4 border-green-500 text-green-500">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">
                    {t("emailAddress")}
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium">
                    {t("username")}
                  </label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium">
                    {t("password")}
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium">
                    {t("confirmPassword")}
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                  {isLoading ? "..." : t("signUp")}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="text-sm text-center">
                {t("alreadyHaveAccount")}{" "}
                <Link href="/login" className="font-medium text-orange-500 hover:text-orange-600">
                  {t("signIn")}
                </Link>
              </div>
            </CardFooter>
          </Card>

          {/* Ad Unit below signup form with explicit dimensions */}
          <div className="mt-6">
            <AdUnit
              slot="4567890123"
              width="100%"
              height="250px"
              format="rectangle"
              className="mx-auto bg-muted/20 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
