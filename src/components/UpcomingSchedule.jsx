const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)

const CourtIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="5" width="18" height="14" rx="1" />
    <path d="M3 12h18" />
  </svg>
)

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
      <div className="sched-wrap">
        <div className="sched-strip">
          <div className="sched-item is-soon">
            <div className="date num">5/14 <span className="dow">(木)</span></div>
            <span className="badge badge-m">男子</span>
            <span className="day-rel">明日</span>
            <div className="kind">練習</div>
            <div className="meta">
              <span className="row num"><ClockIcon /> 15:15 - 17:30</span>
              <span className="row"><CourtIcon /> コート面</span>
            </div>
          </div>
          <div className="sched-item">
            <div className="date num">5/15 <span className="dow">(金)</span></div>
            <span className="badge badge-m">男子</span>
            <div className="kind">練習</div>
            <div className="meta">
              <span className="row num"><ClockIcon /> 15:15 - 17:30</span>
              <span className="row"><CourtIcon /> コート面</span>
            </div>
          </div>
          <div className="sched-item">
            <div className="date num">5/16 <span className="dow">(土)</span></div>
            <span className="badge badge-w">女子</span>
            <div className="kind">練習</div>
            <div className="meta">
              <span className="row num"><ClockIcon /> 12:30 - 16:00</span>
              <span className="row"><CourtIcon /> コート面</span>
            </div>
          </div>
          <div className="sched-item">
            <div className="date num">5/19 <span className="dow">(火)</span></div>
            <span className="badge badge-m">男子</span>
            <div className="kind">練習</div>
            <div className="meta">
              <span className="row num"><ClockIcon /> 15:15 - 17:30</span>
              <span className="row"><CourtIcon /> コート面</span>
            </div>
          </div>
        </div>
        <button className="sched-next" aria-label="次へ">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
