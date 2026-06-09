import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const ROLE_LABELS = { admin: 'Admin', match_staff: 'Match Staff', pr_staff: 'PR Staff' }
const ROLE_COLORS = { admin: '#7c3aed', match_staff: '#0891b2', pr_staff: '#16a34a' }

export default function AdminMore() {
  const { user, role, signOut } = useAuth()
  const [organizers, setOrganizers] = useState([])
  const [loading, setLoading]       = useState(true)
  const [adding, setAdding]         = useState(false)
  const [addForm, setAddForm]       = useState({ email: '', name: '', role: 'match_staff' })
  const [msg, setMsg]               = useState(null)
  const [saving, setSaving]         = useState(false)

  useEffect(() => { fetchOrganizers() }, [])

  async function fetchOrganizers() {
    const { data } = await supabase.from('organizers').select('*').order('created_at')
    setOrganizers(data ?? [])
    setLoading(false)
  }

  async function handleAdd() {
    if (!addForm.email) { setMsg({ type: 'error', text: 'メールアドレスは必須です' }); return }
    setSaving(true)
    const { error } = await supabase.from('organizers').insert({
      email: addForm.email,
      name: addForm.name || null,
      role: addForm.role,
    })
    setSaving(false)
    if (error) { setMsg({ type: 'error', text: error.message }); return }
    setMsg({ type: 'ok', text: '追加しました' })
    setAdding(false)
    setAddForm({ email: '', name: '', role: 'match_staff' })
    fetchOrganizers()
    setTimeout(() => setMsg(null), 3000)
  }

  async function handleRemove(email) {
    if (email === user?.email) {
      setMsg({ type: 'error', text: '自分自身は削除できません' })
      return
    }
    if (!confirm(`${email} を削除しますか？`)) return
    await supabase.from('organizers').delete().eq('email', email)
    setOrganizers(p => p.filter(o => o.email !== email))
  }

  const af = key => e => setAddForm(p => ({ ...p, [key]: e.target.value }))

  return (
    <div className="adm-section">
      <div className="adm-section-head">
        <h2 className="adm-section-title">その他</h2>
      </div>

      {msg && <div className={`adm-alert ${msg.type === 'ok' ? 'adm-alert-ok' : 'adm-alert-error'}`}>{msg.text}</div>}

      {/* ログインユーザー情報 */}
      <div className="adm-more-user-card">
        <div className="adm-more-user-info">
          <div className="adm-more-user-email">{user?.email}</div>
          <span
            className="adm-role-badge"
            style={{ background: `${ROLE_COLORS[role]}20`, color: ROLE_COLORS[role] }}
          >
            {ROLE_LABELS[role] ?? role}
          </span>
        </div>
      </div>

      {/* 運営メンバー管理（Admin only） */}
      {role === 'admin' && (
        <div className="adm-more-block">
          <div className="adm-more-block-head">
            <div className="adm-more-block-title">運営メンバー</div>
            <button className="adm-btn-sm" onClick={() => setAdding(v => !v)}>
              {adding ? '閉じる' : '＋ 追加'}
            </button>
          </div>

          {adding && (
            <div className="adm-more-add-form">
              <div className="adm-form-row">
                <div className="adm-field">
                  <label>メールアドレス</label>
                  <input value={addForm.email} onChange={af('email')} placeholder="xxx@sgh-tsukuba.org" />
                </div>
                <div className="adm-field">
                  <label>名前（任意）</label>
                  <input value={addForm.name} onChange={af('name')} placeholder="氏名" />
                </div>
              </div>
              <div className="adm-form-row">
                <div className="adm-field adm-field-sm">
                  <label>権限</label>
                  <select value={addForm.role} onChange={af('role')}>
                    <option value="admin">Admin</option>
                    <option value="match_staff">Match Staff</option>
                    <option value="pr_staff">PR Staff</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="adm-btn" onClick={() => setAdding(false)}>キャンセル</button>
                <button className="adm-btn adm-btn-primary" onClick={handleAdd} disabled={saving}>
                  {saving ? '追加中...' : '追加する'}
                </button>
              </div>
            </div>
          )}

          {loading ? <div className="adm-loading">読み込み中...</div> : (
            <div className="adm-organizer-list">
              {organizers.map(o => (
                <div key={o.email} className="adm-organizer-row">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="adm-organizer-name">{o.name ?? '—'}</div>
                    <div className="adm-organizer-email">{o.email}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      className="adm-role-badge"
                      style={{ background: `${ROLE_COLORS[o.role]}20`, color: ROLE_COLORS[o.role] }}
                    >
                      {ROLE_LABELS[o.role] ?? o.role}
                    </span>
                    {o.email !== user?.email && (
                      <button className="adm-btn-icon" onClick={() => handleRemove(o.email)}>✕</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ヘルプ */}
      <div className="adm-more-block">
        <div className="adm-more-block-title">権限について</div>
        <div className="adm-more-roles-table">
          {Object.entries(ROLE_LABELS).map(([key, label]) => (
            <div key={key} className="adm-more-role-row">
              <span className="adm-role-badge" style={{ background: `${ROLE_COLORS[key]}20`, color: ROLE_COLORS[key] }}>{label}</span>
              <span className="adm-more-role-desc">
                {key === 'admin' && '全機能にアクセス可能'}
                {key === 'match_staff' && '試合結果の入力のみ'}
                {key === 'pr_staff' && 'お知らせの投稿のみ'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* サイトへ戻る */}
      <Link to="/" className="adm-more-link-row">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        サイトへ戻る
      </Link>

      {/* ログアウト */}
      <button className="adm-more-signout-btn" onClick={signOut}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
        </svg>
        ログアウト
      </button>
    </div>
  )
}
