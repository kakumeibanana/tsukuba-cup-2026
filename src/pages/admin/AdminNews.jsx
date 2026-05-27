import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const BG_PRESETS = [
  { label: '紫', value: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)' },
  { label: '緑', value: 'linear-gradient(135deg, #14532d 0%, #16a34a 100%)' },
  { label: '青', value: 'linear-gradient(135deg, #164e63 0%, #0891b2 100%)' },
  { label: '赤', value: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)' },
  { label: 'オレンジ', value: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)' },
]
const EMPTY_FORM = { category: 'お知らせ', title: '', body: '', news_date: '', bg_gradient: BG_PRESETS[0].value, published: true }
const CATEGORIES = ['お知らせ', '延期', '日程変更', '告知']

function todayStr() {
  const d = new Date()
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export default function AdminNews() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [editing, setEditing]   = useState(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [saving, setSaving]     = useState(false)
  const [msg, setMsg]           = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => { fetchNews() }, [])

  async function fetchNews() {
    setLoading(true)
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }

  function openEdit(item) {
    setEditing(item)
    setForm({ category: item.category, title: item.title, body: item.body ?? '',
      news_date: item.news_date, bg_gradient: item.bg_gradient, published: item.published })
    setCreating(false)
  }
  function openCreate(preset) {
    setEditing(null)
    setForm(preset ?? EMPTY_FORM)
    setCreating(true)
  }
  function closeModal() { setEditing(null); setCreating(false) }

  function quickCreate(category, title, bg) {
    openCreate({ ...EMPTY_FORM, category, title, news_date: todayStr(), bg_gradient: bg, published: true })
  }

  const f = key => e => setForm(p => ({ ...p, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  async function handleSave() {
    if (!form.title || !form.news_date) { setMsg({ type: 'error', text: 'タイトルと日付は必須です' }); return }
    setSaving(true)
    const payload = { ...form, updated_at: new Date().toISOString() }
    let error
    if (editing) {
      ;({ error } = await supabase.from('news').update(payload).eq('id', editing.id))
    } else {
      ;({ error } = await supabase.from('news').insert(payload))
    }
    setSaving(false)
    if (error) { setMsg({ type: 'error', text: error.message }); return }
    setMsg({ type: 'ok', text: editing ? '更新しました' : '投稿しました' })
    closeModal(); fetchNews()
    setTimeout(() => setMsg(null), 3000)
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('news').delete().eq('id', id)
    if (error) { setMsg({ type: 'error', text: '削除に失敗しました: ' + error.message }); return }
    setConfirmDelete(null)
    fetchNews()
    setMsg({ type: 'ok', text: '削除しました' })
    setTimeout(() => setMsg(null), 3000)
  }

  async function togglePublish(item) {
    await supabase.from('news').update({ published: !item.published }).eq('id', item.id)
    fetchNews()
  }

  return (
    <div className="adm-section">
      <div className="adm-section-head">
        <h2 className="adm-section-title">お知らせ管理</h2>
        <button className="adm-btn adm-btn-primary" onClick={() => openCreate()}>＋ 投稿</button>
      </div>

      {msg && <div className={`adm-alert ${msg.type === 'ok' ? 'adm-alert-ok' : 'adm-alert-error'}`}>{msg.text}</div>}

      {/* クイック投稿 */}
      <div className="adm-quick-templates">
        <div className="adm-quick-label">クイック投稿</div>
        <div className="adm-quick-btns">
          <button className="adm-quick-btn adm-quick-rain"
            onClick={() => quickCreate('延期', '🌧 雨天のため延期のお知らせ', BG_PRESETS[2].value)}>
            🌧 延期
          </button>
          <button className="adm-quick-btn adm-quick-sched"
            onClick={() => quickCreate('日程変更', '📅 日程変更のお知らせ', BG_PRESETS[2].value)}>
            📅 日程変更
          </button>
          <button className="adm-quick-btn adm-quick-info"
            onClick={() => quickCreate('告知', '📢 ', BG_PRESETS[0].value)}>
            📢 告知
          </button>
        </div>
      </div>

      {loading ? <div className="adm-loading">読み込み中...</div> : (
        <div className="adm-news-list">
          {items.map(item => (
            <div key={item.id} className={`adm-news-row${!item.published ? ' adm-unpublished' : ''}`}>
              <div className="adm-news-preview" style={{ background: item.bg_gradient }} />
              <div className="adm-news-info">
                <div className="adm-news-meta">
                  <span className="adm-cat-badge">{item.category}</span>
                  <span className="num adm-news-date">{item.news_date}</span>
                  {!item.published && <span className="adm-draft-badge">下書き</span>}
                </div>
                <div className="adm-news-title">{item.title}</div>
              </div>
              <div className="adm-row-actions">
                <button className="adm-btn-sm" onClick={() => togglePublish(item)}>
                  {item.published ? '非公開' : '公開'}
                </button>
                <button className="adm-btn-sm" onClick={() => openEdit(item)}>編集</button>
                {confirmDelete === item.id ? (
                  <>
                    <span style={{ fontSize: 11, color: '#dc2626', fontWeight: 700 }}>本当に削除？</span>
                    <button className="adm-btn-sm adm-btn-danger" onClick={() => handleDelete(item.id)}>はい</button>
                    <button className="adm-btn-sm" onClick={() => setConfirmDelete(null)}>いいえ</button>
                  </>
                ) : (
                  <button className="adm-btn-sm adm-btn-danger" onClick={() => setConfirmDelete(item.id)}>削除</button>
                )}
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="adm-empty">お知らせがありません</div>}
        </div>
      )}

      {(editing || creating) && (
        <div className="adm-modal-backdrop" onClick={closeModal}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-head">
              <h3>{editing ? 'お知らせを編集' : 'お知らせを投稿'}</h3>
              <button className="adm-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="adm-modal-body">
              <div className="adm-form-row">
                <div className="adm-field adm-field-sm">
                  <label>カテゴリ</label>
                  <select value={form.category} onChange={f('category')}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="adm-field adm-field-sm">
                  <label>日付</label>
                  <input value={form.news_date} onChange={f('news_date')} placeholder="5/17" />
                </div>
              </div>
              <div className="adm-field">
                <label>タイトル</label>
                <input value={form.title} onChange={f('title')} placeholder="タイトルを入力" />
              </div>
              <div className="adm-field">
                <label>本文（任意）</label>
                <textarea rows={4} value={form.body} onChange={f('body')} placeholder="詳細を入力..." />
              </div>
              <div className="adm-field">
                <label>カードカラー</label>
                <div className="adm-bg-presets">
                  {BG_PRESETS.map(p => (
                    <button key={p.value} type="button"
                      className={`adm-bg-preset${form.bg_gradient === p.value ? ' selected' : ''}`}
                      style={{ background: p.value }}
                      onClick={() => setForm(prev => ({ ...prev, bg_gradient: p.value }))}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <label className="adm-checkbox-row">
                <input type="checkbox" checked={form.published} onChange={f('published')} />
                公開する
              </label>
            </div>
            <div className="adm-modal-foot">
              <button className="adm-btn" onClick={closeModal}>キャンセル</button>
              <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
