import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { calcGroupStandings, calcAllStandings } from '../../lib/standings'
import { normalizeMatch } from '../../lib/normalizeMatch'

export default function AdminStandings() {
  const [matches, setMatches] = useState([])
  const [scorers, setScorers] = useState([])
  const [loading, setLoading] = useState(true)
  const [gender, setGender]   = useState('男子')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [{ data: mData }, { data: gData }] = await Promise.all([
        supabase.from('matches').select('*'),
        supabase.from('goals').select('player_name, team_name, own_goal'),
      ])
      setMatches((mData ?? []).map(normalizeMatch))

      const counts = {}
      ;(gData ?? []).filter(g => !g.own_goal).forEach(g => {
        if (!counts[g.player_name])
          counts[g.player_name] = { name: g.player_name, team: g.team_name, goals: 0 }
        counts[g.player_name].goals++
      })
      setScorers(Object.values(counts).sort((a, b) => b.goals - a.goals).slice(0, 10))
      setLoading(false)
    }
    load()
  }, [])

  const groups = ['A', 'B', 'C', 'D']

  return (
    <div className="adm-section">
      <div className="adm-section-head">
        <h2 className="adm-section-title">順位・ランキング</h2>
        <div className="adm-seg">
          {['男子', '女子'].map(g => (
            <button key={g} className={`adm-seg-btn${gender === g ? ' active' : ''}`}
              onClick={() => setGender(g)}>{g}</button>
          ))}
        </div>
      </div>

      {loading ? <div className="adm-loading">計算中...</div> : (
        <>
          <div className="adm-standings-note">試合結果から自動計算</div>

          {gender === '女子' ? (() => {
            const rows = calcAllStandings(matches, '女子')
            if (rows.length === 0) return null
            return (
              <div className="adm-standings-group">
                <div className="adm-standings-group-label">女子 予選リーグ</div>
                <div className="adm-table-wrap">
                  <table className="adm-table adm-st-table">
                    <thead>
                      <tr>
                        <th>#</th><th>チーム</th>
                        <th>試</th><th>勝</th><th>分</th><th>負</th>
                        <th>得</th><th>失</th><th>±</th><th>勝点</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => (
                        <tr key={r.name} className={i === 0 ? 'adm-st-top' : ''}>
                          <td className="adm-st-rank">{i + 1}</td>
                          <td className="adm-st-name">{r.name}</td>
                          <td>{r.g}</td><td>{r.w}</td><td>{r.d}</td><td>{r.l}</td>
                          <td>{r.gf}</td><td>{r.ga}</td>
                          <td>{r.gd > 0 ? `+${r.gd}` : r.gd}</td>
                          <td className="adm-st-pts">{r.pts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })() : groups.map(group => {
            const rows = calcGroupStandings(matches, gender, group)
            if (rows.length === 0) return null
            return (
              <div key={group} className="adm-standings-group">
                <div className="adm-standings-group-label">グループ {group}</div>
                <div className="adm-table-wrap">
                  <table className="adm-table adm-st-table">
                    <thead>
                      <tr>
                        <th>#</th><th>チーム</th>
                        <th>試</th><th>勝</th><th>分</th><th>負</th>
                        <th>得</th><th>失</th><th>±</th><th>勝点</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => (
                        <tr key={r.name} className={i === 0 ? 'adm-st-top' : ''}>
                          <td className="adm-st-rank">{i + 1}</td>
                          <td className="adm-st-name">{r.name}</td>
                          <td>{r.g}</td><td>{r.w}</td><td>{r.d}</td><td>{r.l}</td>
                          <td>{r.gf}</td><td>{r.ga}</td>
                          <td>{r.gd > 0 ? `+${r.gd}` : r.gd}</td>
                          <td className="adm-st-pts">{r.pts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}

          <div className="adm-standings-group" style={{ marginTop: 24 }}>
            <div className="adm-standings-group-label">⚽ 得点ランキング</div>
            {scorers.length === 0
              ? <div className="adm-empty" style={{ padding: '12px 0' }}>得点記録がありません</div>
              : (
                <div className="adm-scorer-ranking">
                  {scorers.map((s, i) => (
                    <div key={s.name} className="adm-scorer-rank-row">
                      <div className="adm-scorer-rank-num">{i + 1}</div>
                      <div className="adm-scorer-rank-name">
                        {s.name}
                        <span className="adm-scorer-rank-team">{s.team}</span>
                      </div>
                      <div className="adm-scorer-rank-goals">{s.goals}点</div>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        </>
      )}
    </div>
  )
}
