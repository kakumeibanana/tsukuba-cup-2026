export default function TodayMatch() {
  return (
    <div className="live-card" id="matches">
      <div className="live-card-bg" />

      <div className="live-card-header">
        <div className="live-league">男子 予選リーグ Aグループ</div>
        <div className="live-card-date num">5月13日(水)</div>
      </div>

      <div className="live-teams">
        <div className="live-team">
          <svg className="live-crest" viewBox="0 0 40 40">
            <path d="M20 2 L36 7 V20 C36 28 29 34 20 37 C11 34 4 28 4 20 V7 Z" fill="#5b21b6"/>
            <path d="M20 10 L26 20 L20 30 L14 20 Z" fill="#fff"/>
            <circle cx="20" cy="20" r="2" fill="#5b21b6"/>
          </svg>
          <div className="live-team-name">FC紫炎</div>
        </div>

        <div className="live-center">
          <div className="live-time num">12:25</div>
          <div className="live-score">
            <span className="score-num">2</span>
            <span className="score-sep">-</span>
            <span className="score-num">1</span>
          </div>
          <div className="live-period">HT</div>
        </div>

        <div className="live-team">
          <svg className="live-crest" viewBox="0 0 40 40">
            <path d="M20 2 L36 7 V20 C36 28 29 34 20 37 C11 34 4 28 4 20 V7 Z" fill="#1c1917"/>
            <path d="M14 14h12l-3 12h-6z" fill="#d4a017"/>
            <circle cx="20" cy="14" r="2" fill="#d4a017"/>
          </svg>
          <div className="live-team-name">Libertà</div>
        </div>
      </div>

      <div className="live-timeline">
        <div className="live-tl-track">
          <div className="live-tl-fill" style={{ width: '50%' }} />
          <div className="live-tl-dot" style={{ left: '50%' }} />
        </div>
        <div className="live-tl-labels num">
          <span>0'</span>
          <span className="live-tl-ht">HT</span>
          <span>40'</span>
        </div>
      </div>

    </div>
  )
}
