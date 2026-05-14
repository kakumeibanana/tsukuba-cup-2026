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
          <img className="hero-photo" src="/futsal-image.png" alt="" />
          <div className="hero-media-overlay"></div>
          <div className="grid-bg"></div>
        </div>
      </div>
    </section>
  )
}
