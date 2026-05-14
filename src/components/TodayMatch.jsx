export default function TodayMatch() {
  return (
    <div className="card today-card" id="matches">
      <div className="today-head">
        <div className="card-title">
          <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 9h18M8 3v4M16 3v4" />
          </svg>
          今日の試合
          <span className="next-badge"><span className="dot"></span>NEXT</span>
        </div>
        <div className="today-date num">5月13日(水)</div>
      </div>
      <div className="today-row">
        <div className="today-time-wrap">
          <div className="today-time num">12:25</div>
          <div className="today-countdown">キックオフまで <span className="num">1時間 5分</span></div>
        </div>
        <div>
          <div className="today-meta">
            <span className="tag">男子 予選リーグ</span>
            <span>Aグループ 第2試合</span>
          </div>
          <div className="today-teams">
            <div className="team">
              <svg className="crest" viewBox="0 0 40 40">
                <path d="M20 2 L36 7 V20 C36 28 29 34 20 37 C11 34 4 28 4 20 V7 Z" fill="#5b21b6" />
                <path d="M20 10 L26 20 L20 30 L14 20 Z" fill="#fff" />
                <circle cx="20" cy="20" r="2" fill="#5b21b6" />
              </svg>
              <div className="team-name">FC紫炎</div>
              <span className="team-color-bar" style={{ background: '#5b21b6' }}></span>
            </div>
            <div className="vs">VS</div>
            <div className="team right">
              <div className="team-name">Libertà</div>
              <svg className="crest" viewBox="0 0 40 40">
                <path d="M20 2 L36 7 V20 C36 28 29 34 20 37 C11 34 4 28 4 20 V7 Z" fill="#1c1917" />
                <path d="M14 14 L26 14 L23 22 L20 26 L17 22 Z" fill="#d4a017" />
                <circle cx="20" cy="14" r="2" fill="#d4a017" />
              </svg>
              <span className="team-color-bar" style={{ background: 'linear-gradient(90deg,#1c1917,#d4a017)' }}></span>
            </div>
          </div>
        </div>
      </div>
      <div className="today-info">
        <span className="row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="5" width="18" height="14" rx="1" />
            <path d="M3 12h18" />
          </svg>
          コート面
        </span>
        <span className="row num">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          12:25 - 12:40
        </span>
      </div>
      <a href="#" className="today-cta">
        今日の全試合を確認する
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </a>
    </div>
  )
}
