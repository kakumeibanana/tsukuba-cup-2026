import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const EVENT_OPTS = [
  { key: 'normal',    label: '通常開催', color: '#16a34a' },
  { key: 'rain',      label: '雨天中止', color: '#2563eb' },
  { key: 'postponed', label: '日程変更', color: '#ea580c' },
]

function todayStr() {
  const d = new Date()
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export default function AdminDashboard() {
  const { role } = useAuth()
  const [eventStatus, setEventStatus] = useState('normal')
  const [todayMatches, setTodayMatches] = useState([])
  const [unsubmitted, setUnsubmitted]   = useState(0)
  const [latestNews, setLatestNews]     = useState([])
  const [loading, setLoading]           = useState(true)
  const [savingStatus, setSavingStatus] = useState(false)

  const today = todayStr()

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [{ data: sData }, { data: mData }, { data: nData }] = await Promise.all([
        supabase.from('settings').select('value').eq('key', 'event_status').single(),
        supabase.from('matches').select('*').order('match_date'),
        supabase.from('news').select('id,title,news_date,category,bg_gradient,published')
          .order('created_at', { ascending: false }).limit(4),
      ])
      setEventStatus(sData?.value ?? 'normal')
      const all = mData ?? []
      setTodayMatches(all.filter(m => m.match_date === today))
      setUnsubmitted(all.filter(m => m.status === 'scheduled').length)
      setLatestNews(nData ?? [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleStatusChange(key) {
    if (savingStatus) return
    setSavingStatus(true)
    await supabase.from('settings')
      .update({ value: key, updated_at: new Date().toISOString() })
      .eq('key', 'event_status')
    setEventStatus(key)
    setSavingStatus(false)
  }

  const statusOpt = EVENT_OPTS.find(o => o.key === eventStatus) ?? EVENT_OPTS[0]

  return (
    <div className="adm-section">
      <div className="adm-section-head">
        <h2 className="adm-section-title">ダッシュボード</h2>
        <div className="adm-dash-date num">{today}</div>
      </div>

      {/* イベントステータス */}
      <div className="adm-dash-card">
        <div className="adm-dash-card-label">本日の開催状況</div>
        <div className="adm-event-status-bar" style={{ background: statusOpt.color }}>
          {statusOpt.label}
        </div>
        <div className="adm-event-pills">
          {EVENT_OPTS.map(opt => (
            <button
              key={opt.key}
              className={`adm-event-pill${eventStatus === opt.key ? ' active' : ''}`}
              style={eventStatus === opt.key
                ? { background: opt.color, color: '#fff', borderColor: opt.color }
                : { borderColor: opt.color, color: opt.color }}
              onClick={() => handleStatusChange(opt.key)}
              disabled={savingStatus}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* クイックスタッツ */}
      <div className="adm-dash-stats">
        <div className="adm-dash-stat">
          <div className="adm-dash-stat-num num">{loading ? '–' : todayMatches.length}</div>
          <div className="adm-dash-stat-label">本日の試合</div>
        </div>
        <div className="adm-dash-stat">
          <div className="adm-dash-stat-num num" style={unsubmitted > 0 ? { color: '#dc2626' } : {}}>
            {loading ? '–' : unsubmitted}
          </div>
          <div className="adm-dash-stat-label">未入力の試合</div>
        </div>
        <div className="adm-dash-stat">
          <div className="adm-dash-stat-num num">{loading ? '–' : latestNews.filter(n => n.published).length}</div>
          <div className="adm-dash-stat-label">公開中の投稿</div>
        </div>
      </div>

      {/* 本日の試合 */}
      <div className="adm-dash-card">
        <div className="adm-dash-card-label-row">
          <span className="adm-dash-card-label">本日の試合</span>
          <Link to="/admin/matches" className="adm-dash-link">試合管理 →</Link>
        </div>
        {loading
          ? <div className="adm-loading" style={{ padding: 12 }}>読み込み中...</div>
          : todayMatches.length === 0
            ? <div className="adm-empty" style={{ padding: '8px 0', fontSize: 13 }}>本日の試合はありません</div>
            : (
              <div className="adm-dash-match-list">
                {todayMatches.map(m => (
                  <div key={m.id} className="adm-dash-match-row">
                    <div className="adm-dash-match-teams">
                      <span>{m.home_name}</span>
                      <span className="adm-dash-vs">vs</span>
                      <span>{m.away_name}</span>
                    </div>
                    <div>
                      {m.status === 'finished' && m.score_home != null
                        ? <span className="num adm-dash-score">{m.score_home}–{m.score_away}</span>
                        : m.status === 'live'
                          ? <span style={{ color: '#dc2626', fontSize: 12, fontWeight: 700 }}>🔴</span>
                          : m.status === 'cancelled'
                            ? <span style={{ color: '#9ca3af', fontSize: 12 }}>中止</span>
                            : <span className="adm-mc-enter-result" style={{ fontSize: 11 }}>未入力</span>
                      }
                    </div>
                  </div>
                ))}
              </div>
            )
        }
      </div>

      {/* 最新のお知らせ（Admin / PR Staff） */}
      {(role === 'admin' || role === 'pr_staff') && (
        <div className="adm-dash-card">
          <div className="adm-dash-card-label-row">
            <span className="adm-dash-card-label">最新の投稿</span>
            <Link to="/admin/news" className="adm-dash-link">管理 →</Link>
          </div>
          {loading ? null : latestNews.length === 0
            ? <div className="adm-empty" style={{ padding: '8px 0', fontSize: 13 }}>投稿がありません</div>
            : (
              <div>
                {latestNews.map(n => (
                  <div key={n.id} className="adm-dash-news-row">
                    <div style={{ width: 5, minWidth: 5, borderRadius: 3, background: n.bg_gradient, alignSelf: 'stretch' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--sub)' }}>{n.news_date} · {n.category}{!n.published && ' · 下書き'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      )}
    </div>
  )
}
