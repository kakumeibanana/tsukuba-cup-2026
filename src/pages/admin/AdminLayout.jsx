import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AdminLogin from './AdminLogin'

const ALL_NAV = [
  {
    to: '/admin/dashboard', label: 'ホーム', roles: ['admin', 'match_staff', 'pr_staff'],
    icon: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  },
  {
    to: '/admin/matches', label: '試合', roles: ['admin', 'match_staff'],
    icon: <path d="M8 21h8M12 17V21M17 5V3H7v2M5 5v6a7 7 0 0014 0V5H5z" />,
  },
  {
    to: '/admin/standings', label: '順位', roles: ['admin', 'match_staff'],
    icon: <><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></>,
  },
  {
    to: '/admin/teams', label: 'チーム', roles: ['admin'],
    icon: <><circle cx="8" cy="9" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M2 20c1-3.5 3.5-5 6-5s5 1.5 6 5M14 20c.5-2.5 2-4 3.5-4s3 1.2 3.5 4"/></>,
  },
  {
    to: '/admin/news', label: 'Posts', roles: ['admin', 'pr_staff'],
    icon: <><path d="M4 5a2 2 0 0 1 2-2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M13 3v5h5"/></>,
  },
  {
    to: '/admin/applications', label: '申込', roles: ['admin'],
    icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></>,
  },
  {
    to: '/admin/more', label: 'More', roles: ['admin', 'match_staff', 'pr_staff'],
    icon: <><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></>,
  },
]

// モバイル底部ナビ: ホーム・試合・チーム(admin)・Posts・More (最大5)
const BOTTOM_NAV_ROLES = {
  admin:       ['dashboard', 'matches', 'applications', 'news', 'more'],
  match_staff: ['dashboard', 'matches', 'more'],
  pr_staff:    ['dashboard', 'news', 'more'],
}

function navIcon(icon) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icon}
    </svg>
  )
}

export default function AdminLayout() {
  const { user, role, loading, signOut } = useAuth()
  const { pathname } = useLocation()

  if (loading) return (
    <div className="adm-splash">
      <div className="adm-splash-spinner" />
    </div>
  )
  if (!user) return <AdminLogin />

  const sidebarNav = ALL_NAV.filter(n => n.roles.includes(role ?? 'admin'))

  const bottomKeys = BOTTOM_NAV_ROLES[role ?? 'admin'] ?? BOTTOM_NAV_ROLES.admin
  const bottomNav  = ALL_NAV.filter(n => bottomKeys.includes(n.to.split('/').pop()))

  return (
    <div className="adm-layout">
      <aside className="adm-sidebar">
        <div className="adm-sidebar-brand">
          <img src="/logo.png" alt="" className="adm-sidebar-logo" />
          <div>
            <div className="adm-sidebar-name">TSUKUBA CUP</div>
            <div className="adm-sidebar-sub">管理画面</div>
          </div>
        </div>
        <nav className="adm-sidebar-nav">
          {sidebarNav.map(({ to, label, icon }) => (
            <Link key={to} to={to}
              className={`adm-nav-link${pathname.startsWith(to) ? ' active' : ''}`}>
              {navIcon(icon)}
              {label}
            </Link>
          ))}
        </nav>
        <div className="adm-sidebar-foot">
          <div className="adm-user-email">{user.email}</div>
          <Link to="/" className="adm-signout-btn" style={{ textDecoration: 'none', marginBottom: 6 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            サイトへ戻る
          </Link>
          <button className="adm-signout-btn" onClick={signOut}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            ログアウト
          </button>
        </div>
      </aside>

      <main className="adm-main">
        <Outlet />
      </main>

      {/* モバイル底部ナビ */}
      <nav className="adm-bottom-nav" style={{ gridTemplateColumns: `repeat(${bottomNav.length}, 1fr)` }}>
        {bottomNav.map(({ to, label, icon }) => (
          <Link key={to} to={to}
            className={`adm-bottom-nav-btn${pathname.startsWith(to) ? ' active' : ''}`}>
            {navIcon(icon)}
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
