export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="hero-status">
            <span className="dot"></span>
            開催中 · 5月10日 - 6月2日
          </div>
          <h1 className="hero-title">TSUKUBA<br />CUP 2026</h1>
          <div className="hero-tag">
            <span>全力で、楽しんで、最高の夏にしよう。</span>
            <span className="script">Enjoy Futsal!</span>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="label">Teams</div>
              <div className="value num">16<span className="unit">チーム</span></div>
            </div>
            <div className="hero-stat">
              <div className="label">Matches</div>
              <div className="value num">32<span className="unit">試合</span></div>
            </div>
            <div className="hero-stat">
              <div className="label">Category</div>
              <div className="value">男子 / 女子</div>
            </div>
          </div>
          <div className="hero-actions">
            <a href="#matches" className="btn btn-primary">
              試合・結果を見る
              <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a href="#about" className="btn btn-ghost">
              大会について
              <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
          <a href="#" className="hero-insta">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
            Instagram
            <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
        <div className="hero-media" aria-hidden="true">
          <div className="grid-bg"></div>
          <svg className="court-svg" viewBox="0 0 800 360" preserveAspectRatio="none" fill="none">
            <defs>
              <linearGradient id="lineFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.5" stopColor="#fff" stopOpacity="0.18" />
                <stop offset="1" stopColor="#fff" stopOpacity="0.42" />
              </linearGradient>
            </defs>
            <path d="M 60 360 L 740 360 L 600 60 L 200 60 Z" stroke="url(#lineFade)" strokeWidth="1.2" />
            <path d="M 130 210 L 670 210" stroke="url(#lineFade)" strokeWidth="1.1" />
            <ellipse cx="400" cy="210" rx="70" ry="14" stroke="url(#lineFade)" strokeWidth="1.1" />
            <path d="M 250 360 Q 400 290 550 360" stroke="url(#lineFade)" strokeWidth="1.1" />
            <path d="M 300 60 L 240 360" stroke="url(#lineFade)" strokeWidth="0.6" opacity="0.5" />
            <path d="M 500 60 L 560 360" stroke="url(#lineFade)" strokeWidth="0.6" opacity="0.5" />
          </svg>

          <div className="glow"></div>

          <svg className="ball-svg" viewBox="0 0 200 200" fill="none">
            <defs>
              <radialGradient id="ballLight" cx="0.32" cy="0.28" r="0.85">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="0.55" stopColor="#efe8fb" />
                <stop offset="0.9" stopColor="#a695c9" />
                <stop offset="1" stopColor="#5a4980" />
              </radialGradient>
              <radialGradient id="ballShade" cx="0.7" cy="0.7" r="0.7">
                <stop offset="0" stopColor="#000" stopOpacity="0" />
                <stop offset="1" stopColor="#1a1136" stopOpacity="0.55" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="92" fill="url(#ballLight)" />
            <circle cx="100" cy="100" r="92" fill="url(#ballShade)" />
            <g fill="#1f1640" stroke="#0f0a26" strokeWidth="1">
              <polygon points="100,52 124,69 115,97 85,97 76,69" />
              <polygon points="42,98 64,84 78,105 65,128 44,118" />
              <polygon points="158,98 156,118 135,128 122,105 136,84" />
              <polygon points="100,140 122,148 130,170 100,178 70,170 78,148" />
            </g>
            <g stroke="#2a1f5a" strokeWidth="1" fill="none" opacity="0.65">
              <path d="M76 69 L42 98" />
              <path d="M124 69 L158 98" />
              <path d="M85 97 L78 148" />
              <path d="M115 97 L122 148" />
              <path d="M65 128 L78 148" />
              <path d="M135 128 L122 148" />
            </g>
            <ellipse cx="72" cy="62" rx="22" ry="10" fill="#fff" opacity="0.45" />
          </svg>

          <div className="badge-corner">
            <span className="dot"></span>
            開催中
          </div>
        </div>
      </div>
    </section>
  )
}
