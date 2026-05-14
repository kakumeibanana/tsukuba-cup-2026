const standings = [
  {
    id: 'men-a',
    label: '男子 予選リーグ Aグループ',
    tag: '男子',
    rows: [
      { rank: 1, name: 'FC紫炎',   g: 1, w: 1, d: 0, l: 0, gf: 3, ga: 1, gd: 2,  pts: 3 },
      { rank: 2, name: 'Libertà',  g: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0,  pts: 0 },
      { rank: 3, name: 'Blue Wave',g: 1, w: 0, d: 0, l: 1, gf: 1, ga: 3, gd: -2, pts: 0 },
    ],
  },
  {
    id: 'men-b',
    label: '男子 予選リーグ Bグループ',
    tag: '男子',
    rows: [
      { rank: 1, name: 'FC筑附',   g: 1, w: 1, d: 0, l: 0, gf: 5, ga: 0, gd: 5,  pts: 3 },
      { rank: 2, name: 'Libertà',  g: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0,  pts: 0 },
      { rank: 3, name: 'AVANTI',   g: 1, w: 0, d: 0, l: 1, gf: 0, ga: 5, gd: -5, pts: 0 },
    ],
  },
  {
    id: 'women',
    label: '女子 予選リーグ',
    tag: '女子',
    rows: [
      { rank: 1, name: '筑嶺女',    g: 1, w: 0, d: 1, l: 0, gf: 2, ga: 2, gd: 0, pts: 1 },
      { rank: 1, name: 'FC Stella', g: 1, w: 0, d: 1, l: 0, gf: 2, ga: 2, gd: 0, pts: 1 },
    ],
  },
]

const scorers = [
  { rank: 1, name: '田中 悠斗', team: 'FC筑附',   goals: 3 },
  { rank: 2, name: '石川 陸',   team: 'FC筑附',   goals: 2 },
  { rank: 3, name: '橋本 涼',   team: 'FC紫炎',   goals: 2 },
  { rank: 4, name: '中村 隼人', team: 'FC紫炎',   goals: 1 },
  { rank: 5, name: '松本 芽依', team: '筑嶺女',   goals: 1 },
]

const medals = ['gold', 'silver', 'bronze']
const tagClass = { '男子': 'badge-m', '女子': 'badge-w' }

export default function Standings() {
  return (
    <main className="page">
      <div className="page-head">
        <h2 className="page-title">順位・ランキング</h2>
      </div>

      <div className="standings-groups">
        {standings.map(group => (
          <div key={group.id} className="card">
            <div className="card-head">
              <div className="card-title">
                <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 21h8M12 17V21M17 5V3H7v2M5 5v6a7 7 0 0014 0V5H5z"/>
                </svg>
                {group.label}
                <span className={`badge ${tagClass[group.tag]}`}>{group.tag}</span>
              </div>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th></th>
                    <th>チーム</th>
                    <th className="r">試</th>
                    <th className="r th-hide">勝</th>
                    <th className="r th-hide">分</th>
                    <th className="r th-hide">負</th>
                    <th className="r th-hide">得</th>
                    <th className="r th-hide">失</th>
                    <th className="r th-hide">±</th>
                    <th className="r">勝点</th>
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((row, i) => (
                    <tr key={row.name} className={i === 0 ? 'top-row' : ''}>
                      <td className="rank">
                        {medals[row.rank - 1]
                          ? <span className={`rank-medal ${medals[row.rank - 1]}`}>{row.rank}</span>
                          : row.rank}
                      </td>
                      <td className="team-cell">{row.name}</td>
                      <td className="right">{row.g}</td>
                      <td className="right th-hide">{row.w}</td>
                      <td className="right th-hide">{row.d}</td>
                      <td className="right th-hide">{row.l}</td>
                      <td className="right th-hide">{row.gf}</td>
                      <td className="right th-hide">{row.ga}</td>
                      <td className="right th-hide">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                      <td className="pts">{row.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <div className="card">
          <div className="card-head">
            <div className="card-title">
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
              </svg>
              得点ランキング
            </div>
          </div>
          <div className="scorer-list">
            {scorers.map((s, i) => (
              <div key={i} className="scorer-row">
                <div className="scorer-rank">
                  {medals[s.rank - 1]
                    ? <span className={`rank-medal ${medals[s.rank - 1]}`}>{s.rank}</span>
                    : s.rank}
                </div>
                <div />
                <div className="scorer-name">
                  {s.name}
                  <span className="team-tag">{s.team}</span>
                </div>
                <div className="scorer-goals">{s.goals} G</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
