import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, isAllowedEmail, ALLOWED_DOMAINS } from '../lib/supabase'
import type { Profile } from '../lib/types'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signUp(email: string, password: string, displayName: string) {
    if (!isAllowedEmail(email)) {
      throw new Error(
        `Only ${ALLOWED_DOMAINS.map(d => `@${d}`).join(' and ')} email addresses are allowed to register.`
      )
    }

    // Step 1: Create auth user
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw new Error(`Sign up failed: ${error.message}`)
    if (!data.user) throw new Error('Sign up failed: no user returned')

    // Step 2: If we got a session, the client will use it automatically.
    // If not (email confirmation still on), sign in explicitly.
    if (!data.session) {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) throw new Error(`Auto sign-in failed: ${signInError.message}`)
    }

    // Step 3: Create profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      email,
      display_name: displayName,
      avatar_url: null,
      bio: null,
    })
    if (profileError) throw new Error(`Profile creation failed: ${profileError.message}`)
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
