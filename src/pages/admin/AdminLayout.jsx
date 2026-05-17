import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AdminLogin from './AdminLogin'

const NAV = [
  {
    to: '/admin/matches', label: '試合管理',
    icon: <path d="M8 21h8M12 17V21M17 5V3H7v2M5 5v6a7 7 0 0014 0V5H5z" />,
  },
  {
    to: '/admin/news', label: 'お知らせ',
    icon: <><path d="M4 5a2 2 0 0 1 2-2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M13 3v5h5M8 13h8M8 17h6"/></>,
  },
  {
    to: '/admin/teams', label: 'チーム',
    icon: <><circle cx="8" cy="9" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M2 20c1-3.5 3.5-5 6-5s5 1.5 6 5M14 20c.5-2.5 2-4 3.5-4s3 1.2 3.5 4"/></>,
  },
]

export default function AdminLayout() {
  const { user, loading, signOut } = useAuth()
  const { pathname } = useLocation()

  if (loading) return (
    <div className="adm-splash">
      <div className="adm-splash-spinner" />
    </div>
  )
  if (!user) return <AdminLogin />

  return (
    <div className="adm-layout">
      {/* サイドバー */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-brand">
          <img src="/logo.png" alt="" className="adm-sidebar-logo" />
          <div>
            <div className="adm-sidebar-name">TSUKUBA CUP</div>
            <div className="adm-sidebar-sub">管理画面</div>
          </div>
        </div>

        <nav className="adm-sidebar-nav">
          {NAV.map(({ to, label, icon }) => (
            <Link key={to} to={to}
              className={`adm-nav-link${pathname.startsWith(to) ? ' active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {icon}
              </svg>
              {label}
            </Link>
          ))}
        </nav>

        <div className="adm-sidebar-foot">
          <div className="adm-user-info">
            <div className="adm-user-email">{user.email}</div>
          </div>
          <button className="adm-signout-btn" onClick={signOut}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            ログアウト
          </button>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main className="adm-main">
        <Outlet />
      </main>
    </div>
  )
}
