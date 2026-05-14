const matches = [
  { id: 1, date: '5/12 (月)', league: '男子 予選リーグ Aグループ', time: '12:25', court: 'コート面', home: 'FC紫炎',    away: 'Blue Wave', scoreH: 3, scoreA: 1, done: true,  result: 'win' },
  { id: 2, date: '5/12 (月)', league: '女子 予選リーグ Bグループ', time: '13:00', court: 'コート面', home: '筑嶺女',     away: 'FC Stella', scoreH: 2, scoreA: 2, done: true,  result: 'draw' },
  { id: 3, date: '5/11 (日)', league: '男子 予選リーグ Cグループ', time: '14:00', court: 'コート面', home: 'FC筑附',    away: 'AVANTI',    scoreH: 5, scoreA: 0, done: true,  result: 'win' },
  { id: 4, date: '5/13 (水)', league: '男子 予選リーグ Aグループ', time: '12:25', court: 'コート面', home: 'FC紫炎',    away: 'Libertà',   scoreH: null, scoreA: null, done: false, result: null },
  { id: 5, date: '5/14 (木)', league: '男子 予選リーグ Bグループ', time: '15:00', court: 'コート面', home: 'Libertà',   away: 'AVANTI',    scoreH: null, scoreA: null, done: false, result: null },
  { id: 6, date: '5/15 (金)', league: '女子 予選リーグ Aグループ', time: '15:15', court: 'コート面', home: 'FC Stella', away: '筑嶺女',     scoreH: null, scoreA: null, done: false, result: null },
]

const pillClass = { win: 'pill-win', draw: 'pill-draw' }
const pillLabel = { win: 'WIN', draw: 'DRAW' }

export default function Matches() {
  return (
    <main className="page">
      <div className="page-head">
        <h2 className="page-title">試合・結果</h2>
      </div>

      <div className="match-list">
        {matches.map(m => (
          <div key={m.id} className={`match-row card${m.done ? '' : ' match-upcoming'}`}>
            <div className="match-meta">
              <span className="num">{m.date}</span>
              <span className="match-league">{m.league}</span>
            </div>
            <div className="match-body">
              <div className={`match-team${m.result === 'win' ? ' winner' : ''}`}>
                <span className="match-team-name">{m.home}</span>
              </div>
              <div className="match-score-block">
                <div className="match-time num">{m.time}</div>
                {m.done
                  ? <div className="match-score num">
                      <span className={m.result === 'win' ? 'w-side' : ''}>{m.scoreH}</span>
                      <span className="dash">-</span>
                      <span>{m.scoreA}</span>
                    </div>
                  : <div className="match-vs">VS</div>
                }
                <div className="match-court">{m.court}</div>
              </div>
              <div className="match-team match-team-away">
                <span className="match-team-name">{m.away}</span>
              </div>
            </div>
            {m.done && <span className={`pill ${pillClass[m.result]}`}>{pillLabel[m.result]}</span>}
          </div>
        ))}
      </div>
    </main>
  )
}
