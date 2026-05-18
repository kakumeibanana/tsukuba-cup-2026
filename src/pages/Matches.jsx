import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function sortByMatchDate(a, b) {
  const parse = d => { const [m, day] = (d ?? '0/0').split('/').map(Number); return m * 100 + day }
  return parse(a.match_date) - parse(b.match_date)
}

function MatchCard({ m, homeScorers, awayScorers }) {
  const isFinished  = m.status === 'finished'
  const isLive      = m.status === 'live'
  const isCancelled = m.status === 'cancelled'
  const homeWin = isFinished && m.score_home > m.score_away
  const awayWin = isFinished && m.score_away > m.score_home
  const hasScorers = (isFinished || isLive) && (homeScorers.length > 0 || awayScorers.length > 0)

  return (
    <div className={[
      'mc2-card',
      isFinished  && 'mc2-finished',
      isLive      && 'mc2-live',
      isCancelled && 'mc2-cancelled',
    ].filter(Boolean).join(' ')}>

      <div className="mc2-top">
        {isCancelled && <span className="mc2-badge mc2-badge-cancelled">Cancelled</span>}
        {isLive      && <span className="mc2-badge mc2-badge-live">🔴 LIVE</span>}
        <span className="mc2-group-label">
          {m.match_date}（{m.match_dow}）&nbsp;·&nbsp;
          {m.stage === 'league' ? `グループ ${m.group_name}` : m.round}
        </span>
      </div>

      <div className="mc2-body">
        <div className={`mc2-team mc2-home${homeWin ? ' mc2-winner' : ''}`}>
          <div className="mc2-team-name">{m.home_name}</div>
        </div>

        <div className="mc2-center">
          {(isFinished || isLive) && m.score_home != null && (
            <div className="mc2-score num">
              <span className={homeWin ? 'mc2-win-num' : ''}>{m.score_home}</span>
              <span className="mc2-sep">-</span>
              <span className={awayWin ? 'mc2-win-num' : ''}>{m.score_away}</span>
            </div>
          )}
          {m.status === 'scheduled' && (
            m.match_time?.includes(':')
              ? <div className="mc2-kickoff num">{m.match_time}</div>
              : <div className="mc2-time-label">{m.match_time ?? '昼休み'}</div>
          )}
          {isCancelled && <div className="mc2-cancelled-sep">—</div>}
        </div>

        <div className={`mc2-team mc2-away${awayWin ? ' mc2-winner' : ''}`}>
          <div className="mc2-team-name">{m.away_name}</div>
        </div>
      </div>

      {hasScorers && (
        <div className="mc2-scorer-bar">
          <span className="mc2-scorer-l">{homeScorers.join(', ')}</span>
          <span className="mc2-scorer-div" />
          <span className="mc2-scorer-r">{awayScorers.join(', ')}</span>
        </div>
      )}
    </div>
  )
}

export default function Matches() {
  const [gender, setGender]   = useState('男子')
  const [stage, setStage]     = useState('league')
  const [matches, setMatches] = useState([])
  const [goalsMap, setGoalsMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [{ data: mData }, { data: gData }] = await Promise.all([
        supabase.from('matches').select('*'),
        supabase.from('goals').select('match_id, team_name, player_name'),
      ])

      const sorted = (mData ?? []).sort(sortByMatchDate)
      setMatches(sorted)

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
        ) : sections.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--sub)', fontSize: 14 }}>
            試合がまだ登録されていません
          </div>
        ) : (
          <div className="mc2-sections" key={`${gender}-${stage}`}>
            {sections.map(s => {
              const cards = filtered.filter(m =>
                stage === 'league' ? m.group_name === s : m.round === s
              )
              return (
                <div key={s} className="mc2-section">
                  <div className="mc2-section-head">
                    <span className="mc2-section-title">
                      {stage === 'league' ? `グループ ${s}` : s}
                    </span>
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
