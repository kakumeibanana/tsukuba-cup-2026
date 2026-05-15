const news = [
  {
    id: 1,
    category: '試合速報',
    title: 'FC筑附が5-0の大勝！ Bグループ首位に浮上',
    date: '5/13',
    bg: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 65%, #5b21b6 100%)',
  },
  {
    id: 2,
    category: 'お知らせ',
    title: '大会ルール・会場使用ルールを更新しました',
    date: '5/12',
    bg: 'linear-gradient(135deg, #164e63 0%, #0e7490 65%, #0891b2 100%)',
  },
  {
    id: 3,
    category: '試合速報',
    title: 'FC紫炎が3-1でBlue Waveに勝利。首位をキープ',
    date: '5/12',
    bg: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 65%, #3b82f6 100%)',
  },
  {
    id: 4,
    category: '大会情報',
    title: '決勝トーナメントの組み合わせ抽選について',
    date: '5/10',
    bg: 'linear-gradient(135deg, #14532d 0%, #15803d 65%, #16a34a 100%)',
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
        <a href="#" className="link-more">
          すべて見る
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
      <div className="news-grid">
        {news.map(item => (
          <a key={item.id} href="#" className="news-card">
            <div className="news-card-img" style={{ background: item.bg }}>
              <span className="news-card-cat">{item.category}</span>
            </div>
            <div className="news-card-body">
              <div className="news-card-title">{item.title}</div>
              <div className="news-card-date">{item.date}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
