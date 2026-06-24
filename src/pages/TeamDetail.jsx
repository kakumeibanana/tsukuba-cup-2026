import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { calcGroupStandings } from '../lib/standings'
import { normalizeMatch } from '../lib/normalizeMatch'
import StTable from '../components/StTable'

const MEDAL = { 1: 'gold', 2: 'silver', 3: 'bronze', 4: 'fourth' }

function rankOf(rows, i) {
  const r = rows[i]
  for (let j = 0; j < i; j++) {
    if (rows[j].pts === r.pts && rows[j].gd === r.gd && rows[j].gf === r.gf) return j + 1
  }
  return i + 1
}

function safeColor(hex) {
  if (!hex || hex.length < 7) return 'var(--purple)'
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 180 ? 'var(--purple)' : hex
}

function sortByDate(a, b) {
  const pd = d => { const [m, day] = (d ?? '0/0').split('/').map(Number); return m * 100 + day }
  const pt = t => { if (!t) return 0; const [h, min] = t.split(':').map(Number); return h * 60 + (min || 0) }
  return pd(a.match_date) - pd(b.match_date) || pt(a.match_time) - pt(b.match_time)
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

  const stageLabel = m.stage === 'league' ? `グループ ${m.group_name}` : (m.round ?? '決勝T')

  return (
    <div className={`td-match-row${isFinished ? ' td-match-finished' : ''}`}>
      <div className="td-match-meta">
        <span className="td-match-date num">
          {m.match_date}（{m.match_dow}）{!isFinished && m.match_time ? <span className="td-match-time"> · {m.match_time}</span> : ''}
        </span>
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
              {pk && <span style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', background: '#f3f4f6', borderRadius: 3, padding: '1px 4px', marginLeft: 2 }}>PK</span>}
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
  const [team, setTeam]           = useState(null)
  const [allMatches, setAllMatches] = useState([])
  const [goalsMap, setGoalsMap]   = useState({})
  const [rawGoals, setRawGoals]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [notFound, setNotFound]   = useState(false)

  useEffect(() => {
    async function load() {
      const { data: teamData, error } = await supabase
        .from('teams').select('*, members(*)').eq('id', id).single()

      if (error || !teamData) { setNotFound(true); setLoading(false); return }

      const [{ data: mData, error: mErr }, { data: gData, error: gErr }] = await Promise.all([
        supabase.from('matches').select('*'),
        supabase.from('goals').select('match_id, team_name, player_name'),
      ])
      if (mErr || gErr) { setNotFound(true); setLoading(false); return }

      const map = {}
      ;(gData ?? []).forEach(g => {
        if (!map[g.match_id]) map[g.match_id] = {}
        if (!map[g.match_id][g.team_name]) map[g.match_id][g.team_name] = []
        map[g.match_id][g.team_name].push(g.player_name)
      })

      setTeam(teamData)
      setAllMatches((mData ?? []).map(normalizeMatch))
      setGoalsMap(map)
      setRawGoals(gData ?? [])
      setLoading(false)
    }
    load()
    const channel = supabase
      .channel(`team-detail-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'goals' },   load)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [id])

  if (loading) return (
    <main className="page">
      <div style={{ padding: 60, textAlign: 'center', color: 'var(--sub)', fontSize: 14 }}>読み込み中...</div>
    </main>
  )

  if (notFound || !team) return (
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

  const sortedMembers = [...(team.members ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  const teamMatches   = allMatches.filter(m => m.home_name === team.name || m.away_name === team.name).sort(sortByDate)
  const stats         = calcStats(teamMatches, team.name)
  const finished      = teamMatches.filter(m => m.status === 'finished')
  const upcoming      = teamMatches.filter(m => m.status !== 'finished')
  const groupRows     = team.group_name ? calcGroupStandings(allMatches, team.gender, team.group_name) : []

  const scorerCounts = {}
  rawGoals.filter(g => g.team_name === team.name).forEach(g => {
    scorerCounts[g.player_name] = (scorerCounts[g.player_name] ?? 0) + 1
  })
  const teamScorers = Object.entries(scorerCounts)
    .map(([name, goals]) => ({ name, goals }))
    .sort((a, b) => b.goals - a.goals)

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

      {/* Hero */}
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              {team.group_name && (
                <span className="td-group-badge">G {team.group_name}</span>
              )}
              <div className="td-hero-avatar" style={{ background: team.color }}>
                {team.name.slice(0, 2)}
              </div>
            </div>
          </div>
          {team.description && <p className="td-desc">{team.description}</p>}
          {team.color_name && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: team.color, border: '1.5px solid rgba(0,0,0,0.1)', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--ink-500)', fontWeight: 600 }}>チームカラー：{team.color_name}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Members */}
      <div className="card">
        <div className="td-section-label">
          メンバー
          <span className="td-section-count">{sortedMembers.length}人</span>
        </div>
        {sortedMembers.length === 0 ? (
          <div style={{ color: 'var(--sub)', fontSize: 13 }}>メンバー未登録</div>
        ) : (
          <div className="td-roster">
            {sortedMembers.map((m, i) => (
              <div key={m.id ?? m.name} className={`td-roster-row${m.is_captain ? ' td-roster-leader' : ''}`}>
                <div className="td-roster-num">{i + 1}</div>
                <div className="td-roster-av" style={{
                  background: m.is_captain ? '#f59e0b' : `${team.color}18`,
                  color: m.is_captain ? '#fff' : safeColor(team.color),
                }}>
                  {m.is_captain
                    ? <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm2 3a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2H7z"/></svg>
                    : m.name.slice(0, 1)}
                </div>
                <div className="td-roster-info">
                  <div className="td-roster-name">{m.name}</div>
                  <div className="td-roster-cls">{m.cls}</div>
                </div>
                <div className="td-roster-badges">
                  {m.is_captain && <span className="td-badge-leader">リーダー</span>}
                  {m.club && <span className="td-badge-soccer">⚽ 部活</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="card td-stats-card">
        <div className="td-section-label">成績（予選）</div>
        <div className="td-stats-row">
          {[
            { label: '勝点', value: stats.pts, color: safeColor(team.color), large: true },
            { label: '勝',   value: stats.w,   color: '#16a34a' },
            { label: '分',   value: stats.d,   color: '#6b7280' },
            { label: '負',   value: stats.l,   color: '#dc2626' },
            { label: '得点', value: stats.gf },
            { label: '失点', value: stats.ga },
          ].map(s => (
            <div key={s.label} className="td-stat">
              <div className="td-stat-label">{s.label}</div>
              <div className="td-stat-value num" style={{ color: s.color || 'var(--ink-900)', fontSize: s.large ? 30 : 22 }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Group standings */}
      {groupRows.length > 0 && (
        <div className="card">
          <div className="td-section-label">グループ {team.group_name} 順位表</div>
          <StTable>
            <table className="table st-table">
              <thead>
                <tr>
                  <th style={{ width: 28 }}></th>
                  <th>チーム</th>
                  <th className="r">試</th>
                  <th className="r">勝</th>
                  <th className="r">分</th>
                  <th className="r">負</th>
                  <th className="r">得</th>
                  <th className="r">失</th>
                  <th className="r">±</th>
                  <th className="r">勝点</th>
                </tr>
              </thead>
              <tbody>
                {groupRows.map((row, i) => {
                  const rank = rankOf(groupRows, i)
                  return (
                  <tr key={row.name} className={`${rank === 1 ? 'top-row' : ''}${row.name === team.name ? ' td-my-row' : ''}`}>
                    <td className="rank">
                      {MEDAL[rank]
                        ? <span className={`rank-medal ${MEDAL[rank]}`}>{rank}</span>
                        : rank}
                    </td>
                    <td className="team-cell" style={row.name === team.name ? { fontWeight: 800 } : {}}>
                      {row.name}
                    </td>
                    <td className="right">{row.g}</td>
                    <td className="right">{row.w}</td>
                    <td className="right">{row.d}</td>
                    <td className="right">{row.l}</td>
                    <td className="right">{row.gf}</td>
                    <td className="right">{row.ga}</td>
                    <td className="right">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                    <td className="pts">{row.pts}</td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </StTable>
        </div>
      )}

      {/* Team scorers */}
      {teamScorers.length > 0 && (
        <div className="card">
          <div className="td-section-label">チーム内得点ランキング</div>
          <div className="scorer-list">
            {teamScorers.map((s, i) => (
              <div key={s.name} className="scorer-row">
                <div className="scorer-rank">{i + 1}</div>
                <div className="scorer-name">{s.name}</div>
                <div className="scorer-goals num">{s.goals} 得点</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Matches */}
      <div className="card">
        {teamMatches.length === 0 ? (
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

      </div>{/* end card stack */}
    </main>
  )
}
