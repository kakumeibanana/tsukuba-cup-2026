const news = [
  {
    id: 1,
    category: 'お知らせ',
    title: '大会実施要項（最新版）を公開しました',
    date: '5/17',
    bg: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 65%, #5b21b6 100%)',
  },
  {
    id: 2,
    category: 'お知らせ',
    title: '参加チームの登録が完了しました',
    date: '5/15',
    bg: 'linear-gradient(135deg, #14532d 0%, #15803d 65%, #16a34a 100%)',
  },
  {
    id: 3,
    category: 'お知らせ',
    title: '会場・ルールの最新情報を確認してください',
    date: '5/12',
    bg: 'linear-gradient(135deg, #164e63 0%, #0e7490 65%, #0891b2 100%)',
  },
  {
    id: 4,
    category: 'お知らせ',
    title: 'TSUKUBA CUP 2026夏 公式サイトをオープンしました',
    date: '5/10',
    bg: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 65%, #ea580c 100%)',
  },
]

export default function NewsList() {
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">
          <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v8a2 2 0 01-2 2z"/>
            <path d="M17 20v-8H7v8M7 4v4h8"/>
          </svg>
          ニュース
        </div>
      </div>
      <div className="news-grid">
        {news.map(item => (
          <div key={item.id} className="news-card">
            <div className="news-card-img" style={{ background: item.bg }}>
              <span className="news-card-cat">{item.category}</span>
            </div>
            <div className="news-card-body">
              <div className="news-card-title">{item.title}</div>
              <div className="news-card-date">{item.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
