import { supabase } from "./supabase"

export interface GameSession {
  id?: string
  user_id: string
  words_per_minute: number
  accuracy: number
  total_characters: number
  correct_characters: number
  duration_seconds: number
  completed: boolean
}

export async function saveGameSession(session: Omit<GameSession, "id">) {
  const { data, error } = await supabase.from("game_sessions").insert(session).select().single()

  if (error) {
    console.error("Error saving game session:", error)
    throw error
  }

  return data
}

export async function getUserGameSessions(userId: string) {
  const { data, error } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user game sessions:", error)
    throw error
  }

  return data as GameSession[]
}

export async function getWordList(listName: string) {
  const { data: wordList, error: wordListError } = await supabase
    .from("word_lists")
    .select("id")
    .eq("name", listName)
    .single()

  if (wordListError) {
    console.error("Error fetching word list:", wordListError)
    throw wordListError
  }

  const { data: words, error: wordsError } = await supabase.from("words").select("word").eq("word_list_id", wordList.id)

  if (wordsError) {
    console.error("Error fetching words:", wordsError)
    throw wordsError
  }

  return words.map((w) => w.word)
}
