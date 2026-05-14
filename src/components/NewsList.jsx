const ChevRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6l6 6-6 6" />
  </svg>
)

const newsItems = [
  { date: '5/13', text: '本日の試合は予定通り開催します' },
  { date: '5/12', text: '大会ルール・会場使用ルールを更新しました' },
  { date: '5/10', text: '得点ランキングを更新しました' },
  { date: '5/8',  text: '各チームの出場選手登録をお願いします' },
  { date: '5/7',  text: '大会実施要項を公開しました' },
]

export default function NewsList() {
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">
          <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0v6l2 3H4l2-3z" />
            <path d="M10 19a2 2 0 0 0 4 0" />
          </svg>
          お知らせ
        </div>
        <a href="#" className="link-more">
          すべて見る
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
      <div className="news-list">
        {newsItems.map((item) => (
          <a key={item.date + item.text} className="news-item" href="#">
            <span className="news-date">{item.date}</span>
            <span className="news-text">{item.text}</span>
            <span className="news-chev"><ChevRight /></span>
          </a>
        ))}
      </div>
    </div>
  )
}
