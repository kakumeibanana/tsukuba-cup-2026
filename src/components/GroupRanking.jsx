const teams = [
  {
    medal: 'gold', rank: 1, name: 'FC紫炎', pts: 6, diff: '+5',
    crest: <path d="M20 2 L36 7 V20 C36 28 29 34 20 37 C11 34 4 28 4 20 V7 Z" fill="#5b21b6" />,
    crest2: <path d="M20 10 L26 20 L20 30 L14 20 Z" fill="#fff" />,
    top: true,
  },
  {
    medal: 'silver', rank: 2, name: 'Libertà', pts: 3, diff: '+1',
    crest: <path d="M20 2 L36 7 V20 C36 28 29 34 20 37 C11 34 4 28 4 20 V7 Z" fill="#1c1917" />,
    crest2: <path d="M14 14h12l-3 12h-6z" fill="#d4a017" />,
    top: false,
  },
  {
    medal: 'bronze', rank: 3, name: 'Blue Wave', pts: 3, diff: '-1',
    crest: <path d="M20 2 L36 7 V20 C36 28 29 34 20 37 C11 34 4 28 4 20 V7 Z" fill="#1e3a8a" />,
    crest2: <path d="M6 18c4 3 8 3 14 0s10 0 14 0v6c-4 0-8 3-14 3s-10-3-14-3z" fill="#fff" />,
    top: false,
  },
  {
    medal: null, rank: 4, name: 'FC筑附', pts: 0, diff: '-5',
    crest: <path d="M20 2 L36 7 V20 C36 28 29 34 20 37 C11 34 4 28 4 20 V7 Z" fill="#a78b2a" />,
    crest2: <path d="M14 14h12l-3 14h-6z" fill="#fff" />,
    top: false,
  },
]

export default function GroupRanking() {
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">
          グループ順位 <span className="sub">（男子 Aグループ）</span>
        </div>
        <a href="#" className="link-more">
          すべて見る
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>順位</th>
            <th>チーム</th>
            <th className="right">勝点</th>
            <th className="right">得失点</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((t) => (
            <tr key={t.rank} className={t.top ? 'top-row' : ''}>
              <td>
                {t.medal ? (
                  <span className={`rank-medal ${t.medal}`}>{t.rank}</span>
                ) : (
                  <span className="rank">{t.rank}</span>
                )}
              </td>
              <td className="team-cell">
                <svg className="crest" viewBox="0 0 40 40">
                  {t.crest}
                  {t.crest2}
                </svg>
                {t.name}
              </td>
              <td className="right num num-pos">{t.pts}</td>
              <td className={`right num ${t.diff.startsWith('-') ? 'num-neg' : 'num-pos'}`}>{t.diff}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
