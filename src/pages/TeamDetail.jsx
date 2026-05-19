import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'


function sortByDate(a, b) {
  const parse = d => { const [m, day] = (d ?? '0/0').split('/').map(Number); return m * 100 + day }
  return parse(a.match_date) - parse(b.match_date)
}

function calcStats(matches, teamName) {
  let w = 0, d = 0, l = 0, gf = 0, ga = 0
  matches
    .filter(m => m.status === 'finished' && m.score_home != null && m.stage === 'league')
    .forEach(m => {
      const isHome = m.home_name === teamName
      const my = isHome ? m.score_home : m.score_away
      const op = isHome ? m.score_away : m.score_home
      gf += my; ga += op
      if (my > op) w++
      else if (my < op) l++
      else d++
    })
  return { w, d, l, gf, ga, pts: w * 3 + d }
}

function MatchRow({ m, teamName, goalsMap }) {
  const isHome     = m.home_name === teamName
  const isFinished = m.status === 'finished'
  const myScore    = isHome ? m.score_home : m.score_away
  const oppScore   = isHome ? m.score_away : m.score_home
  const opponent   = isHome ? m.away_name : m.home_name
  const scorers    = goalsMap[m.id]?.[teamName] ?? []
  const pk         = m.pk_winner

  let result = null
  if (isFinished && myScore != null) {
    if      (myScore > oppScore)             result = { label: '勝', cls: 'td-res-w' }
    else if (myScore < oppScore)             result = { label: '負', cls: 'td-res-l' }
    else if (pk === teamName)                result = { label: 'PK勝', cls: 'td-res-w' }
    else if (pk && pk !== teamName)          result = { label: 'PK負', cls: 'td-res-l' }
    else                                     result = { label: '分', cls: 'td-res-d' }
  }

  const stageLabel = m.stage === 'league' ? `予選 G${m.group_name}` : (m.round ?? '決勝T')

  return (
    <div className={`td-match-row${isFinished ? ' td-match-finished' : ''}`}>
      <div className="td-match-meta">
        <span className="td-match-date num">{m.match_date}（{m.match_dow}）</span>
        <span className="td-match-stage-tag">{stageLabel}</span>
      </div>
      <div className="td-match-body">
        <div className="td-match-opp">
          <span className="td-vs-label">vs</span>
          {opponent}
        </div>
        <div className="td-match-right">
          {isFinished && myScore != null ? (
            <>
              <span className="td-match-score num">{myScore} – {oppScore}</span>
              {pk && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', color: '#6b7280', background: '#f3f4f6', borderRadius: 3, padding: '1px 4px', marginLeft: 2 }}>PK</span>}
              {result && <span className={`td-res ${result.cls}`}>{result.label}</span>}
            </>
          ) : (
            <span className="td-match-tbd">予定</span>
          )}
        </div>
      </div>
      {scorers.length > 0 && (
        <div className="td-match-scorers">⚽ {scorers.join('、')}</div>
      )}
    </div>
  )
}

export default function TeamDetail() {
  const { id } = useParams()
  const [team, setTeam]         = useState(null)
  const [matches, setMatches]   = useState([])
  const [goalsMap, setGoalsMap] = useState({})
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: teamData, error } = await supabase
        .from('teams').select('*, members(*)').eq('id', id).single()

      if (error || !teamData) { setNotFound(true); setLoading(false); return }

      const [{ data: mData }, { data: gData }] = await Promise.all([
        supabase.from('matches').select('*'),
        supabase.from('goals').select('match_id, team_name, player_name'),
      ])

      const teamMatches = (mData ?? [])
        .filter(m => m.home_name === teamData.name || m.away_name === teamData.name)
        .sort(sortByDate)

      const map = {}
      ;(gData ?? []).forEach(g => {
        if (!map[g.match_id]) map[g.match_id] = {}
        if (!map[g.match_id][g.team_name]) map[g.match_id][g.team_name] = []
        map[g.match_id][g.team_name].push(g.player_name)
      })

      setTeam(teamData)
      setMatches(teamMatches)
      setGoalsMap(map)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <main className="page">
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--sub)', fontSize: 14 }}>読み込み中...</div>
      </main>
    )
  }

  if (notFound || !team) {
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

  const stats    = calcStats(matches, team.name)
  const finished = matches.filter(m => m.status === 'finished')
  const upcoming = matches.filter(m => m.status !== 'finished')
  const sortedMembers = [...(team.members ?? [])].sort((a, b) => a.sort_order - b.sort_order)

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
          {team.description && <p className="td-desc">{team.description}</p>}
          {team.group_name && (
            <span className="td-group-tag" style={{ color: team.color, background: `${team.color}18` }}>
              予選グループ {team.group_name}
            </span>
          )}
        </div>
      </div>

      <div className="card td-stats-card anim-up">
        <div className="td-section-label">成績（予選）</div>
        <div className="td-stats-row">
          {[
            { label: '勝点', value: stats.pts, color: team.color, large: true },
            { label: '勝',   value: stats.w,   color: '#16a34a' },
            { label: '分',   value: stats.d,   color: '#6b7280' },
            { label: '負',   value: stats.l,   color: '#dc2626' },
            { label: '得点', value: stats.gf },
            { label: '失点', value: stats.ga },
          ].map(s => (
            <div key={s.label} className="td-stat">
              <div className="td-stat-label">{s.label}</div>
              <div className="td-stat-value num"
                style={{ color: s.color || 'var(--ink-900)', fontSize: s.large ? 30 : 22 }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card anim-up anim-d1">
        <div className="td-section-label">メンバー</div>
        <div className="td-members-grid">
          {sortedMembers.length === 0 ? (
            <div style={{ color: 'var(--sub)', fontSize: 13, padding: '8px 0' }}>メンバー未登録</div>
          ) : sortedMembers.map(m => (
            <div key={m.id ?? m.name} className="td-member">
              <div className="td-member-info">
                <div className="td-member-name" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {m.is_captain && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 18, height: 18, borderRadius: '50%',
                      background: '#f59e0b', color: '#fff',
                      fontSize: 9, fontWeight: 800, flexShrink: 0,
                    }}>C</span>
                  )}
                  {m.name}
                  {m.club && <span style={{ fontSize: 13, lineHeight: 1 }}>⚽</span>}
                </div>
                {m.cls && <span className="td-member-cls">{m.cls}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

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
                {finished.map(m => <MatchRow key={m.id} m={m} teamName={team.name} goalsMap={goalsMap} />)}
              </div>
            )}
            {upcoming.length > 0 && (
              <div className="td-match-section">
                <div className="td-match-section-hd">予定</div>
                {upcoming.map(m => <MatchRow key={m.id} m={m} teamName={team.name} goalsMap={goalsMap} />)}
              </div>
            )}
          </div>
        )}
      </div>

    </main>
  )
}
