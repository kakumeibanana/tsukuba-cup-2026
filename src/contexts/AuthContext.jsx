import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)
const ALLOWED_DOMAIN = '@sgh-tsukuba.org'

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null)
  const [loading, setLoading]   = useState(true)
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
    if (!session) { setUser(null); return }
    const email = session.user.email ?? ''
    if (!email.endsWith(ALLOWED_DOMAIN)) {
      setAuthError(`${ALLOWED_DOMAIN} のアカウントのみアクセスできます`)
      await supabase.auth.signOut()
      setUser(null)
    } else {
      setUser(session.user)
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
  }

  return (
    <AuthContext.Provider value={{ user, loading, authError, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
