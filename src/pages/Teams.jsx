import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Teams() {
  const [teams, setTeams]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('teams')
      .select('*, members(*)')
      .order('gender')
      .order('name')
      .then(({ data }) => {
        setTeams(data ?? [])
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <main className="page">
      <div className="page-head"><h2 className="page-title">チーム</h2></div>
      <div style={{ padding: 60, textAlign: 'center', color: 'var(--sub)', fontSize: 14 }}>読み込み中...</div>
    </main>
  )

  const byGender = g => teams.filter(t => t.gender === g)

  return (
    <main className="page">
      <div className="page-head">
        <h2 className="page-title">チーム</h2>
      </div>

      {teams.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--sub)', fontSize: 14 }}>
          参加チームはまだありません
        </div>
      ) : (
        ['男子', '女子'].map(g => {
          const list = byGender(g)
          if (list.length === 0) return null
          return (
            <div key={g} style={{ marginBottom: 32 }}>
              <div className="adm-team-group-label" style={{ marginBottom: 12 }}>{g}の部</div>
              <div className="teams-grid">
                {list.map(t => {
                  const leader = (t.members ?? []).find(m => m.is_captain)
                  return (
                    <Link key={t.id} to={`/teams/${t.id}`} className="team-card">
                      <div className="team-card-accent" style={{ background: t.color }} />
                      <div className="team-card-body">
                        <div className={`team-gender ${t.gender === '男子' ? 'team-gender-m' : 'team-gender-w'}`}>
                          {t.gender}
                        </div>
                        <div className="team-card-name">{t.name}</div>
                        {t.description && <p className="team-card-desc">{t.description}</p>}
                        <div className="team-card-stats">
                          <div className="team-stat-item">
                            <div className="team-stat-label">人数</div>
                            <div className="team-stat-value" style={{ color: t.color }}>
                              {(t.members ?? []).length}
                            </div>
                          </div>
                          {t.color_name && (
                            <div className="team-stat-item">
                              <div className="team-stat-label">カラー</div>
                              <div className="team-stat-value" style={{ fontSize: 12 }}>{t.color_name}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })
      )}
    </main>
  )
}
