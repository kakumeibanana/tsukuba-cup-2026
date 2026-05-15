import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import BrandCrest from './BrandCrest.jsx'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <BrandCrest />
            <div className="brand-text">
              <div className="name">TSUKUBA CUP 2026</div>
              <div className="sub">筑波大学附属高校 フットサル大会</div>
            </div>
          </div>
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
          <button className="mobile-nav-close" aria-label="メニューを閉じる" onClick={() => setOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <Link to="/matches"   onClick={() => setOpen(false)}>試合・結果</Link>
          <Link to="/standings" onClick={() => setOpen(false)}>順位・ランキング</Link>
          <Link to="/teams"     onClick={() => setOpen(false)}>チーム</Link>
          <Link to="/about"     onClick={() => setOpen(false)}>大会について</Link>
        </div>
      </div>
    </>
  )
}
