import { Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function isInAppBrowser() {
  const ua = navigator.userAgent || ''
  return /Line|FBAN|FBAV|Instagram|Twitter|Snapchat|MicroMessenger|GSA/i.test(ua)
}

export default function PublicGate() {
  const { user, loading, authError, signInWithGoogle } = useAuth()
  const inApp = isInAppBrowser()

  if (loading) {
    return (
      <div className="adm-splash">
        <div className="adm-splash-spinner" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="gate-page">
        <div className="gate-card">
          <div className="gate-brand">
            <div className="gate-title">TSUKUBA CUP 2026</div>
            <div className="gate-sub">筑波大学附属高等学校 フットサル大会</div>
          </div>

          {inApp ? (
            <div style={{
              background: '#fff7ed', border: '1px solid #fed7aa',
              borderRadius: 12, padding: '14px 16px', marginBottom: 16, textAlign: 'left'
            }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#c2410c', marginBottom: 6 }}>
                ⚠️ アプリ内ブラウザでは開けません
              </div>
              <div style={{ fontSize: 13, color: '#7c2d12', lineHeight: 1.6 }}>
                LINEやInstagramのブラウザではGoogleログインがブロックされます。<br />
                右上の「…」または「Safari/Chromeで開く」をタップしてください。
              </div>
            </div>
          ) : (
            <>
              {authError && (
                <div className="adm-alert adm-alert-error">{authError}</div>
              )}
              <button
                className="adm-google-btn"
                onClick={() => signInWithGoogle(`${window.location.origin}/`)}
              >
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                </svg>
                Google でサインイン
              </button>
            </>
          )}

          <p className="adm-login-note">@sgh-tsukuba.org のアカウントのみアクセスできます</p>
        </div>
      </div>
    )
  }

  return <Outlet />
}
