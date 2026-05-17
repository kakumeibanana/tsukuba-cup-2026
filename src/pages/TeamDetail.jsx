import { useParams, Link } from 'react-router-dom'
import { teams } from '../data/teams'
import { allMatches } from '../data/matches'

function MatchRow({ m, teamName }) {
  const isHome     = m.home.name === teamName
  const isFinished = m.status === 'finished'
  const myScore    = isHome ? m.scoreH : m.scoreA
  const oppScore   = isHome ? m.scoreA : m.scoreH
  const opponent   = isHome ? m.away.name : m.home.name

  let result = null
  if (isFinished) {
    if (myScore > oppScore)  result = { label: '勝', cls: 'td-res-w' }
    else if (myScore < oppScore) result = { label: '負', cls: 'td-res-l' }
    else                     result = { label: '分', cls: 'td-res-d' }
  }

  const stageLabel = m.stage === 'league'
    ? `予選 グループ${m.group}`
    : m.round

  return (
    <div className="td-match-row">
      <div className="td-match-meta">
        <span className="td-match-date">{m.date}（{m.dow}）</span>
        <span className="td-match-stage">{stageLabel}</span>
      </div>
      <div className="td-match-body">
        <span className="td-match-opp">vs {opponent}</span>
        <div className="td-match-right">
          {isFinished ? (
            <>
              <span className="td-match-score num">{myScore} - {oppScore}</span>
              {result && <span className={`td-res ${result.cls}`}>{result.label}</span>}
            </>
          ) : (
            <span className="td-match-tbd">未定</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TeamDetail() {
  const { id } = useParams()
  const team = teams.find(t => t.id === Number(id))

  if (!team) {
    return (
      <main className="page">
        <div className="page-head">
          <Link to="/teams" className="td-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            チーム一覧に戻る
          </Link>
        </div>
        <p style={{ color: 'var(--ink-400)', marginTop: 40, textAlign: 'center' }}>チームが見つかりません</p>
      </main>
    )
  }

  const pts = team.w * 3 + team.d
  const matches = allMatches.filter(m =>
    m.home.name === team.name || m.away.name === team.name
  )
  const finished  = matches.filter(m => m.status === 'finished')
  const scheduled = matches.filter(m => m.status !== 'finished')

  return (
    <main className="page">
      {/* 戻るリンク */}
      <div className="page-head">
        <Link to="/teams" className="td-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          チーム一覧に戻る
        </Link>
      </div>

      {/* ヒーロー */}
      <div className="td-hero">
        <div className="td-hero-accent" style={{ background: team.color }} />
        <div className="td-hero-body">
          <div className={`team-gender ${team.gender === '男子' ? 'team-gender-m' : 'team-gender-w'}`}>
            {team.gender}
          </div>
          <h1 className="td-name">{team.name}</h1>
          <p className="td-desc">{team.desc}</p>
          <div className="td-group-tag">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            予選グループ {team.group}
          </div>
        </div>
      </div>

      {/* 成績 */}
      <div className="card td-stats-card anim-up">
        <div className="td-stats-row">
          {[
            { label: '勝点', value: pts, color: team.color, big: true },
            { label: '勝',   value: team.w },
            { label: '分',   value: team.d },
            { label: '負',   value: team.l },
            { label: '得点', value: team.gf },
            { label: '失点', value: team.ga },
          ].map(s => (
            <div key={s.label} className="td-stat">
              <div className="td-stat-label">{s.label}</div>
              <div className="td-stat-value num" style={s.color ? { color: s.color, fontSize: s.big ? 28 : 22 } : {}}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 試合 */}
      <div className="card anim-up anim-d1" style={{ marginTop: 14 }}>
        <div className="card-head">
          <div className="card-title">
            <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>
            </svg>
            試合
          </div>
        </div>

        {matches.length === 0 ? (
          <div className="no-results" style={{ paddingTop: 24 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>
            </svg>
            <p>試合データはまだありません</p>
          </div>
        ) : (
          <div className="td-match-list">
            {finished.length > 0 && (
              <div className="td-match-section">
                <div className="td-match-section-label">結果</div>
                {finished.map(m => <MatchRow key={m.id} m={m} teamName={team.name} />)}
              </div>
            )}
            {scheduled.length > 0 && (
              <div className="td-match-section">
                <div className="td-match-section-label">予定</div>
                {scheduled.map(m => <MatchRow key={m.id} m={m} teamName={team.name} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
