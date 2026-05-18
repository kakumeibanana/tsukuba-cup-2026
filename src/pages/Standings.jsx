import { useState } from 'react'

const standings = []
const scorers = []

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
                <div />
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
