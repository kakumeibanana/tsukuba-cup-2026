import { useState } from 'react'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <img src="/logo.png" alt="" className="brand-crest" />
            <div className="brand-text">
              <div className="name">TSUKUBA CUP 2026</div>
              <div className="sub">筑波大学附属高校 フットサル大会</div>
            </div>
          </div>
          <nav className="nav" aria-label="メインメニュー">
            <a href="#matches" className="active">試合・結果</a>
            <a href="#ranking">順位・ランキング</a>
            <a href="#teams">チーム</a>
            <a href="#about">大会について</a>
          </nav>
          <button className="menu-btn" aria-label="メニューを開く" onClick={() => setOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile nav drawer */}
      <div className={`mobile-nav${open ? ' open' : ''}`} aria-hidden={!open}>
        <div className="mobile-nav-backdrop" onClick={() => setOpen(false)} />
        <div className="mobile-nav-drawer">
          <button className="mobile-nav-close" aria-label="メニューを閉じる" onClick={() => setOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <a href="#matches" onClick={() => setOpen(false)}>試合・結果</a>
          <a href="#ranking" onClick={() => setOpen(false)}>順位・ランキング</a>
          <a href="#teams" onClick={() => setOpen(false)}>チーム</a>
          <a href="#about" onClick={() => setOpen(false)}>大会について</a>
        </div>
      </div>
    </>
  )
}
