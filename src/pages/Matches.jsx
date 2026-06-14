import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import TournamentBracket from '../components/TournamentBracket'
import MatchCard from '../components/MatchCard'
import { normalizeMatch } from '../lib/normalizeMatch'

function sortByDateTime(a, b) {
  const pd = d => { const [m, day] = (d ?? '0/0').split('/').map(Number); return m * 100 + day }
  const pt = t => { if (!t) return 0; const [h, min] = t.split(':').map(Number); return h * 60 + (min || 0) }
  return pd(a.match_date) - pd(b.match_date) || pt(a.match_time) - pt(b.match_time)
}

export default function Matches() {
  const [gender, setGender]       = useState('男子')
  const [stage, setStage]         = useState('league')
  const [view, setView]           = useState('time')
  const [tournView, setTournView] = useState('bracket')
  const [matches, setMatches]     = useState([])
  const [goalsMap, setGoalsMap]   = useState({})
  const [loading, setLoading]     = useState(true)
  const isFirstLoad = useRef(true)

  async function load() {
    if (isFirstLoad.current) setLoading(true)
    const [{ data: mData }, { data: gData }] = await Promise.all([
      supabase.from('matches').select('*'),
      supabase.from('goals').select('match_id, team_name, player_name, assist_player'),
    ])
    setMatches((mData ?? []).map(normalizeMatch).sort(sortByDateTime))
    const map = {}
    ;(gData ?? []).forEach(g => {
      if (!map[g.match_id]) map[g.match_id] = {}
      if (!map[g.match_id][g.team_name]) map[g.match_id][g.team_name] = []
      map[g.match_id][g.team_name].push(g.assist_player ? `${g.player_name} (A: ${g.assist_player})` : g.player_name)
    })
    setGoalsMap(map)
    setLoading(false)
    isFirstLoad.current = false
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

  const renderLeague = () => {
    if (view === 'time') {
      const dates = [...new Set(filtered.map(m => m.match_date))].filter(Boolean)
      if (dates.length === 0) return (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--sub)', fontSize: 14 }}>
          試合がまだ登録されていません
        </div>
      )
      return (
        <div className="mc2-sections" key={`${gender}-${stage}-time`}>
          {dates.map(date => {
            const cards = filtered.filter(m => m.match_date === date)
            const first = cards[0]
            const dow = first?.match_dow ?? ''
            return (
              <div key={date} className="mc2-section">
                <div className="mc2-section-head">
                  <span className="mc2-section-title">{date}（{dow}）</span>
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
      )
    }

    const groups = [...new Set(filtered.map(m => m.group_name))].filter(Boolean).sort()
    if (groups.length === 0) return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--sub)', fontSize: 14 }}>
        試合がまだ登録されていません
      </div>
    )
    return (
      <div className="mc2-sections" key={`${gender}-${stage}-group`}>
        {groups.map(s => {
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
    )
  }

  const renderTournamentCards = () => {
    const rounds = ['準々決勝', '準決勝', '決勝', '3位決定戦']
    const present = rounds.filter(r => filtered.some(m => m.round === r))
    if (present.length === 0) return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--sub)', fontSize: 14 }}>
        試合がまだ登録されていません
      </div>
    )
    return (
      <div className="mc2-sections" key={`${gender}-tournament-list`}>
        {present.map(r => {
          const cards = filtered.filter(m => m.round === r)
          return (
            <div key={r} className="mc2-section">
              <div className="mc2-section-head">
                <span className="mc2-section-title">{r}</span>
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
    )
  }

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
        {stage === 'league' && (
          <div className="mc2-view-toggle">
            {[['time', '時間順'], ['group', 'グループ順']].map(([key, label]) => (
              <button key={key} className={`mc2-view-btn${view === key ? ' active' : ''}`}
                onClick={() => setView(key)}>{label}</button>
            ))}
          </div>
        )}
        {stage === 'tournament' && (
          <div className="mc2-view-toggle">
            {[['bracket', 'ブラケット'], ['list', '試合一覧']].map(([key, label]) => (
              <button key={key} className={`mc2-view-btn${tournView === key ? ' active' : ''}`}
                onClick={() => setTournView(key)}>{label}</button>
            ))}
          </div>
        )}
      </div>

      <div className="mc2-body-wrap">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--sub)', fontSize: 14 }}>読み込み中...</div>
        ) : stage === 'tournament' ? (
          <div style={{ padding: '12px 4px 0' }}>
            {tournView === 'bracket' ? (
              <TournamentBracket matches={filtered} goalsMap={goalsMap} />
            ) : (
              renderTournamentCards()
            )}
          </div>
        ) : (
          renderLeague()
        )}
      </div>
    </main>
  )
}
