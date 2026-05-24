export default function MatchCard({ m, homeScorers = [], awayScorers = [] }) {
  const isFinished  = m.status === 'finished'
  const isLive      = m.status === 'live'
  const isCancelled = m.status === 'cancelled'
  const isDraw      = isFinished && m.score_home === m.score_away
  const homeWin     = isFinished && (m.score_home > m.score_away || (isDraw && m.pk_winner === m.home_name))
  const awayWin     = isFinished && (m.score_away > m.score_home || (isDraw && m.pk_winner === m.away_name))
  const hasScorers  = (isFinished || isLive) && (homeScorers.length > 0 || awayScorers.length > 0)

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
  )
}
