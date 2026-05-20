export default function TournamentBracket({ matches }) {
  const tournament = matches.filter(m => m.stage === 'tournament')

  const semi  = tournament.filter(m => m.round === '準決勝').sort((a, b) => a.home_name.localeCompare(b.home_name))
  const final = tournament.find(m => m.round === '決勝')
  const third = tournament.find(m => m.round === '3位決定戦')

  if (tournament.length === 0) return (
    <div className="bracket-empty">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--sub)', marginBottom: 8 }}>
        <path d="M8 21h8M12 17V21M17 5V3H7v2M5 5v6a7 7 0 0014 0V5H5z"/>
      </svg>
      <div>決勝トーナメントは予選終了後に組まれます</div>
    </div>
  )

  return (
    <div className="bracket-wrap">
      {/* 準決勝 */}
      {semi.length > 0 && (
        <div className="bracket-round">
          <div className="bracket-round-label">準決勝</div>
          <div className="bracket-cards">
            {semi.map(m => <BracketCard key={m.id} m={m} />)}
          </div>
        </div>
      )}

      {/* 決勝 */}
      {final && (
        <div className="bracket-round bracket-round-final">
          <div className="bracket-round-label">決勝</div>
          <div className="bracket-cards">
            <BracketCard m={final} highlight />
          </div>
        </div>
      )}

      {/* 3位決定戦 */}
      {third && (
        <div className="bracket-round">
          <div className="bracket-round-label">3位決定戦</div>
          <div className="bracket-cards">
            <BracketCard m={third} />
          </div>
        </div>
      )}
    </div>
  )
}

function BracketCard({ m, highlight }) {
  const finished = m.status === 'finished'
  const homeWin  = finished && (m.score_home > m.score_away || (m.score_home === m.score_away && m.pk_winner === m.home_name))
  const awayWin  = finished && (m.score_away > m.score_home || (m.score_home === m.score_away && m.pk_winner === m.away_name))

  return (
    <div className={`bracket-card${highlight ? ' bracket-card-final' : ''}${finished ? ' bracket-card-done' : ''}`}>
      <BracketTeam name={m.home_name} score={m.score_home} win={homeWin} finished={finished} />
      <div className="bracket-divider" />
      <BracketTeam name={m.away_name} score={m.score_away} win={awayWin} finished={finished} />
      {finished && m.pk_winner && (
        <div className="bracket-pk-note">PK: {m.pk_winner} 勝ち</div>
      )}
    </div>
  )
}

function BracketTeam({ name, score, win, finished }) {
  return (
    <div className={`bracket-team${win ? ' bracket-team-win' : ''}`}>
      <span className="bracket-team-name">{name ?? 'TBD'}</span>
      {finished && score != null && (
        <span className={`bracket-team-score num${win ? ' bracket-score-win' : ''}`}>{score}</span>
      )}
    </div>
  )
}
