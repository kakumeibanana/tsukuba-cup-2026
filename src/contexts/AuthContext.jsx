import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null)
  const [role, setRole]         = useState(null) // admin | match_staff | pr_staff
  const [loading, setLoading]   = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    // 初回セッション確認
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      await handleSession(session)
      setLoading(false)
    })

    // 以降の認証状態変化を監視（onAuthStateChange は async にしない）
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      handleSession(session).catch(() => {})
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSession(session) {
    if (!session) {
      setUser(null)
      setRole(null)
      return
    }
    const email = session.user.email ?? ''

    const { data: org, error } = await supabase
      .from('organizers')
      .select('role')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // organizers に未登録 → アクセス拒否
        setAuthError('アクセス権限がありません。管理者に連絡してください。')
        await supabase.auth.signOut()
        setUser(null)
        setRole(null)
      } else {
        // ネットワークエラーなど → ログアウトせず一時エラーとして表示
        console.error('[AuthContext] organizers query error:', error)
        setAuthError(`接続エラーが発生しました（${error.message}）。再読み込みしてください。`)
      }
      return
    }

    // 正常
    setUser(session.user)
    setRole(org?.role ?? 'match_staff')
    setAuthError(null)
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
