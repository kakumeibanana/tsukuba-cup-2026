import { useParams, Link } from 'react-router-dom'
import { teams } from '../data/teams'
import { allMatches } from '../data/matches'

function MatchRow({ m, teamName }) {
  const isHome     = m.home.name === teamName
  const isFinished = m.status === 'finished'
  const myScore    = isHome ? m.scoreH : m.scoreA
  const oppScore   = isHome ? m.scoreA : m.scoreH
  const opponent   = isHome ? m.away.name : m.home.name
  const scorers    = isHome ? m.home.scorers : m.away.scorers

  let result = null
  if (isFinished) {
    if (myScore > oppScore)       result = { label: '勝', cls: 'td-res-w' }
    else if (myScore < oppScore)  result = { label: '負', cls: 'td-res-l' }
    else                          result = { label: '分', cls: 'td-res-d' }
  }

  const stageLabel = m.stage === 'league' ? `予選 グループ${m.group}` : m.round

  return (
    <div className={`td-match-row${isFinished ? ' td-match-finished' : ''}`}>
      <div className="td-match-meta">
        <span className="td-match-date num">{m.date}（{m.dow}）</span>
        <span className="td-match-stage-tag">{stageLabel}</span>
      </div>
      <div className="td-match-body">
        <div className="td-match-opp">
          <span className="td-vs-label">vs</span>
          {opponent}
        </div>
        <div className="td-match-right">
          {isFinished ? (
            <>
              <span className="td-match-score num">{myScore} – {oppScore}</span>
              {result && <span className={`td-res ${result.cls}`}>{result.label}</span>}
            </>
          ) : (
            <span className="td-match-tbd">予定</span>
          )}
        </div>
      </div>
      {isFinished && scorers.length > 0 && (
        <div className="td-match-scorers">
          ⚽ {scorers.join('、')}
        </div>
      )}
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
  const matches  = allMatches.filter(m => m.home.name === team.name || m.away.name === team.name)
  const finished = matches.filter(m => m.status === 'finished')
  const upcoming = matches.filter(m => m.status !== 'finished')

  return (
    <main className="page">

      {/* 戻る */}
      <div className="page-head">
        <Link to="/teams" className="td-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          チーム一覧に戻る
        </Link>
      </div>

      {/* ── ヒーロー ── */}
      <div className="td-hero">
        <div className="td-hero-stripe" style={{ background: team.color }} />
        <div className="td-hero-body">
          <div className="td-hero-top">
            <div>
              <div className={`team-gender ${team.gender === '男子' ? 'team-gender-m' : 'team-gender-w'}`}>
                {team.gender}
              </div>
              <h1 className="td-name">{team.name}</h1>
            </div>
            <div className="td-hero-avatar" style={{ background: team.color }}>
              {team.name.slice(0, 2)}
            </div>
          </div>
          <p className="td-desc">{team.desc}</p>
          <span className="td-group-tag" style={{ color: team.color, background: `${team.color}18` }}>
            予選グループ {team.group}
          </span>
        </div>
      </div>

      {/* ── 成績 ── */}
      <div className="card td-stats-card anim-up">
        <div className="td-section-label">成績</div>
        <div className="td-stats-row">
          {[
            { label: '勝点', value: pts,     color: team.color, large: true },
            { label: '勝',   value: team.w,  color: '#16a34a' },
            { label: '分',   value: team.d,  color: '#6b7280' },
            { label: '負',   value: team.l,  color: '#dc2626' },
            { label: '得点', value: team.gf },
            { label: '失点', value: team.ga },
          ].map(s => (
            <div key={s.label} className="td-stat">
              <div className="td-stat-label">{s.label}</div>
              <div
                className="td-stat-value num"
                style={{ color: s.color || 'var(--ink-900)', fontSize: s.large ? 30 : 22 }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── メンバー ── */}
      <div className="card anim-up anim-d1">
        <div className="td-section-label">メンバー</div>
        <div className="td-members-grid">
          {team.members.map(m => (
            <div key={m.name} className="td-member">
              <div className="td-member-avatar" style={{ background: `${team.color}20`, color: team.color }}>
                {m.name[0]}
              </div>
              <div className="td-member-info">
                <div className="td-member-name">{m.name}</div>
                {m.role && (
                  <span className="td-member-role" style={{ background: `${team.color}18`, color: team.color }}>
                    {m.role}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 試合 ── */}
      <div className="card anim-up anim-d2">
        <div className="td-section-label">試合</div>

        {matches.length === 0 ? (
          <div className="no-results" style={{ paddingTop: 20 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>
            </svg>
            <p>試合データはまだありません</p>
          </div>
        ) : (
          <div className="td-match-list">
            {finished.length > 0 && (
              <div className="td-match-section">
                <div className="td-match-section-hd">結果</div>
                {finished.map(m => <MatchRow key={m.id} m={m} teamName={team.name} />)}
              </div>
            )}
            {upcoming.length > 0 && (
              <div className="td-match-section">
                <div className="td-match-section-hd">予定</div>
                {upcoming.map(m => <MatchRow key={m.id} m={m} teamName={team.name} />)}
              </div>
            )}
          </div>
        )}
      </div>

    </main>
  )
}
