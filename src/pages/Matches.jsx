import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import TournamentBracket from '../components/TournamentBracket'
import MatchCard from '../components/MatchCard'

function sortByMatchDate(a, b) {
  const parse = d => { const [m, day] = (d ?? '0/0').split('/').map(Number); return m * 100 + day }
  return parse(a.match_date) - parse(b.match_date)
}

export default function Matches() {
  const [gender, setGender]     = useState('男子')
  const [stage, setStage]       = useState('league')
  const [matches, setMatches]   = useState([])
  const [goalsMap, setGoalsMap] = useState({})
  const [loading, setLoading]   = useState(true)

  async function load() {
    setLoading(true)
    const [{ data: mData }, { data: gData }] = await Promise.all([
      supabase.from('matches').select('*'),
      supabase.from('goals').select('match_id, team_name, player_name'),
    ])
    setMatches((mData ?? []).sort(sortByMatchDate))
    const map = {}
    ;(gData ?? []).forEach(g => {
      if (!map[g.match_id]) map[g.match_id] = {}
      if (!map[g.match_id][g.team_name]) map[g.match_id][g.team_name] = []
      map[g.match_id][g.team_name].push(g.player_name)
    })
    setGoalsMap(map)
    setLoading(false)
  }

  useEffect(() => {
    load()
    const channel = supabase
      .channel('matches-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'goals' },   load)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const filtered = matches.filter(m => m.gender === gender && m.stage === stage)
  const sections = stage === 'league'
    ? [...new Set(filtered.map(m => m.group_name))].filter(Boolean).sort()
    : [...new Set(filtered.map(m => m.round))].filter(Boolean)

  return (
    <main className="page mc2-page">
      <div className="page-head">
        <h2 className="page-title">試合・結果</h2>
      </div>

      <div className="mc2-sticky-bar">
        <div className="mc2-segment">
          {['男子', '女子'].map(g => (
            <button key={g} className={`mc2-seg-btn${gender === g ? ' active' : ''}`}
              onClick={() => setGender(g)}>{g}</button>
          ))}
        </div>
        <div className="mc2-stage-tabs">
          {[['league', '予選リーグ'], ['tournament', '決勝トーナメント']].map(([key, label]) => (
            <button key={key} className={`mc2-stage-tab${stage === key ? ' active' : ''}`}
              onClick={() => setStage(key)}>{label}</button>
          ))}
        </div>
      </div>

      <div className="mc2-body-wrap">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--sub)', fontSize: 14 }}>読み込み中...</div>
        ) : stage === 'tournament' ? (
          <div style={{ padding: '12px 4px 0' }}>
            <TournamentBracket
              matches={filtered}
              goalsMap={goalsMap}
            />
          </div>
        ) : sections.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--sub)', fontSize: 14 }}>
            試合がまだ登録されていません
          </div>
        ) : (
          <div className="mc2-sections" key={`${gender}-${stage}`}>
            {sections.map(s => {
              const cards = filtered.filter(m => m.group_name === s)
              return (
                <div key={s} className="mc2-section">
                  <div className="mc2-section-head">
                    <span className="mc2-section-title">グループ {s}</span>
                  </div>
                  <div className="mc2-card-list">
                    {cards.map(m => (
                      <MatchCard
                        key={m.id}
                        m={m}
                        homeScorers={goalsMap[m.id]?.[m.home_name] ?? []}
                        awayScorers={goalsMap[m.id]?.[m.away_name] ?? []}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
