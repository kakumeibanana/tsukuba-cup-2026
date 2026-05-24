import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { supabase } from '../lib/supabase'

function NewsModal({ item, onClose }) {
  return createPortal(
    <div className="news-modal-bg" onClick={onClose}>
      <div className="news-modal" onClick={e => e.stopPropagation()}>
        <div className="news-modal-img" style={{ background: item.bg_gradient }}>
          <span className="news-card-cat">{item.category}</span>
          <button className="news-modal-x" onClick={onClose}>✕</button>
        </div>
        <div className="news-modal-body">
          <div className="news-modal-date">{item.news_date}</div>
          <div className="news-modal-title">{item.title}</div>
          {item.body && <p className="news-modal-text">{item.body}</p>}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function NewsList() {
  const [news, setNews]       = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    supabase
      .from('news')
      .select('id, category, title, body, news_date, bg_gradient')
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
            <div key={item.id} className="news-card" onClick={() => setSelected(item)} style={{ cursor: 'pointer' }}>
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
      {selected && <NewsModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
