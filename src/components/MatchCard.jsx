import { useState } from 'react'
import { createPortal } from 'react-dom'

function MatchModal({ m, homeScorers, awayScorers, onClose }) {
  const isFinished = m.status === 'finished'
  const isLive     = m.status === 'live'
  const shown      = isFinished || isLive
  const isDraw     = isFinished && m.score_home === m.score_away && !m.pk_winner
  const homeWin    = isFinished && !isDraw && (m.score_home > m.score_away || m.pk_winner === m.home_name)
  const awayWin    = isFinished && !isDraw && (m.score_away > m.score_home || m.pk_winner === m.away_name)
  const hasScorers = shown && (homeScorers.length > 0 || awayScorers.length > 0)
  const stageLabel = m.stage === 'league' ? `グループ ${m.group_name}` : (m.round ?? '決勝T')

  return createPortal(
    <div className="news-modal-bg" onClick={onClose}>
      <div className="mm-modal" onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="mm-header">
          <div className="mm-meta">
            {isLive && <span className="mm-live-dot" />}
            {m.match_date}（{m.match_dow}）&nbsp;·&nbsp;{stageLabel}
          </div>
          <button className="mm-close" onClick={onClose}>✕</button>
        </div>

        {/* ── Body ── */}
        <div className="mm-body">

          {/* Scoreboard */}
          <div className="mm-scoreboard">
            <div className={`mm-team${homeWin ? ' mm-win' : ''}`}>{m.home_name}</div>
            <div className="mm-score-block">
              {shown && m.score_home != null ? (
                <div className="mm-score-num num">
                  <span className={homeWin ? 'mm-score-w' : ''}>{m.score_home}</span>
                  <span className="mm-score-sep">-</span>
                  <span className={awayWin ? 'mm-score-w' : ''}>{m.score_away}</span>
                </div>
              ) : (
                <div className="mm-vs">vs</div>
              )}
              {!shown && m.match_time && m.status !== 'cancelled' && (
                <div className="mm-time">{m.match_time}</div>
              )}
            </div>
            <div className={`mm-team mm-team-r${awayWin ? ' mm-win' : ''}`}>{m.away_name}</div>
          </div>

          {isFinished && m.pk_winner && (
            <div className="mm-pk-note">PK戦：<strong>{m.pk_winner}</strong> 勝利</div>
          )}
          {m.status === 'cancelled' && (
            <div className="mm-pk-note" style={{ color: '#9ca3af' }}>この試合は中止になりました</div>
          )}

          {/* Scorers */}
          {hasScorers && (
            <div className="mm-section">
              <div className="mm-section-label">⚽ 得点者</div>
              <div className="mm-scorers">
                <div className="mm-scorers-l">
                  {homeScorers.map((s, i) => <span key={i} className="mm-scorer">{s}</span>)}
                </div>
                <div className="mm-scorers-div" />
                <div className="mm-scorers-r">
                  {awayScorers.map((s, i) => <span key={i} className="mm-scorer">{s}</span>)}
                </div>
              </div>
            </div>
          )}

          {/* MOM */}
          {isFinished && m.mom && (
            <div className="mm-section">
              <div className="mm-section-label">⭐ MOM</div>
              <div className="mm-mom-name">{m.mom}</div>
            </div>
          )}

        </div>
      </div>
    </div>,
    document.body
  )
}

export default function MatchCard({ m, homeScorers = [], awayScorers = [] }) {
  const [open, setOpen] = useState(false)

  const isFinished  = m.status === 'finished'
  const isLive      = m.status === 'live'
  const isCancelled = m.status === 'cancelled'
  const isDraw      = isFinished && m.score_home === m.score_away
  const homeWin     = isFinished && (m.score_home > m.score_away || (isDraw && m.pk_winner === m.home_name))
  const awayWin     = isFinished && (m.score_away > m.score_home || (isDraw && m.pk_winner === m.away_name))
  const hasScorers  = (isFinished || isLive) && (homeScorers.length > 0 || awayScorers.length > 0)

  return (
    <>
      <div
        className={[
          'mc2-card',
          isFinished  && 'mc2-finished',
          isLive      && 'mc2-live',
          isCancelled && 'mc2-cancelled',
        ].filter(Boolean).join(' ')}
        onClick={() => setOpen(true)}
        style={{ cursor: 'pointer' }}
      >
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
              <>
                <div className="mc2-score num">
                  <span className={homeWin ? 'mc2-win-num' : ''}>{m.score_home}</span>
                  <span className="mc2-sep">-</span>
                  <span className={awayWin ? 'mc2-win-num' : ''}>{m.score_away}</span>
                </div>
                {isFinished && m.pk_winner && (
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', color: '#6b7280', textAlign: 'center', marginTop: 2 }}>
                    PK: {m.pk_winner}
                  </div>
                )}
              </>
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

        {isFinished && m.mom && (
          <div className="mc2-mom">
            <span className="mc2-mom-icon">⭐</span>
            <span className="mc2-mom-label">MOM</span>
            <span className="mc2-mom-name">{m.mom}</span>
          </div>
        )}
      </div>

      {open && (
        <MatchModal
          m={m}
          homeScorers={homeScorers}
          awayScorers={awayScorers}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
