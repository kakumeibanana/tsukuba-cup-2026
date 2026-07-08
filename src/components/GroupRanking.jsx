import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const MEDAL = { 1: 'gold', 2: 'silver', 3: 'bronze' }

// 5位の値と同率の選手を全員含める
function cutAtRank5(sorted, key) {
  if (sorted.length <= 5) return sorted
  const threshold = sorted[4][key]
  return sorted.filter(s => s[key] >= threshold)
}

function tiedRank(list, i, key) {
  const val = list[i][key]
  return list.findIndex(s => s[key] === val) + 1
}

function RankList({ list, statKey, statLabel, empty }) {
  if (list.length === 0)
    return <div style={{ padding: '16px 0', color: 'var(--sub)', fontSize: 13 }}>{empty}</div>
  return (
    <div className="scorer-list">
      {list.map((s, i) => {
        const rank = tiedRank(list, i, statKey)
        return (
          <div key={s.name} className="scorer-row">
            <div className="scorer-rank">
              {MEDAL[rank]
                ? <span className={`rank-medal ${MEDAL[rank]}`}>{rank}</span>
                : rank}
            </div>
            <div className="scorer-name">
              {s.name}
              <span className="team-tag">（{s.team}）</span>
            </div>
            <div className="scorer-goals num">{s[statKey]}{statLabel}</div>
          </div>
        )
      })}
    </div>
  )
}

export default function GroupRanking() {
  const [gender, setGender]   = useState('男子')
  const [matches, setMatches] = useState([])
  const [allGoals, setAllGoals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('matches').select('id, gender'),
      supabase.from('goals').select('player_name, team_name, match_id, assist_player, own_goal'),
    ]).then(([{ data: mData, error: mErr }, { data: gData, error: gErr }]) => {
      if (mErr || gErr) { setLoading(false); return }
      setMatches(mData ?? [])
      setAllGoals(gData ?? [])
      setLoading(false)
    })
  }, [])

  const scorers = useMemo(() => {
    const matchIds = new Set(matches.filter(m => m.gender === gender).map(m => m.id))
    const counts = {}
    allGoals.filter(g => !g.own_goal && matchIds.has(g.match_id)).forEach(g => {
      if (!counts[g.player_name])
        counts[g.player_name] = { name: g.player_name, team: g.team_name, goals: 0 }
      counts[g.player_name].goals++
    })
    return cutAtRank5(Object.values(counts).sort((a, b) => b.goals - a.goals), 'goals')
  }, [allGoals, matches, gender])

  const assists = useMemo(() => {
    const matchIds = new Set(matches.filter(m => m.gender === gender).map(m => m.id))
    const counts = {}
    allGoals.filter(g => g.assist_player && matchIds.has(g.match_id)).forEach(g => {
      if (!counts[g.assist_player])
        counts[g.assist_player] = { name: g.assist_player, team: g.team_name, assists: 0 }
      counts[g.assist_player].assists++
    })
    return cutAtRank5(Object.values(counts).sort((a, b) => b.assists - a.assists), 'assists')
  }, [allGoals, matches, gender])

  const genderSeg = (
    <div className="mc2-segment" style={{ maxWidth: 160, marginBottom: 12 }}>
      {['男子', '女子'].map(g => (
        <button key={g} className={`mc2-seg-btn${gender === g ? ' active' : ''}`}
          onClick={() => setGender(g)}>{g}</button>
      ))}
    </div>
  )

  return (
    <>
      <div className="card">
        <div className="card-head">
          <div className="card-title">
            <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="5"/><path d="M12 13v8M9 18l3 3 3-3"/>
            </svg>
            得点ランキング
          </div>
          <Link to="/standings" className="link-more">
            すべて見る
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
        {genderSeg}
        {loading ? (
          <div style={{ padding: '16px 0', color: 'var(--sub)', fontSize: 13 }}>読み込み中...</div>
        ) : (
          <RankList list={scorers} statKey="goals" statLabel="得点" empty="得点記録がありません" />
        )}
      </div>

      <div className="card" style={{ marginTop: 22 }}>
        <div className="card-head">
          <div className="card-title">
            <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7-7 7 7"/>
            </svg>
            アシストランキング
          </div>
          <Link to="/standings" className="link-more">
            すべて見る
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
        {genderSeg}
        {loading ? (
          <div style={{ padding: '16px 0', color: 'var(--sub)', fontSize: 13 }}>読み込み中...</div>
        ) : (
          <RankList list={assists} statKey="assists" statLabel="アシスト" empty="アシスト記録がありません" />
        )}
      </div>
    </>
  )
}
