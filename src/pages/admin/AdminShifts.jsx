import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const EMPTY = { staff_name: '', staff_email: '', shift_date: '', role: '', note: '' }

export default function AdminShifts() {
  const [shifts, setShifts]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [form, setForm]             = useState(EMPTY)
  const [editing, setEditing]       = useState(null)
  const [modalOpen, setModalOpen]   = useState(false)
  const [saving, setSaving]         = useState(false)
  const [sending, setSending]       = useState(false)
  const [toast, setToast]           = useState(null)
  const [modalError, setModalError] = useState(null)

  useEffect(() => { fetchShifts() }, [])

  async function fetchShifts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('shifts').select('*').order('shift_date').order('staff_name')
    if (error) { showToast({ type: 'err', text: `取得失敗: ${error.message}` }); setLoading(false); return }
    setShifts(data ?? [])
    setLoading(false)
  }

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setModalError(null)
    setModalOpen(true)
  }
  function openEdit(s) {
    setEditing(s)
    setForm({ staff_name: s.staff_name, staff_email: s.staff_email, shift_date: s.shift_date, role: s.role ?? '', note: s.note ?? '' })
    setModalError(null)
    setModalOpen(true)
  }
  function closeModal() { setModalOpen(false); setEditing(null); setModalError(null) }

  const f = key => e => setForm(p => ({ ...p, [key]: e.target.value }))

  async function handleSave() {
    if (!form.staff_name || !form.staff_email || !form.shift_date) {
      setModalError('名前・メアド・日付は必須です'); return
    }
    setSaving(true)
    const payload = { staff_name: form.staff_name, staff_email: form.staff_email, shift_date: form.shift_date, role: form.role, note: form.note }
    const { error } = editing
      ? await supabase.from('shifts').update(payload).eq('id', editing.id)
      : await supabase.from('shifts').insert(payload)
    setSaving(false)
    if (error) { setModalError(error.message); return }
    closeModal()
    fetchShifts()
    showToast({ type: 'ok', text: editing ? '更新しました' : 'シフトを追加しました' })
  }

  async function handleDelete(id) {
    if (!confirm('このシフトを削除しますか？')) return
    const { error } = await supabase.from('shifts').delete().eq('id', id)
    if (error) { showToast({ type: 'err', text: `削除失敗: ${error.message}` }); return }
    fetchShifts()
    showToast({ type: 'ok', text: '削除しました' })
  }

  async function handleTestSend() {
    setSending(true)
    try {
      const { data, error } = await supabase.functions.invoke('send-shift-reminders', {
        body: { test: true },
      })
      if (error) throw error
      showToast({ type: 'ok', text: `送信完了: ${data?.sent ?? 0}件送りました` })
    } catch (e) {
      showToast({ type: 'err', text: `送信失敗: ${e.message}` })
    }
    setSending(false)
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  // 日付ごとにグループ化
  const grouped = shifts.reduce((acc, s) => {
    (acc[s.shift_date] = acc[s.shift_date] ?? []).push(s)
    return acc
  }, {})

  return (
    <div className="adm-section">
      <div className="adm-section-head">
        <h2 className="adm-section-title">シフト管理</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="adm-btn"
            onClick={handleTestSend}
            disabled={sending}
            style={{ borderColor: 'var(--line)', color: 'var(--sub)' }}
          >
            {sending ? '送信中...' : '📧 今日分をテスト送信'}
          </button>
          <button className="adm-btn adm-btn-primary" onClick={openCreate}>＋ シフトを追加</button>
        </div>
      </div>

      {toast && (
        <div className={`adm-alert ${toast.type === 'ok' ? 'adm-alert-ok' : 'adm-alert-error'}`}>
          {toast.text}
        </div>
      )}

      {loading ? (
        <div className="adm-loading">読み込み中...</div>
      ) : shifts.length === 0 ? (
        <div className="adm-empty">シフトがありません。「＋ シフトを追加」から登録してください。</div>
      ) : (
        Object.entries(grouped).map(([date, list]) => {
          const d = new Date(date + 'T00:00:00')
          const label = d.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })
          return (
            <div key={date} style={{ marginBottom: 28 }}>
              <div style={{
                fontSize: 12, fontWeight: 800, letterSpacing: '0.06em',
                color: 'var(--purple-700)', marginBottom: 8, textTransform: 'uppercase'
              }}>
                {label}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {list.map(s => (
                  <div key={s.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: '#fff', border: '1px solid var(--line)',
                    borderRadius: 12, padding: '12px 16px',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{s.staff_name}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 2 }}>{s.staff_email}</div>
                      {s.role && (
                        <div style={{
                          display: 'inline-block', marginTop: 4,
                          fontSize: 11, fontWeight: 700,
                          background: 'var(--purple-50)', color: 'var(--purple-700)',
                          padding: '2px 8px', borderRadius: 6
                        }}>{s.role}</div>
                      )}
                      {s.note && <div style={{ fontSize: 12, color: 'var(--ink-400)', marginTop: 4 }}>{s.note}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button className="adm-btn-sm" onClick={() => openEdit(s)}>編集</button>
                      <button className="adm-btn-sm adm-btn-danger" onClick={() => handleDelete(s.id)}>削除</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })
      )}

      {modalOpen && (
        <div className="adm-modal-backdrop" onClick={closeModal}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-head">
              <h3>{editing ? 'シフトを編集' : 'シフトを追加'}</h3>
              <button className="adm-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="adm-modal-body">
              {modalError && <div className="adm-alert adm-alert-error">{modalError}</div>}
              <div className="adm-form-row">
                <div className="adm-field">
                  <label>スタッフ名 <span style={{ color: 'red' }}>*</span></label>
                  <input value={form.staff_name} onChange={f('staff_name')} placeholder="山田 太郎" />
                </div>
                <div className="adm-field">
                  <label>日付 <span style={{ color: 'red' }}>*</span></label>
                  <input type="date" value={form.shift_date} onChange={f('shift_date')} />
                </div>
              </div>
              <div className="adm-field">
                <label>メールアドレス <span style={{ color: 'red' }}>*</span></label>
                <input type="email" value={form.staff_email} onChange={f('staff_email')} placeholder="example@gmail.com" />
              </div>
              <div className="adm-form-row">
                <div className="adm-field">
                  <label>役割</label>
                  <input value={form.role} onChange={f('role')} placeholder="審判・タイムキーパーなど" />
                </div>
              </div>
              <div className="adm-field">
                <label>備考</label>
                <textarea rows={2} value={form.note} onChange={f('note')} placeholder="集合時間や持ち物など" />
              </div>
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
