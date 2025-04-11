"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase, supabaseAdmin } from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

interface UserProfile {
  id: string
  username: string | null
  is_admin: boolean
  language_preference: string
}

type AuthContextType = {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  isLoading: boolean
  language: string
  setLanguage: (lang: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signUp: (email: string, password: string, username?: string) => Promise<{ error: any | null; user: User | null }>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: any | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [language, setLanguageState] = useState<string>("ar") // Default to Arabic
  const router = useRouter()

  // Fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error fetching user profile:", error)
        return null
      }

      if (data && data.language_preference) {
        setLanguageState(data.language_preference)
      }

      return data as UserProfile
    } catch (error) {
      console.error("Error in fetchUserProfile:", error)
      return null
    }
  }

  // Create user profile if it doesn't exist - using admin client to bypass RLS
  const createUserProfileIfNeeded = async (userId: string, username?: string) => {
    try {
      // Use the admin client to bypass RLS
      const { data, error } = await supabaseAdmin
        .from("user_profiles")
        .insert({
          id: userId,
          username: username || null,
          is_admin: false,
          language_preference: "ar", // Default to Arabic
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating user profile:", error)
        return null
      }

      return data as UserProfile
    } catch (error) {
      console.error("Error in createUserProfileIfNeeded:", error)
      return null
    }
  }

  const setLanguage = async (lang: string) => {
    setLanguageState(lang)
    if (user && profile) {
      await updateProfile({ language_preference: lang })
    }
  }

  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined") return

    // Get session from local storage
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (session) {
          setSession(session)
          setUser(session.user)

          // Fetch user profile
          const userProfile = await fetchUserProfile(session.user.id)
          if (userProfile) {
            setProfile(userProfile)
          } else {
            // Create profile if it doesn't exist
            const newProfile = await createUserProfileIfNeeded(session.user.id)
            setProfile(newProfile)
          }
        }

        setIsLoading(false)

        // Listen for auth changes
        const {
          data: { subscription },
        } = await supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth state changed:", event, session?.user?.id)

          setSession(session)
          setUser(session?.user ?? null)

          if (session?.user) {
            // Fetch user profile
            const userProfile = await fetchUserProfile(session.user.id)
            if (userProfile) {
              setProfile(userProfile)
            } else {
              // Create profile if it doesn't exist
              const newProfile = await createUserProfileIfNeeded(session.user.id)
              setProfile(newProfile)
            }

            // Redirect to home page on sign in
            if (event === "SIGNED_IN") {
              router.push("/")
            }
          } else {
            setProfile(null)
          }

          setIsLoading(false)
        })

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Error in initializeAuth:", error)
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [router])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setIsLoading(false)
        return { error }
      }

      // Successfully signed in
      router.push("/")
      return { error: null }
    } catch (error) {
      console.error("Error in signIn:", error)
      setIsLoading(false)
      return { error }
    }
  }

  const signUp = async (email: string, password: string, username?: string) => {
    setIsLoading(true)
    try {
      // For development purposes, we'll use signUp with auto-confirm
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // This bypasses email confirmation for development
          data: {
            username: username || email.split("@")[0],
          },
        },
      })

      if (error) {
        setIsLoading(false)
        return { error, user: null }
      }

      if (data.user) {
        // Create user profile using admin client to bypass RLS
        await createUserProfileIfNeeded(data.user.id, username)

        // For development, we'll automatically confirm the user
        if (!data.session) {
          // If no session, sign in the user directly (for development only)
          await supabase.auth.signInWithPassword({
            email,
            password,
          })
        }

        router.push("/")
      }

      setIsLoading(false)
      return { error: null, user: data.user }
    } catch (error) {
      console.error("Error in signUp:", error)
      setIsLoading(false)
      return { error, user: null }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return { error: new Error("User not authenticated") }

    try {
      const { error } = await supabase.from("user_profiles").update(data).eq("id", user.id)

      if (!error && profile) {
        setProfile({ ...profile, ...data })
      }

      return { error }
    } catch (error) {
      console.error("Error in updateProfile:", error)
      return { error }
    }
  }

  const value = {
    user,
    session,
    profile,
    isLoading,
    language,
    setLanguage,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
