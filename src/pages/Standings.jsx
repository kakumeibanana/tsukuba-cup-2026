import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { calcGroupStandings } from '../lib/standings'
import TournamentBracket from '../components/TournamentBracket'
import StTable from '../components/StTable'

const MEDAL = { 1: 'gold', 2: 'silver', 3: 'bronze', 4: 'fourth' }

function rankOf(rows, i) {
  const r = rows[i]
  for (let j = 0; j < i; j++) {
    if (rows[j].pts === r.pts && rows[j].gd === r.gd && rows[j].gf === r.gf) return j + 1
  }
  return i + 1
}

function scorerRank(scorers, i) {
  const goals = scorers[i].goals
  return scorers.findIndex(s => s.goals === goals) + 1
}

function assistRank(assists, i) {
  const cnt = assists[i].assists
  return assists.findIndex(a => a.assists === cnt) + 1
}

export default function Standings() {
  const [gender, setGender]   = useState('男子')
  const [tab, setTab]         = useState('league')
  const [matches, setMatches] = useState([])
  const [allGoals, setAllGoals] = useState([])
  const [loading, setLoading]   = useState(true)

  async function load() {
    setLoading(true)
    const [{ data: mData }, { data: gData }] = await Promise.all([
      supabase.from('matches').select('*'),
      supabase.from('goals').select('player_name, team_name, match_id, assist_player'),
    ])
    setMatches(mData ?? [])
    setAllGoals(gData ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    const channel = supabase
      .channel('standings-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'goals' },   load)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const scorers = useMemo(() => {
    const matchIds = new Set(matches.filter(m => m.gender === gender).map(m => m.id))
    const counts = {}
    allGoals.filter(g => matchIds.has(g.match_id)).forEach(g => {
      if (!counts[g.player_name])
        counts[g.player_name] = { name: g.player_name, team: g.team_name, goals: 0 }
      counts[g.player_name].goals++
    })
    return Object.values(counts).sort((a, b) => b.goals - a.goals)
  }, [allGoals, matches, gender])

  const assists = useMemo(() => {
    const matchIds = new Set(matches.filter(m => m.gender === gender).map(m => m.id))
    const counts = {}
    allGoals.filter(g => g.assist_player && matchIds.has(g.match_id)).forEach(g => {
      if (!counts[g.assist_player])
        counts[g.assist_player] = { name: g.assist_player, team: g.team_name, assists: 0 }
      counts[g.assist_player].assists++
    })
    return Object.values(counts).sort((a, b) => b.assists - a.assists)
  }, [allGoals, matches, gender])

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
        <div className="mc2-stage-tabs">
          {[['league', '予選リーグ'], ['tournament', 'トーナメント表']].map(([key, label]) => (
            <button key={key} className={`mc2-stage-tab${tab === key ? ' active' : ''}`}
              onClick={() => setTab(key)}>{label}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--sub)', fontSize: 14 }}>読み込み中...</div>
      ) : tab === 'tournament' ? (
        <div className="card" style={{ marginTop: 8 }}>
          <div className="card-head">
            <div className="card-title">
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 21h8M12 17V21M17 5V3H7v2M5 5v6a7 7 0 0014 0V5H5z"/>
              </svg>
              決勝トーナメント — {gender}
            </div>
          </div>
          <TournamentBracket matches={matches.filter(m => m.gender === gender)} />
        </div>
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
                  <StTable>
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
                        {rows.map((row, i) => {
                          const rank = rankOf(rows, i)
                          return (
                          <tr key={row.name} className={rank === 1 ? 'top-row' : ''}>
                            <td className="rank">
                              {MEDAL[rank]
                                ? <span className={`rank-medal ${MEDAL[rank]}`}>{rank}</span>
                                : rank}
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
                          )
                        })}
                      </tbody>
                    </table>
                  </StTable>
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
                  {scorers.map((s, i) => {
                    const rank = scorerRank(scorers, i)
                    return (
                      <div key={s.name} className="scorer-row">
                        <div className="scorer-rank">
                          {MEDAL[rank]
                            ? <span className={`rank-medal ${MEDAL[rank]}`}>{rank}</span>
                            : rank}
                        </div>
                        <div />
                        <div className="scorer-name">
                          {s.name}
                          <span className="team-tag">（{s.team}）</span>
                        </div>
                        <div className="scorer-goals num">{s.goals} 得点</div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="card" style={{ marginTop: 16 }}>
              <div className="card-head">
                <div className="card-title">
                  <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12l7-7 7 7"/>
                  </svg>
                  アシストランキング
                </div>
              </div>
              {assists.length === 0 ? (
                <div style={{ padding: '16px', color: 'var(--sub)', fontSize: 13 }}>アシスト記録がありません</div>
              ) : (
                <div className="scorer-list">
                  {assists.map((s, i) => {
                    const rank = assistRank(assists, i)
                    return (
                      <div key={s.name} className="scorer-row">
                        <div className="scorer-rank">
                          {MEDAL[rank]
                            ? <span className={`rank-medal ${MEDAL[rank]}`}>{rank}</span>
                            : rank}
                        </div>
                        <div />
                        <div className="scorer-name">
                          {s.name}
                          <span className="team-tag">（{s.team}）</span>
                        </div>
                        <div className="scorer-goals num">{s.assists} アシスト</div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  )
}

