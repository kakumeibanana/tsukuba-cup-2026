import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Teams() {
  const [teams, setTeams]     = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    supabase
      .from('teams')
      .select('*, members(*)')
      .eq('is_published', true)
      .order('group_name')
      .order('name')
      .then(({ data, error }) => {
        if (error) { setFetchError(true); setLoading(false); return }
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

  if (fetchError) return (
    <main className="page">
      <div className="page-head"><h2 className="page-title">チーム</h2></div>
      <div style={{ padding: 60, textAlign: 'center', color: 'var(--sub)', fontSize: 14 }}>読み込みに失敗しました。再度お試しください。</div>
    </main>
  )

  const maleByGroup = g => teams.filter(t => t.gender === '男子' && t.group_name === g)
  const femaleTeams = teams.filter(t => t.gender === '女子')

  const renderCard = t => (
    <Link key={t.id} to={`/teams/${t.id}`} className="team-card">
      <div className="team-card-accent" style={{ background: t.color }} />
      <div className="team-card-body">
        <div className={`team-gender ${t.gender === '男子' ? 'team-gender-m' : 'team-gender-w'}`}>
          {t.gender}
        </div>
        <div className="team-card-name">{t.name}</div>
      </div>
    </Link>
  )

  return (
    <main className="page">
      <div className="page-head">
        <h2 className="page-title">チーム</h2>
      </div>

      {teams.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--sub)', fontSize: 14 }}>
          参加チームは現在非公開です
        </div>
      ) : (
        <>
          {['A', 'B', 'C', 'D'].map(g => {
            const list = maleByGroup(g)
            if (list.length === 0) return null
            return (
              <div key={g} style={{ marginBottom: 32 }}>
                <div className="adm-team-group-label" style={{ marginBottom: 12 }}>グループ {g}</div>
                <div className="teams-grid">{list.map(renderCard)}</div>
              </div>
            )
          })}

          {femaleTeams.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <div className="adm-team-group-label" style={{ marginBottom: 12 }}>女子</div>
              <div className="teams-grid">{femaleTeams.map(renderCard)}</div>
            </div>
          )}
        </>
      )}
    </main>
  )
}
