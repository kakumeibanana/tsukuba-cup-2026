const scorers = [
  { medal: 'gold',   rank: 1, name: '田中 悠真', team: 'FC紫炎',   goals: 7, fill: '#5b21b6', shape: <path d="M20 10 L26 20 L20 30 L14 20 Z" fill="#fff" /> },
  { medal: 'silver', rank: 2, name: '佐藤 翔',   team: 'FC筑附',   goals: 5, fill: '#a78b2a', shape: <path d="M14 14h12l-3 14h-6z" fill="#fff" /> },
  { medal: 'bronze', rank: 3, name: '鈴木 大地', team: 'Libertà',  goals: 4, fill: '#1c1917', shape: <path d="M14 14h12l-3 12h-6z" fill="#d4a017" /> },
  { medal: null,     rank: 4, name: '山本 陸',   team: 'Blue Wave', goals: 3, fill: '#1e3a8a', shape: <path d="M6 18c4 3 8 3 14 0s10 0 14 0v6c-4 0-8 3-14 3s-10-3-14-3z" fill="#fff" /> },
  { medal: null,     rank: 5, name: '高草木 悠', team: 'AVANTI',   goals: 3, fill: '#991b1b', shape: <path d="M12 16l8-4 8 4-2 10-6 4-6-4z" fill="#fff" /> },
]

export default function TopScorers() {
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">
          得点ランキング <span className="sub">（男子）</span>
        </div>
        <a href="#" className="link-more">
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
              {s.medal ? (
                <span className={`rank-medal ${s.medal}`}>{s.rank}</span>
              ) : s.rank}
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
