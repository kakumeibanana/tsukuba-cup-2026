import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const medals = ['gold', 'silver', 'bronze']

function calcGroupStandings(matches, gender, group) {
  const inGroup = matches.filter(m =>
    m.gender === gender && m.stage === 'league' && m.group_name === group
  )
  const teamNames = [...new Set(inGroup.flatMap(m => [m.home_name, m.away_name]))]
  const table = {}
  teamNames.forEach(name => {
    table[name] = { name, g: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 }
  })
  inGroup.filter(m => m.status === 'finished' && m.score_home != null).forEach(m => {
    const h = table[m.home_name], a = table[m.away_name]
    if (!h || !a) return
    h.g++; a.g++
    h.gf += m.score_home; h.ga += m.score_away
    a.gf += m.score_away; a.ga += m.score_home
    h.gd = h.gf - h.ga; a.gd = a.gf - a.ga
    if (m.score_home > m.score_away)      { h.w++; a.l++; h.pts += 3 }
    else if (m.score_home < m.score_away) { a.w++; h.l++; a.pts += 3 }
    else                                   { h.d++; a.d++; h.pts++; a.pts++ }
  })
  return Object.values(table).sort((a, b) =>
    b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.name.localeCompare(b.name)
  )
}

export default function Standings() {
  const [gender, setGender]   = useState('男子')
  const [matches, setMatches] = useState([])
  const [scorers, setScorers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [{ data: mData }, { data: gData }] = await Promise.all([
        supabase.from('matches').select('*'),
        supabase.from('goals').select('player_name, team_name'),
      ])
      setMatches(mData ?? [])

      const counts = {}
      ;(gData ?? []).forEach(g => {
        if (!counts[g.player_name])
          counts[g.player_name] = { name: g.player_name, team: g.team_name, goals: 0 }
        counts[g.player_name].goals++
      })
      setScorers(Object.values(counts).sort((a, b) => b.goals - a.goals))
      setLoading(false)
    }
    load()
  }, [])

  const groups = gender === '男子' ? ['A', 'B', 'C', 'D'] : ['A', 'B']

  return (
    <main className="page">
      <div className="page-head">
        <h2 className="page-title">順位・ランキング</h2>
      </div>

      <div className="st-seg-wrap">
        <div className="mc2-segment" style={{ maxWidth: 200 }}>
          {['男子', '女子'].map(g => (
            <button key={g} className={`mc2-seg-btn${gender === g ? ' active' : ''}`}
              onClick={() => setGender(g)}>{g}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--sub)', fontSize: 14 }}>読み込み中...</div>
      ) : (
        <>
          <div className="standings-groups">
            {groups.map(group => {
              const rows = calcGroupStandings(matches, gender, group)
              if (rows.length === 0) return null
              return (
                <div key={group} className="card">
                  <div className="card-head">
                    <div className="card-title">
                      <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 21h8M12 17V21M17 5V3H7v2M5 5v6a7 7 0 0014 0V5H5z"/>
                      </svg>
                      グループ {group}
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
                        {rows.map((row, i) => (
                          <tr key={row.name} className={i === 0 ? 'top-row' : ''}>
                            <td className="rank">
                              {medals[i]
                                ? <span className={`rank-medal ${medals[i]}`}>{i + 1}</span>
                                : i + 1}
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
              )
            })}
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
              {scorers.length === 0 ? (
                <div style={{ padding: '16px', color: 'var(--sub)', fontSize: 13 }}>得点記録がありません</div>
              ) : (
                <div className="scorer-list">
                  {scorers.map((s, i) => (
                    <div key={s.name} className="scorer-row">
                      <div className="scorer-rank">
                        {medals[i]
                          ? <span className={`rank-medal ${medals[i]}`}>{i + 1}</span>
                          : i + 1}
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
              )}
            </div>
          </div>
        </>
      )}
    </main>
  )
}
