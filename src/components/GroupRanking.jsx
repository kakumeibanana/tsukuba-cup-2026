import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const medals = ['gold', 'silver', 'bronze']

export default function GroupRanking() {
  const [scorers, setScorers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('goals').select('player_name, team_name').then(({ data }) => {
      const counts = {}
      ;(data ?? []).forEach(g => {
        if (!counts[g.player_name])
          counts[g.player_name] = { name: g.player_name, team: g.team_name, goals: 0 }
        counts[g.player_name].goals++
      })
      setScorers(Object.values(counts).sort((a, b) => b.goals - a.goals).slice(0, 5))
      setLoading(false)
    })
  }, [])

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
