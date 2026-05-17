export default function Hero() {
  const today = new Date()
  const start = new Date('2026-06-08')
  const daysLeft = Math.max(0, Math.ceil((start - today) / (1000 * 60 * 60 * 24)))

  return (
    <section className="hero">
      <div className="grid-bg"></div>
      <div className="hero-copy">
        <span className="hero-year-bg" aria-hidden="true">2026</span>
        <h1 className="hero-title">TSUKUBA<br />CUP 2026</h1>
        <div className="hero-tag">
          <span>全力で、楽しんで、最高の夏にしよう。</span>
          <span className="script">Enjoy Futsal!</span>
        </div>
        <div className="hero-countdown">
          <div className="hero-countdown-dates">6/8(MON) ～ 7/12(MON)</div>
          <div className="hero-countdown-main">
            <span className="hero-countdown-label">あと</span>
            <span className="hero-countdown-num">{daysLeft}</span>
            <span className="hero-countdown-label">日</span>
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
        <a href="https://www.instagram.com/tsukubacup?igsh=d2s5ZzM2dzkzYjZw" target="_blank" rel="noreferrer" className="hero-insta">
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
    </section>
  )
}
