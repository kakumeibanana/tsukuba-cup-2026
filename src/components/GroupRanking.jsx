const scorers = []

export default function GroupRanking() {
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">
          <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="5" /><path d="M12 13v8M9 18l3 3 3-3" />
          </svg>
          得点ランキング
        </div>
        <a href="/standings" className="link-more">
          すべて見る
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
      <div className="scorer-list">
        {scorers.map((s) => (
          <div key={s.rank} className="scorer-row">
            <div className="scorer-rank">
              {s.medal
                ? <span className={`rank-medal ${s.medal}`}>{s.rank}</span>
                : s.rank
              }
            </div>
            <svg className="crest" viewBox="0 0 40 40">
              <path d="M20 2 L36 7 V20 C36 28 29 34 20 37 C11 34 4 28 4 20 V7 Z" fill={s.fill} />
              {s.shape}
            </svg>
            <div className="scorer-name">
              {s.name}
              <span className="team-tag">（{s.team}）</span>
            </div>
            <div className="scorer-goals num">{s.goals}得点</div>
          </div>
        ))}
      </div>
    </div>
  )
}
