import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function NewsList() {
  const [news, setNews]       = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('news')
      .select('id, category, title, news_date, bg_gradient')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(4)
      .then(({ data }) => {
        setNews(data ?? [])
        setLoading(false)
      })
  }, [])

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
      {loading ? (
        <div style={{ padding: '16px 0', color: 'var(--sub)', fontSize: 13 }}>読み込み中...</div>
      ) : news.length === 0 ? (
        <div style={{ padding: '16px 0', color: 'var(--sub)', fontSize: 13 }}>お知らせはありません</div>
      ) : (
        <div className="news-grid">
          {news.map(item => (
            <div key={item.id} className="news-card">
              <div className="news-card-img" style={{ background: item.bg_gradient }}>
                <span className="news-card-cat">{item.category}</span>
              </div>
              <div className="news-card-body">
                <div className="news-card-title">{item.title}</div>
                <div className="news-card-date">{item.news_date}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
