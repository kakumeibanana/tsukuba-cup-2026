import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <img src="/logo.png" alt="" className="brand-crest" />
            <div className="brand-text">
              <div className="name">TSUKUBA CUP 2026</div>
              <div className="sub">筑波大学附属高校 フットサル大会</div>
            </div>
          </Link>
          <nav className="nav" aria-label="メインメニュー">
            <Link to="/matches"   className={pathname === '/matches'   ? 'active' : ''}>試合・結果</Link>
            <Link to="/standings" className={pathname === '/standings' ? 'active' : ''}>順位・ランキング</Link>
            <Link to="/teams"     className={pathname === '/teams'     ? 'active' : ''}>チーム</Link>
            <Link to="/about"     className={pathname === '/about'     ? 'active' : ''}>大会について</Link>
          </nav>
          <button className="menu-btn" aria-label="メニューを開く" onClick={() => setOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
        <div className="header-field-deco" aria-hidden="true" />
      </header>

      <div className={`mobile-nav${open ? ' open' : ''}`} aria-hidden={!open}>
        <div className="mobile-nav-backdrop" onClick={() => setOpen(false)} />
        <div className="mobile-nav-drawer">

          {/* ドロワーヘッダー */}
          <div className="mnav-head">
            <div className="mnav-brand">
              <img src="/logo.png" alt="" className="mnav-logo" />
              <div>
                <div className="mnav-brand-name">TSUKUBA CUP</div>
                <div className="mnav-brand-year">2026 夏</div>
              </div>
            </div>
            <button className="mnav-close" aria-label="メニューを閉じる" onClick={() => setOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ナビリンク */}
          <nav className="mnav-links">
            {[
              { to: '/', label: 'ホーム', icon: <><circle cx="12" cy="10" r="3"/><path d="M12 2L2 9h3v11h5v-5h4v5h5V9h3z" strokeLinejoin="round"/></> },
              { to: '/matches',   label: '試合・結果',     icon: <><path d="M8 21h8M12 17V21M17 5V3H7v2M5 5v6a7 7 0 0014 0V5H5z"/></> },
              { to: '/standings', label: '順位・ランキング', icon: <><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></> },
              { to: '/teams',     label: 'チーム',          icon: <><circle cx="8" cy="9" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M2 20c1-3.5 3.5-5 6-5s5 1.5 6 5M14 20c.5-2.5 2-4 3.5-4s3 1.2 3.5 4"/></> },
              { to: '/about',     label: '大会について',    icon: <><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16v.01" strokeLinecap="round"/></> },
            ].map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className={`mnav-link${pathname === to ? ' active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <span className="mnav-ico">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {icon}
                  </svg>
                </span>
                {label}
                <svg className="mnav-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </Link>
            ))}
          </nav>

          {/* フッター：Instagram */}
          <div className="mnav-foot">
            <a href="https://www.instagram.com/tsukubacup?igsh=d2s5ZzM2dzkzYjZw" target="_blank" rel="noreferrer" className="mnav-insta">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              <span>インスタはこちらから</span>
              <svg style={{marginLeft:'auto',opacity:.45}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </>
  )
}
