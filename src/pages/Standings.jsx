import { useState } from 'react'

const standings = [
  // ── 男子 ──
  {
    id: 'men-a', gender: '男子', label: 'グループ A',
    rows: [
      { rank: 1, name: 'FC紫炎',    g: 1, w: 1, d: 0, l: 0, gf: 3, ga: 1, gd:  2, pts: 3 },
      { rank: 2, name: 'Libertà',   g: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd:  0, pts: 0 },
      { rank: 2, name: 'FC筑附',    g: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd:  0, pts: 0 },
      { rank: 4, name: 'Blue Wave', g: 1, w: 0, d: 0, l: 1, gf: 1, ga: 3, gd: -2, pts: 0 },
    ],
  },
  {
    id: 'men-b', gender: '男子', label: 'グループ B',
    rows: [
      { rank: 1, name: '筑嶺男',  g: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
      { rank: 1, name: 'AVANTI',  g: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
      { rank: 1, name: 'T.A.S.', g: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
      { rank: 1, name: 'Nordica', g: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    ],
  },
  {
    id: 'men-c', gender: '男子', label: 'グループ C',
    rows: [
      { rank: 1, name: 'FC筑附',  g: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
      { rank: 1, name: 'Phoenix', g: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
      { rank: 1, name: 'FC紫炎',  g: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
      { rank: 1, name: 'T.A.S.', g: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    ],
  },
  {
    id: 'men-d', gender: '男子', label: 'グループ D',
    rows: [
      { rank: 1, name: 'Flare',    g: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
      { rank: 1, name: '筑嶺男2',  g: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
      { rank: 1, name: 'Nordica',  g: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
      { rank: 1, name: 'AVANTI2',  g: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    ],
  },
  // ── 女子 ──
  {
    id: 'women-a', gender: '女子', label: 'グループ A',
    rows: [
      { rank: 1, name: '筑嶺女',    g: 2, w: 2, d: 0, l: 0, gf: 4, ga: 2, gd:  2, pts: 6 },
      { rank: 2, name: 'FC Stella', g: 2, w: 1, d: 0, l: 1, gf: 4, ga: 4, gd:  0, pts: 3 },
      { rank: 3, name: 'Flare',     g: 2, w: 0, d: 0, l: 2, gf: 1, ga: 3, gd: -2, pts: 0 },
    ],
  },
]

const scorers = [
  { rank: 1, name: '田中 悠真', team: 'FC紫炎',    goals: 7 },
  { rank: 2, name: '佐藤 翔',   team: 'T.A.S.',    goals: 6 },
  { rank: 3, name: '鈴木 大地', team: 'Libertà',   goals: 4 },
  { rank: 4, name: '山本 陸',   team: 'Blue Wave',  goals: 3 },
  { rank: 5, name: '高草木 悠', team: 'AVANTI',     goals: 3 },
]

const medals = ['gold', 'silver', 'bronze']

export default function Standings() {
  const [gender, setGender] = useState('男子')
  const filtered = standings.filter(g => g.gender === gender)

  return (
    <main className="page">
      <div className="page-head">
        <h2 className="page-title">順位・ランキング</h2>
      </div>

      {/* Gender toggle */}
      <div className="st-seg-wrap">
        <div className="mc2-segment" style={{ maxWidth: 200 }}>
          {['男子', '女子'].map(g => (
            <button key={g} className={`mc2-seg-btn${gender === g ? ' active' : ''}`}
              onClick={() => setGender(g)}>{g}</button>
          ))}
        </div>
      </div>

      <div className="standings-groups">
        {filtered.map(group => (
          <div key={group.id} className="card">
            <div className="card-head">
              <div className="card-title">
                <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 21h8M12 17V21M17 5V3H7v2M5 5v6a7 7 0 0014 0V5H5z"/>
                </svg>
                {group.label}
              </div>
            </div>
            <div className="table-wrap">
              <table className="table st-table">
                <thead>
                  <tr>
                    <th style={{ width: 28 }}></th>
                    <th>チーム</th>
                    <th className="r">試</th>
                    <th className="r">勝</th>
                    <th className="r">分</th>
                    <th className="r">負</th>
                    <th className="r">得</th>
                    <th className="r">失</th>
                    <th className="r">±</th>
                    <th className="r">勝点</th>
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((row, i) => (
                    <tr key={row.name + i} className={i === 0 ? 'top-row' : ''}>
                      <td className="rank">
                        {medals[row.rank - 1]
                          ? <span className={`rank-medal ${medals[row.rank - 1]}`}>{row.rank}</span>
                          : row.rank}
                      </td>
                      <td className="team-cell">{row.name}</td>
                      <td className="right">{row.g}</td>
                      <td className="right">{row.w}</td>
                      <td className="right">{row.d}</td>
                      <td className="right">{row.l}</td>
                      <td className="right">{row.gf}</td>
                      <td className="right">{row.ga}</td>
                      <td className="right">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                      <td className="pts">{row.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <div className="st-scorer-wrap">
        <div className="card">
          <div className="card-head">
            <div className="card-title">
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="5"/><path d="M12 13v8M9 18l3 3 3-3"/>
              </svg>
              得点ランキング
            </div>
          </div>
          <div className="scorer-list">
            {scorers.map((s) => (
              <div key={s.rank} className="scorer-row">
                <div className="scorer-rank">
                  {medals[s.rank - 1]
                    ? <span className={`rank-medal ${medals[s.rank - 1]}`}>{s.rank}</span>
                    : s.rank}
                </div>
                <div className="scorer-name">
                  {s.name}
                  <span className="team-tag">（{s.team}）</span>
                </div>
                <div className="scorer-goals num">{s.goals} 得点</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
