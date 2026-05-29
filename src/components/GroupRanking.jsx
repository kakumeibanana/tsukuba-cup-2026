import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const medals = ['gold', 'silver', 'bronze']

export default function GroupRanking() {
  const [gender, setGender]   = useState('男子')
  const [matches, setMatches] = useState([])
  const [allGoals, setAllGoals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('matches').select('id, gender'),
      supabase.from('goals').select('player_name, team_name, match_id'),
    ]).then(([{ data: mData }, { data: gData }]) => {
      setMatches(mData ?? [])
      setAllGoals(gData ?? [])
      setLoading(false)
    })
  }, [])

  const scorers = useMemo(() => {
    const matchIds = new Set(matches.filter(m => m.gender === gender).map(m => m.id))
    const counts = {}
    allGoals.filter(g => matchIds.has(g.match_id)).forEach(g => {
      if (!counts[g.player_name])
        counts[g.player_name] = { name: g.player_name, team: g.team_name, goals: 0 }
      counts[g.player_name].goals++
    })
    return Object.values(counts).sort((a, b) => b.goals - a.goals).slice(0, 5)
  }, [allGoals, matches, gender])

  return (
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

      <div className="mc2-segment" style={{ maxWidth: 160, marginBottom: 10 }}>
        {['男子', '女子'].map(g => (
          <button key={g} className={`mc2-seg-btn${gender === g ? ' active' : ''}`}
            onClick={() => setGender(g)}>{g}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '16px 0', color: 'var(--sub)', fontSize: 13 }}>読み込み中...</div>
      ) : scorers.length === 0 ? (
        <div style={{ padding: '16px 0', color: 'var(--sub)', fontSize: 13 }}>得点記録がありません</div>
      ) : (
        <div className="scorer-list">
          {scorers.map((s, i) => (
            <div key={s.name} className="scorer-row">
              <div className="scorer-rank">
                {medals[i]
                  ? <span className={`rank-medal ${medals[i]}`}>{i + 1}</span>
                  : i + 1}
              </div>
              <div className="scorer-name">
                {s.name}
                <span className="team-tag">（{s.team}）</span>
              </div>
              <div className="scorer-goals num">{s.goals}得点</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
