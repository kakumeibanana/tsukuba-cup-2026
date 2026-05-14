export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="brand">
            <svg className="brand-crest" viewBox="0 0 44 44">
              <path d="M22 2 L40 8 V22 C40 32 32 39 22 42 C12 39 4 32 4 22 V8 Z" fill="#5b21b6" />
              <path d="M22 12 L28 22 L22 32 L16 22 Z" fill="#fff" />
              <circle cx="22" cy="22" r="2.4" fill="#4c1d95" />
            </svg>
            <div className="brand-text">
              <div className="name">TSUKUBA CUP 2026</div>
              <div className="sub">筑波大学附属高校 フットサル大会</div>
            </div>
          </div>
          <div className="footer-tagline">筑波大学附属高校フットサル部<br />公式サイト</div>
        </div>
        <div className="footer-block">
          <div className="title">クイックメニュー</div>
          <ul>
            <li><a href="#matches">試合・結果</a></li>
            <li><a href="#ranking">順位・ランキング</a></li>
            <li><a href="#teams">チーム</a></li>
            <li><a href="#about">大会について</a></li>
          </ul>
        </div>
        <div className="footer-block">
          <div className="title">サポート</div>
          <ul>
            <li><a href="#">お問い合わせ</a></li>
            <li><a href="#">プライバシーポリシー</a></li>
            <li><a href="#">サイトマップ</a></li>
          </ul>
        </div>
        <div className="footer-block">
          <div className="title">公式SNS</div>
          <a href="#" className="footer-insta">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
            Instagram
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', marginLeft: '6px' }}>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
      <div className="footer-bottom">© 2026 筑波大学附属高等学校フットサル部 All rights reserved.</div>
    </footer>
  )
}
