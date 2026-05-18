import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function sortByMatchDateDesc(a, b) {
  const parse = d => { const [m, day] = (d ?? '0/0').split('/').map(Number); return m * 100 + day }
  return parse(b.match_date) - parse(a.match_date)
}

export default function RecentResults() {
  const [results, setResults] = useState([])
  const [goalsMap, setGoalsMap] = useState({})
  const [loading, setLoading]  = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: mData }, { data: gData }] = await Promise.all([
        supabase.from('matches').select('*').eq('status', 'finished'),
        supabase.from('goals').select('match_id, team_name, player_name'),
      ])
      const sorted = (mData ?? []).sort(sortByMatchDateDesc).slice(0, 8)
      setResults(sorted)

      const map = {}
      ;(gData ?? []).forEach(g => {
        if (!map[g.match_id]) map[g.match_id] = {}
        if (!map[g.match_id][g.team_name]) map[g.match_id][g.team_name] = []
        map[g.match_id][g.team_name].push(g.player_name)
      })
      setGoalsMap(map)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">
          <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 21h8M12 17V21M17 5V3H7v2M5 5v6a7 7 0 0014 0V5H5z"/>
          </svg>
          直近の試合結果
        </div>
        <Link to="/matches" className="link-more">
          すべて見る
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>

      {loading ? (
        <div style={{ padding: '16px 0', color: 'var(--sub)', fontSize: 13 }}>読み込み中...</div>
      ) : results.length === 0 ? (
        <div className="no-results">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="16" rx="2"/>
            <path d="M3 9h18M8 3v4M16 3v4"/>
          </svg>
          <p>試合結果はここに表示されます</p>
        </div>
      ) : (
        <div className="recent-list">
          {results.map(m => {
            const isDraw  = m.score_home === m.score_away
            const homeWin = m.score_home > m.score_away || (isDraw && m.pk_winner === m.home_name)
            const awayWin = m.score_away > m.score_home || (isDraw && m.pk_winner === m.away_name)
            const homeScorers = goalsMap[m.id]?.[m.home_name] ?? []
            const awayScorers = goalsMap[m.id]?.[m.away_name] ?? []
            const hasScorers  = homeScorers.length > 0 || awayScorers.length > 0
            return (
              <div key={m.id} className="recent-row">
                <div className="recent-meta">
                  <span className="recent-date num">{m.match_date}（{m.match_dow}）</span>
                  <span className="recent-group">
                    {m.stage === 'league' ? `G${m.group_name}` : m.round} · {m.gender}
                  </span>
                </div>
                <div className="recent-match">
                  <span className={`recent-team${homeWin ? ' recent-winner' : ''}`}>{m.home_name}</span>
                  <span className="recent-score num">
                    <span className={homeWin ? 'recent-win-num' : ''}>{m.score_home}</span>
                    <span className="recent-sep">-</span>
                    <span className={awayWin ? 'recent-win-num' : ''}>{m.score_away}</span>
                    {m.pk_winner && <span style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', marginLeft: 3 }}>PK</span>}
                  </span>
                  <span className={`recent-team recent-team-r${awayWin ? ' recent-winner' : ''}`}>{m.away_name}</span>
                </div>
                {hasScorers && (
                  <div className="recent-scorers">
                    <span>{homeScorers.join(', ')}</span>
                    <span>{awayScorers.join(', ')}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
