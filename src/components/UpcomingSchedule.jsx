import { Link } from 'react-router-dom'

const days = []

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
        <Link to="/matches" className="link-more">
          日程ページへ
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>

      <div className="usched-list">
        {days.map(day => (
          <div key={day.date} className="usched-day">
            <div className="usched-day-header">
              <span className="usched-date num">{day.date}（{day.dow}）</span>
              <span className="usched-time-tag">昼休み</span>
            </div>
            <div className="usched-matches">
              {day.matches.map((m, i) => (
                <div key={i} className="usched-row">
                  <span className={`badge ${m.badge}`}>{m.label}</span>
                  <span className="usched-teams">
                    <span className="usched-team">{m.home}</span>
                    <span className="usched-vs">vs</span>
                    <span className="usched-team">{m.away}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
