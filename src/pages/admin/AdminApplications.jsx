import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const STATUS_LABEL = { pending: '未確認', approved: '承認', rejected: '不可' }
const STATUS_COLOR = { pending: '#f59e0b', approved: '#16a34a', rejected: '#dc2626' }

export default function AdminApplications() {
  const [apps, setApps]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState(null)
  const [saving, setSaving]     = useState(false)
  const [toast, setToast]       = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('applications').select('*').order('created_at', { ascending: false })
    setApps(data ?? [])
    setLoading(false)
  }

  async function updateStatus(id, status) {
    setSaving(true)
    await supabase.from('applications').update({ status }).eq('id', id)
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }))
    setSaving(false)
    showToast('ステータスを更新しました')
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const counts = {
    all: apps.length,
    pending:  apps.filter(a => a.status === 'pending').length,
    approved: apps.filter(a => a.status === 'approved').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
  }

  return (
    <div className="adm-section">
      <div className="adm-section-head">
        <h2 className="adm-section-title">参加申し込み</h2>
        <div style={{ display: 'flex', gap: 16, fontSize: 13, fontWeight: 700 }}>
          <span>全{counts.all}件</span>
          <span style={{ color: STATUS_COLOR.pending }}>未確認 {counts.pending}</span>
          <span style={{ color: STATUS_COLOR.approved }}>承認 {counts.approved}</span>
          <span style={{ color: STATUS_COLOR.rejected }}>不可 {counts.rejected}</span>
        </div>
      </div>

      {toast && <div className="adm-alert adm-alert-ok">{toast}</div>}

      {loading ? <div className="adm-loading">読み込み中...</div>
        : apps.length === 0
          ? <div className="adm-empty">申し込みはまだありません</div>
          : (
            <div className="appli-list">
              {apps.map(a => (
                <button key={a.id} className="appli-row" onClick={() => setSelected(a)}>
                  <div className="appli-row-left">
                    <span className="appli-status-dot" style={{ background: STATUS_COLOR[a.status] }} />
                    <div>
                      <div className="appli-team-name">{a.team_name}</div>
                      <div className="appli-meta">{a.gender} · {a.rep_name} · {a.rep_class}</div>
                    </div>
                  </div>
                  <div className="appli-row-right">
                    <span className="appli-member-count">{a.members?.length ?? 0}人</span>
                    <span className="appli-status-badge"
                      style={{ color: STATUS_COLOR[a.status] }}>
                      {STATUS_LABEL[a.status]}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M9 6l6 6-6 6"/></svg>
                  </div>
                </button>
              ))}
            </div>
          )
      }

      {/* 詳細モーダル */}
      {selected && (
        <div className="adm-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-head">
              <div>
                <div style={{ fontWeight: 800, fontSize: 17 }}>{selected.team_name}</div>
                <div style={{ fontSize: 12, color: 'var(--sub)', marginTop: 2 }}>{selected.gender}</div>
              </div>
              <button className="adm-modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="adm-modal-body">
              <div className="appli-detail-section">
                <div className="appli-detail-label">代表者</div>
                <div className="appli-detail-value">{selected.rep_name}　{selected.rep_class}</div>
              </div>
              <div className="appli-detail-section">
                <div className="appli-detail-label">連絡先</div>
                <div className="appli-detail-value">{selected.rep_contact}</div>
              </div>
              <div className="appli-detail-section">
                <div className="appli-detail-label">メンバー（{selected.members?.length}人）</div>
                <div className="appli-member-grid">
                  {(selected.members ?? []).map((m, i) => (
                    <div key={i} className="appli-member-chip">{i + 1}. {m}</div>
                  ))}
                </div>
              </div>
              {selected.description && (
                <div className="appli-detail-section">
                  <div className="appli-detail-label">チーム紹介</div>
                  <div className="appli-detail-value">{selected.description}</div>
                </div>
              )}
              <div className="appli-detail-section">
                <div className="appli-detail-label">ステータス変更</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {Object.entries(STATUS_LABEL).map(([key, label]) => (
                    <button key={key}
                      disabled={saving || selected.status === key}
                      onClick={() => updateStatus(selected.id, key)}
                      style={{
                        padding: '8px 16px', borderRadius: 9, fontWeight: 700, fontSize: 13,
                        border: `1.5px solid ${STATUS_COLOR[key]}`,
                        background: selected.status === key ? STATUS_COLOR[key] : 'transparent',
                        color: selected.status === key ? '#fff' : STATUS_COLOR[key],
                        cursor: selected.status === key ? 'default' : 'pointer',
                        opacity: saving ? 0.6 : 1,
                      }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="adm-modal-foot">
              <button className="adm-btn" onClick={() => setSelected(null)}>閉じる</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
