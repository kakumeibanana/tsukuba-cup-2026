import { Link } from 'react-router-dom'
import { teams } from '../data/teams'

export default function Teams() {
  return (
    <main className="page">
      <div className="page-head">
        <h2 className="page-title">チーム</h2>
      </div>

      <div className="teams-grid">
        {teams.map(t => {
          const pts = t.w * 3 + t.d
          return (
            <Link key={t.id} to={`/teams/${t.id}`} className="team-card">
              <div className="team-card-accent" style={{ background: t.color }} />
              <div className="team-card-body">
                <div className={`team-gender ${t.gender === '男子' ? 'team-gender-m' : 'team-gender-w'}`}>
                  {t.gender}
                </div>
                <div className="team-card-name">{t.name}</div>
                <p className="team-card-desc">{t.desc}</p>
                <div className="team-card-stats">
                  <div className="team-stat-item">
                    <div className="team-stat-label">勝点</div>
                    <div className="team-stat-value" style={{ color: t.color }}>{pts}</div>
                  </div>
                  <div className="team-stat-item">
                    <div className="team-stat-label">得点</div>
                    <div className="team-stat-value">{t.gf}</div>
                  </div>
                  <div className="team-stat-item">
                    <div className="team-stat-label">勝-分-負</div>
                    <div className="team-stat-value" style={{ fontSize: 13 }}>{t.w}-{t.d}-{t.l}</div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
