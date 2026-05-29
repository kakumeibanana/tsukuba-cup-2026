import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="brand">
            <img src="/logo.png" alt="" className="brand-crest" style={{ width: 36, height: 36 }} />
            <div className="brand-text">
              <div className="name">TSUKUBA CUP 2026</div>
              <div className="sub">筑波大学附属高校 フットサル大会</div>
            </div>
          </div>
          <div className="footer-tagline">筑波大学附属高等学校<br />フットサル大会 公式サイト</div>
        </div>

        <div className="footer-block">
          <div className="title">メニュー</div>
          <ul>
            <li><Link to="/matches">試合・結果</Link></li>
            <li><Link to="/standings">順位・ランキング</Link></li>
            <li><Link to="/teams">チーム</Link></li>
            <li><Link to="/about">大会について</Link></li>
          </ul>
        </div>

        <div className="footer-block">
          <div className="title">公式SNS</div>
          <a href="https://www.instagram.com/tsukubacup?igsh=d2s5ZzM2dzkzYjZw" className="footer-insta" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
            Instagram
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13, marginLeft: 4 }}>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
      <div className="footer-bottom">© 2026 筑波大学附属高等学校フットサル部 All rights reserved.</div>
    </footer>
  )
}
