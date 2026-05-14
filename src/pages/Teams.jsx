const teams = [
  {
    id: 1,
    name: 'FC紫炎',
    gender: '男子',
    color: '#7c3aed',
    desc: '熱いプレースタイルが持ち味。攻撃的なフットサルで会場を沸かせる。昨年度準優勝。',
    w: 1, d: 0, l: 0, gf: 3,
  },
  {
    id: 2,
    name: 'Blue Wave',
    gender: '男子',
    color: '#1d4ed8',
    desc: '堅守速攻が持ち味。ディフェンスの粘り強さで上位を狙う。',
    w: 0, d: 0, l: 1, gf: 1,
  },
  {
    id: 3,
    name: 'FC筑附',
    gender: '男子',
    color: '#0891b2',
    desc: '筑波大附属の名を背負って挑む地元チーム。爆発的な攻撃力が武器。',
    w: 1, d: 0, l: 0, gf: 5,
  },
  {
    id: 4,
    name: 'Libertà',
    gender: '男子',
    color: '#059669',
    desc: '自由を意味するチーム名の通り、ダイナミックなプレースタイル。',
    w: 0, d: 0, l: 0, gf: 0,
  },
  {
    id: 5,
    name: 'AVANTI',
    gender: '男子',
    color: '#d97706',
    desc: 'チームワークと前向きなメンタリティが最大の武器。',
    w: 0, d: 0, l: 1, gf: 0,
  },
  {
    id: 6,
    name: '筑嶺女',
    gender: '女子',
    color: '#be185d',
    desc: '攻守一体のスタイルで女子部門の頂点を目指す実力派チーム。',
    w: 0, d: 1, l: 0, gf: 2,
  },
  {
    id: 7,
    name: 'FC Stella',
    gender: '女子',
    color: '#7c3aed',
    desc: '星の名を冠した女子の強豪。テクニカルなプレーが持ち味。',
    w: 0, d: 1, l: 0, gf: 2,
  },
]

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
            <div key={t.id} className="team-card">
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
            </div>
          )
        })}
      </div>
    </main>
  )
}
