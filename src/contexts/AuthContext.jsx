import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null)
  const [role, setRole]         = useState(null) // admin | match_staff | pr_staff
  const [loading, setLoading]   = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      await handleSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, session) => {
      await handleSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSession(session) {
    if (!session) { setUser(null); setRole(null); return }
    const email = session.user.email ?? ''

    // organizersテーブルで権限チェック（登録されていればログイン許可）
    const { data: org } = await supabase
      .from('organizers').select('role').eq('email', email).single()

    if (!org) {
      setAuthError('アクセス権限がありません。管理者に連絡してください。')
      await supabase.auth.signOut()
      setUser(null)
      setRole(null)
    } else {
      setUser(session.user)
      setRole(org.role)
      setAuthError(null)
    }
  }

  async function signInWithGoogle() {
    setAuthError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/admin` },
    })
    if (error) setAuthError(error.message)
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, authError, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
