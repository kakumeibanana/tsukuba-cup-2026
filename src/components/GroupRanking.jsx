import { useState } from 'react'

const groups = {
  A: [
    { medal: 'gold',   rank: 1, name: 'FC紫炎',   pts: 6, diff: '+5', fill: '#5b21b6', shape: <path d="M20 10 L26 20 L20 30 L14 20 Z" fill="#fff" /> },
    { medal: 'silver', rank: 2, name: 'Libertà',  pts: 3, diff: '+1', fill: '#1c1917', shape: <path d="M14 14h12l-3 12h-6z" fill="#d4a017" /> },
    { medal: 'bronze', rank: 3, name: 'Blue Wave',pts: 3, diff: '-1', fill: '#1e3a8a', shape: <path d="M6 20c4 2 14 2 18 0v4c-4 2-14 2-18 0z" fill="#fff" /> },
    { medal: null,     rank: 4, name: 'FC筑附',   pts: 0, diff: '-5', fill: '#a78b2a', shape: <path d="M14 14h12l-3 14h-6z" fill="#fff" /> },
  ],
  B: [
    { medal: 'gold',   rank: 1, name: '筑嶺FC',   pts: 6, diff: '+4', fill: '#0f766e', shape: <path d="M14 12h12v8l-6 4-6-4z" fill="#fff" /> },
    { medal: 'silver', rank: 2, name: 'FC Stella', pts: 4, diff: '+2', fill: '#1e40af', shape: <path d="M20 10l2.5 5.2 5.5.8-4 4 1 5.7L20 23l-5 2.7 1-5.7-4-4 5.5-.8z" fill="#fff" /> },
    { medal: 'bronze', rank: 3, name: 'AVANTI',   pts: 1, diff: '-2', fill: '#991b1b', shape: <path d="M12 16l8-4 8 4-2 10-6 4-6-4z" fill="#fff" /> },
    { medal: null,     rank: 4, name: 'Flare',    pts: 1, diff: '-4', fill: '#b45309', shape: <path d="M14 14h12l-3 14h-6z" fill="#fff" /> },
  ],
  C: [
    { medal: 'gold',   rank: 1, name: 'T.A.S.',   pts: 7, diff: '+6', fill: '#4338ca', shape: <path d="M14 14h12v8l-6 4-6-4z" fill="#fff" /> },
    { medal: 'silver', rank: 2, name: '筑嶺男',   pts: 4, diff: '+1', fill: '#065f46', shape: <path d="M14 12h12v10l-6 3-6-3z" fill="#fff" /> },
    { medal: 'bronze', rank: 3, name: 'Nordica',  pts: 3, diff: '-2', fill: '#6b7280', shape: <path d="M12 16l8-4 8 4-2 10-6 4-6-4z" fill="#fff" /> },
    { medal: null,     rank: 4, name: 'Phoenix',  pts: 0, diff: '-5', fill: '#92400e', shape: <path d="M20 10 L26 20 L20 30 L14 20 Z" fill="#fff" /> },
  ],
}

const scorers = [
  { medal: 'gold',   rank: 1, name: '田中 悠真', team: 'FC紫炎',   goals: 7, fill: '#5b21b6', shape: <path d="M20 10 L26 20 L20 30 L14 20 Z" fill="#fff" /> },
  { medal: 'silver', rank: 2, name: '佐藤 翔',   team: 'T.A.S.',   goals: 6, fill: '#4338ca', shape: <path d="M14 14h12v8l-6 4-6-4z" fill="#fff" /> },
  { medal: 'bronze', rank: 3, name: '鈴木 大地', team: 'Libertà',  goals: 4, fill: '#1c1917', shape: <path d="M14 14h12l-3 12h-6z" fill="#d4a017" /> },
  { medal: null,     rank: 4, name: '山本 陸',   team: 'Blue Wave', goals: 3, fill: '#1e3a8a', shape: <path d="M6 20c4 2 14 2 18 0v4c-4 2-14 2-18 0z" fill="#fff" /> },
  { medal: null,     rank: 5, name: '高草木 悠', team: 'AVANTI',   goals: 3, fill: '#991b1b', shape: <path d="M12 16l8-4 8 4-2 10-6 4-6-4z" fill="#fff" /> },
]

export default function GroupRanking() {
  const [group, setGroup] = useState('A')

  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">
          <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 21h8M12 17V21M17 5V3H7v2M5 5v6a7 7 0 0014 0V5H5z"/>
          </svg>
          グループ順位
        </div>
        <a href="/standings" className="link-more">
          すべて見る
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>

      <div className="ranking-tabs">
        {['A', 'B', 'C'].map(g => (
          <button
            key={g}
            className={`ranking-tab${group === g ? ' active' : ''}`}
            onClick={() => setGroup(g)}
          >
            {g}グループ
          </button>
        ))}
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>順位</th>
            <th>チーム</th>
            <th className="right">勝点</th>
            <th className="right">得失</th>
          </tr>
        </thead>
        <tbody>
          {groups[group].map((t) => (
            <tr key={t.rank} className={t.rank === 1 ? 'top-row' : ''}>
              <td>
                {t.medal
                  ? <span className={`rank-medal ${t.medal}`}>{t.rank}</span>
                  : <span className="rank">{t.rank}</span>
                }
              </td>
              <td className="team-cell">
                <svg className="crest" viewBox="0 0 40 40">
                  <path d="M20 2 L36 7 V20 C36 28 29 34 20 37 C11 34 4 28 4 20 V7 Z" fill={t.fill} />
                  {t.shape}
                </svg>
                {t.name}
              </td>
              <td className="right num num-pos">{t.pts}</td>
              <td className={`right num ${t.diff.startsWith('-') ? 'num-neg' : 'num-pos'}`}>{t.diff}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="card-section-title">
        <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="5" /><path d="M12 13v8M9 18l3 3 3-3" />
        </svg>
        得点ランキング
      </div>
      <div className="scorer-list">
        {scorers.map((s) => (
          <div key={s.rank} className="scorer-row">
            <div className="scorer-rank">
              {s.medal
                ? <span className={`rank-medal ${s.medal}`}>{s.rank}</span>
                : s.rank
              }
            </div>
            <svg className="crest" viewBox="0 0 40 40">
              <path d="M20 2 L36 7 V20 C36 28 29 34 20 37 C11 34 4 28 4 20 V7 Z" fill={s.fill} />
              {s.shape}
            </svg>
            <div className="scorer-name">
              {s.name}
              <span className="team-tag">（{s.team}）</span>
            </div>
            <div className="scorer-goals num">{s.goals}得点</div>
          </div>
        ))}
      </div>
    </div>
  )
}
