import { useState } from 'react'

const allMatches = [
  // 男子 予選リーグ
  { id: 1,  gender: '男子', stage: 'league', group: 'A', date: '6/8',  dow: '月', time: '10:00', home: { name: 'FC紫炎',   scorers: ['田中 悠真 ×2', '鈴木 大地'] }, away: { name: 'Blue Wave', scorers: ['山本 陸'] },    scoreH: 3, scoreA: 1, status: 'finished' },
  { id: 2,  gender: '男子', stage: 'league', group: 'A', date: '6/8',  dow: '月', time: '11:20', home: { name: 'Libertà',  scorers: [] },                          away: { name: 'FC筑附',   scorers: [] },              scoreH: null, scoreA: null, status: 'scheduled' },
  { id: 3,  gender: '男子', stage: 'league', group: 'B', date: '6/8',  dow: '月', time: '12:40', home: { name: '筑嶺男',  scorers: [] },                           away: { name: 'AVANTI',   scorers: [] },              scoreH: null, scoreA: null, status: 'scheduled' },
  { id: 4,  gender: '男子', stage: 'league', group: 'B', date: '6/8',  dow: '月', time: '14:00', home: { name: 'T.A.S.',  scorers: [] },                           away: { name: 'Nordica',  scorers: [] },              scoreH: null, scoreA: null, status: 'live' },
  { id: 5,  gender: '男子', stage: 'league', group: 'C', date: '6/15', dow: '月', time: '10:00', home: { name: 'FC筑附',  scorers: [] },                           away: { name: 'Phoenix',  scorers: [] },              scoreH: null, scoreA: null, status: 'scheduled' },
  { id: 6,  gender: '男子', stage: 'league', group: 'C', date: '6/15', dow: '月', time: '11:20', home: { name: 'FC紫炎',  scorers: [] },                           away: { name: 'T.A.S.',   scorers: [] },              scoreH: null, scoreA: null, status: 'scheduled' },
  // 男子 決勝トーナメント
  { id: 7,  gender: '男子', stage: 'tournament', round: '準決勝', date: '7/6',  dow: '月', time: '10:00', home: { name: 'TBD', scorers: [] }, away: { name: 'TBD', scorers: [] }, scoreH: null, scoreA: null, status: 'scheduled' },
  { id: 8,  gender: '男子', stage: 'tournament', round: '決勝',   date: '7/12', dow: '月', time: '14:00', home: { name: 'TBD', scorers: [] }, away: { name: 'TBD', scorers: [] }, scoreH: null, scoreA: null, status: 'scheduled' },
  // 女子 予選リーグ
  { id: 9,  gender: '女子', stage: 'league', group: 'A', date: '6/8',  dow: '月', time: '10:00', home: { name: '筑嶺女',   scorers: ['高草木 悠 ×2'] }, away: { name: 'FC Stella', scorers: ['伊藤'] }, scoreH: 2, scoreA: 1, status: 'finished' },
  { id: 10, gender: '女子', stage: 'league', group: 'A', date: '6/8',  dow: '月', time: '11:20', home: { name: 'Flare',    scorers: [] },               away: { name: '筑嶺女',    scorers: [] },       scoreH: null, scoreA: null, status: 'scheduled' },
  { id: 11, gender: '女子', stage: 'league', group: 'B', date: '6/15', dow: '月', time: '10:00', home: { name: 'FC Stella',scorers: [] },               away: { name: 'Flare',     scorers: [] },       scoreH: null, scoreA: null, status: 'scheduled' },
  // 女子 決勝トーナメント
  { id: 12, gender: '女子', stage: 'tournament', round: '決勝', date: '7/12', dow: '月', time: '13:00', home: { name: 'TBD', scorers: [] }, away: { name: 'TBD', scorers: [] }, scoreH: null, scoreA: null, status: 'scheduled' },
]

const STATUS_CONFIG = {
  scheduled: { label: 'Scheduled', cls: 'ms-scheduled' },
  live:       { label: 'Live',      cls: 'ms-live' },
  finished:   { label: 'Finished',  cls: 'ms-finished' },
  cancelled:  { label: 'Cancelled', cls: 'ms-cancelled' },
}

export default function Matches() {
  const [gender, setGender] = useState('男子')
  const [stage, setStage]   = useState('league')

  const filtered = allMatches.filter(m => m.gender === gender && m.stage === stage)

  const groups = stage === 'league'
    ? [...new Set(filtered.map(m => m.group))].sort()
    : [...new Set(filtered.map(m => m.round))]

  return (
    <main className="page">
      <div className="page-head">
        <h2 className="page-title">試合・結果</h2>
      </div>

      {/* Gender toggle */}
      <div className="matches-gender-toggle">
        {['男子', '女子'].map(g => (
          <button
            key={g}
            className={`gender-btn${gender === g ? ' active' : ''}`}
            onClick={() => setGender(g)}
          >{g}</button>
        ))}
      </div>

      {/* Stage tabs */}
      <div className="matches-stage-tabs">
        <button
          className={`stage-tab${stage === 'league' ? ' active' : ''}`}
          onClick={() => setStage('league')}
        >予選リーグ</button>
        <button
          className={`stage-tab${stage === 'tournament' ? ' active' : ''}`}
          onClick={() => setStage('tournament')}
        >決勝トーナメント</button>
      </div>

      {/* Match cards grouped */}
      <div className="match-sections">
        {groups.map(g => (
          <div key={g} className="match-section">
            <div className="match-section-label">
              {stage === 'league' ? `${g}グループ` : g}
            </div>
            <div className="match-cards">
              {filtered.filter(m => (stage === 'league' ? m.group : m.round) === g).map(m => {
                const sc = STATUS_CONFIG[m.status]
                return (
                  <div key={m.id} className={`match-card${m.status === 'live' ? ' is-live' : ''}`}>
                    {/* Header */}
                    <div className="mc-header">
                      <span className="mc-date num">{m.date}({m.dow}) {m.time}</span>
                      <span className={`mc-status ${sc.cls}`}>
                        {m.status === 'live' && <span className="mc-live-dot" />}
                        {sc.label}
                      </span>
                    </div>

                    {/* Teams + Score */}
                    <div className="mc-body">
                      <div className="mc-team mc-team-home">
                        <span className="mc-team-name">{m.home.name}</span>
                        {m.home.scorers.length > 0 && (
                          <span className="mc-scorers">{m.home.scorers.join(', ')}</span>
                        )}
                      </div>

                      <div className="mc-score-wrap">
                        {m.status === 'finished'
                          ? <div className="mc-score num">{m.scoreH}<span className="mc-dash">-</span>{m.scoreA}</div>
                          : m.status === 'live'
                          ? <div className="mc-score num is-live-score">{m.scoreH ?? 0}<span className="mc-dash">-</span>{m.scoreA ?? 0}</div>
                          : <div className="mc-vs">VS</div>
                        }
                      </div>

                      <div className="mc-team mc-team-away">
                        <span className="mc-team-name">{m.away.name}</span>
                        {m.away.scorers.length > 0 && (
                          <span className="mc-scorers">{m.away.scorers.join(', ')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
