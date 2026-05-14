import { useState } from 'react'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <svg className="brand-crest" viewBox="0 0 44 44" aria-hidden="true">
              <defs>
                <linearGradient id="crestG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#7c3aed" />
                  <stop offset="1" stopColor="#4c1d95" />
                </linearGradient>
              </defs>
              <path d="M22 2 L40 8 V22 C40 32 32 39 22 42 C12 39 4 32 4 22 V8 Z" fill="url(#crestG)" />
              <path d="M22 12 L28 22 L22 32 L16 22 Z" fill="#fff" opacity="0.95" />
              <circle cx="22" cy="22" r="2.4" fill="#4c1d95" />
            </svg>
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
