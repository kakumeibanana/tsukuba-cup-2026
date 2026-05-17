import { useState } from 'react'
import { allMatches } from '../data/matches'

function MatchCard({ m }) {
  const isFinished  = m.status === 'finished'
  const isScheduled = m.status === 'scheduled'
  const isCancelled = m.status === 'cancelled'

  const homeWin = isFinished && m.scoreH > m.scoreA
  const awayWin = isFinished && m.scoreA > m.scoreH
  const hasScorers = isFinished && (m.home.scorers.length > 0 || m.away.scorers.length > 0)

  return (
    <div className={[
      'mc2-card',
      isFinished  && 'mc2-finished',
      isCancelled && 'mc2-cancelled',
    ].filter(Boolean).join(' ')}>

      {/* Top: date/group (+ Cancelled badge only) */}
      <div className="mc2-top">
        {isCancelled && <span className="mc2-badge mc2-badge-cancelled">Cancelled</span>}
        <span className="mc2-group-label">
          {m.date}({m.dow})&nbsp;·&nbsp;{m.group ? `${m.group}グループ` : m.round}
        </span>
      </div>

      {/* Body: home | center | away */}
      <div className="mc2-body">
        <div className={`mc2-team mc2-home${homeWin ? ' mc2-winner' : ''}`}>
          <div className="mc2-team-name">{m.home.name}</div>
        </div>

        <div className="mc2-center">
          {isFinished && (
            <div className="mc2-score num">
              <span className={homeWin ? 'mc2-win-num' : ''}>{m.scoreH}</span>
              <span className="mc2-sep">-</span>
              <span className={awayWin ? 'mc2-win-num' : ''}>{m.scoreA}</span>
            </div>
          )}
          {isScheduled && (
          m.time && m.time.includes(':')
            ? <div className="mc2-kickoff num">{m.time}</div>
            : <div className="mc2-time-label">{m.time}</div>
        )}
          {isCancelled && <div className="mc2-cancelled-sep">—</div>}
        </div>

        <div className={`mc2-team mc2-away${awayWin ? ' mc2-winner' : ''}`}>
          <div className="mc2-team-name">{m.away.name}</div>
        </div>
      </div>

      {/* Scorer bar (finished only) */}
      {hasScorers && (
        <div className="mc2-scorer-bar">
          <span className="mc2-scorer-l">{m.home.scorers.join(', ')}</span>
          <span className="mc2-scorer-div" />
          <span className="mc2-scorer-r">{m.away.scorers.join(', ')}</span>
        </div>
      )}
    </div>
  )
}

export default function Matches() {
  const [gender, setGender] = useState('男子')
  const [stage, setStage]   = useState('league')

  const filtered = allMatches.filter(m => m.gender === gender && m.stage === stage)
  const sections = stage === 'league'
    ? [...new Set(filtered.map(m => m.group))].sort()
    : [...new Set(filtered.map(m => m.round))]

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
        <div className="mc2-sections" key={`${gender}-${stage}`}>
          {sections.map(s => {
            const cards = filtered.filter(m => (stage === 'league' ? m.group : m.round) === s)
            return (
              <div key={s} className="mc2-section">
                <div className="mc2-section-head">
                  <span className="mc2-section-title">
                    {stage === 'league' ? `グループ ${s}` : s}
                  </span>
                </div>
                <div className="mc2-card-list">
                  {cards.map(m => <MatchCard key={m.id} m={m} />)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
