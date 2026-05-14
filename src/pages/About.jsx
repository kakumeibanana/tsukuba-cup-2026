const info = [
  { label: '大会名',     value: 'TSUKUBA CUP 2026' },
  { label: '主催',       value: '筑波大学附属高等学校フットサル部' },
  { label: '開催期間',   value: '2026年5月11日（日）〜 5月16日（土）' },
  { label: '会場',       value: '筑波大学附属高等学校フットサルコート', sub: '東京都文京区大塚1丁目' },
  { label: '参加チーム', value: '男子 5チーム・女子 2チーム' },
  { label: '形式',       value: '予選リーグ → 決勝トーナメント' },
]

const schedule = [
  { date: '5/11 (日)', events: ['男子 予選 Cグループ', '開会式'] },
  { date: '5/12 (月)', events: ['男子 予選 Aグループ', '女子 予選 Bグループ'] },
  { date: '5/13 (水)', events: ['男子 予選 Aグループ 第2節'] },
  { date: '5/14 (木)', events: ['男子 予選 Bグループ'] },
  { date: '5/15 (金)', events: ['女子 予選 Aグループ'] },
  { date: '5/16 (土)', events: ['準決勝・決勝', '閉会式・表彰式'] },
]

export default function About() {
  return (
    <main className="page">
      <div className="page-head">
        <h2 className="page-title">大会について</h2>
      </div>

      <div className="about-hero">
        <div className="about-grid-bg" />
        <div className="about-hero-content">
          <div className="about-hero-eyebrow">TSUKUBA CUP 2026</div>
          <h1 className="about-hero-title">筑波大附属<br />フットサル大会</h1>
          <p className="about-hero-sub">
            筑波大学附属高等学校フットサル部が主催する年次大会。<br />
            各チームが白熱した戦いを繰り広げます。
          </p>
          <div className="about-hero-chips">
            <span className="about-chip">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              5月11日〜16日
            </span>
            <span className="about-chip">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              文京区大塚
            </span>
            <span className="about-chip">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
              7チーム参加
            </span>
          </div>
        </div>
      </div>

      <div className="about-content-grid">
        <div className="card">
          <div className="card-head">
            <div className="card-title">
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
              </svg>
              大会情報
            </div>
          </div>
          <div className="about-info-list">
            {info.map(row => (
              <div key={row.label} className="about-info-row">
                <div className="about-info-label">{row.label}</div>
                <div className="about-info-value">
                  {row.value}
                  {row.sub && <span className="about-info-sub">{row.sub}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              日程
            </div>
          </div>
          <div className="sched-day-list">
            {schedule.map(day => (
              <div key={day.date} className="sched-day-row">
                <div className="sched-day-date num">{day.date}</div>
                <div className="sched-day-events">
                  {day.events.map((e, i) => (
                    <div key={i} className="sched-day-event">{e}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
