const matches = [
  { date: '6/8',  dow: '月', badge: 'badge-m', label: '男子', match: '予選リーグ Aグループ 第1節', time: '10:00' },
  { date: '6/8',  dow: '月', badge: 'badge-w', label: '女子', match: '予選リーグ Bグループ 第1節', time: '11:20' },
  { date: '6/15', dow: '月', badge: 'badge-m', label: '男子', match: '予選リーグ Aグループ 第2節', time: '10:00' },
  { date: '6/22', dow: '月', badge: 'badge-m', label: '男子', match: '予選リーグ Bグループ 第2節', time: '10:00' },
]

export default function UpcomingSchedule() {
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">
          <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 9h18M8 3v4M16 3v4" />
          </svg>
          直近の予定
        </div>
        <a href="#" className="link-more">
          日程ページへ
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
      <div className="sched-list">
        {matches.map((m, i) => (
          <div key={i} className="sched-row">
            <div className="sched-row-date num">{m.date}<span className="dow">({m.dow})</span></div>
            <span className={`badge ${m.badge}`}>{m.label}</span>
            <div className="sched-row-match">{m.match}</div>
            <div className="sched-row-time num">{m.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
