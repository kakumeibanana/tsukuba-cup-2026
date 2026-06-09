import { useState, useEffect } from 'react'

const EVENT_START = new Date(2026, 5, 9)  // 6/9
const EVENT_END   = new Date(2026, 6, 14) // 7/14

function calcPhase() {
  const now   = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (today > EVENT_END)   return { phase: 'ended' }
  const diff = Math.round((EVENT_START - today) / (1000 * 60 * 60 * 24))
  if (diff <= 0) return { phase: 'today' }
  return { phase: 'before', days: diff }
}

export default function Hero() {
  const [info, setInfo] = useState(calcPhase)

  useEffect(() => {
    let intervalId
    const now      = new Date()
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
    const msUntil  = midnight - now

    const timeoutId = setTimeout(() => {
      setInfo(calcPhase())
      intervalId = setInterval(() => setInfo(calcPhase()), 24 * 60 * 60 * 1000)
    }, msUntil)

    return () => { clearTimeout(timeoutId); clearInterval(intervalId) }
  }, [])

  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="hero-year-bg" aria-hidden="true">2026</span>
        <h1 className="hero-title">TSUKUBA<br />CUP 2026</h1>
        <div className="hero-tag">
          <span>筑波大学附属高校サッカークラブ主催</span>
          <span className="script">Enjoy Futsal!</span>
        </div>
        <div className={`hero-countdown${info.phase === 'today' ? ' hero-countdown--today' : ''}`}>
          <div className="hero-countdown-dates">6/9(TUE) ～ 7/14(WED)</div>
          {info.phase === 'ended' ? (
            <div className="hero-countdown-main">
              <span className="hero-countdown-ended">大会終了</span>
            </div>
          ) : info.phase === 'today' ? (
            <div className="hero-countdown-main">
              <span className="hero-countdown-today">
                <span className="hero-countdown-dot" />
                本日開催！
              </span>
            </div>
          ) : (
            <div className="hero-countdown-main">
              <span className="hero-countdown-label">あと</span>
              <span className="hero-countdown-num">{info.days}</span>
              <span className="hero-countdown-label">日</span>
            </div>
          )}
        </div>
        <div className="hero-actions">
          <a href="/apply" className="btn btn-primary">
            参加申し込み
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
