import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)
const ALLOWED_EMAIL = 'sasasout361@sgh-tsukuba.org'

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [role, setRole]       = useState(null) // admin | match_staff | pr_staff
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      handleSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSession(session) {
    if (!session) { setUser(null); setRole(null); return }
    const email = session.user.email ?? ''
    if (email !== ALLOWED_EMAIL) {
      setAuthError('アクセス権限がありません')
      await supabase.auth.signOut()
      setUser(null)
      setRole(null)
    } else {
      setUser(session.user)
      setAuthError(null)
      const { data } = await supabase
        .from('organizers').select('role').eq('email', email).single()
      setRole(data?.role ?? 'admin')
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
