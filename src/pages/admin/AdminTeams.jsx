import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const EMPTY_FORM = { name: '', gender: '男子', group_name: 'A', color: '#7c3aed', description: '' }

export default function AdminTeams() {
  const [teams, setTeams]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [editing, setEditing]   = useState(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [members, setMembers]   = useState([])
  const [saving, setSaving]     = useState(false)
  const [toastMsg, setToastMsg] = useState(null)    // section level
  const [modalError, setModalError] = useState(null) // inside modal

  useEffect(() => { fetchTeams() }, [])

  async function fetchTeams() {
    setLoading(true)
    const { data } = await supabase.from('teams').select('*, members(*)').order('gender').order('group_name')
    setTeams(data ?? [])
    setLoading(false)
  }

  function openEdit(team) {
    setEditing(team)
    setCreating(false)
    setModalError(null)
    setForm({ name: team.name, gender: team.gender, group_name: team.group_name ?? '', color: team.color, description: team.description ?? '' })
    setMembers((team.members ?? []).sort((a, b) => a.sort_order - b.sort_order).map(m => ({ ...m })))
  }

  function openCreate() {
    setEditing(null)
    setCreating(true)
    setModalError(null)
    setForm(EMPTY_FORM)
    setMembers([])
  }

  function closeModal() { setEditing(null); setCreating(false); setModalError(null) }

  const f = key => e => setForm(p => ({ ...p, [key]: e.target.value }))

  function updateMember(idx, key, val) {
    setMembers(p => p.map((m, i) => i === idx ? { ...m, [key]: val } : m))
  }
  function addMember()       { setMembers(p => [...p, { name: '', cls: '', role: '', sort_order: p.length }]) }
  function removeMember(idx) { setMembers(p => p.filter((_, i) => i !== idx)) }

  async function handleCreate() {
    if (!form.name) { setModalError('チーム名は必須です'); return }
    setSaving(true)
    const { data: teamData, error: teamErr } = await supabase
      .from('teams')
      .insert({ name: form.name, gender: form.gender, group_name: form.group_name, color: form.color, description: form.description })
      .select().single()
    if (teamErr) { setModalError(teamErr.message); setSaving(false); return }

    const validMembers = members.filter(m => m.name.trim())
    if (validMembers.length > 0) {
      await supabase.from('members').insert(
        validMembers.map((m, i) => ({
          team_id: teamData.id,
          name: m.name.trim(),
          cls: m.cls ?? '',
          role: m.role ?? '',
          sort_order: i,
        }))
      )
    }
    setSaving(false)
    closeModal()
    fetchTeams()
    showToast({ type: 'ok', text: 'チームを作成しました' })
  }

  async function handleSave() {
    setSaving(true)
    const { error: teamErr } = await supabase.from('teams')
      .update({ name: form.name, gender: form.gender, group_name: form.group_name, color: form.color, description: form.description, updated_at: new Date().toISOString() })
      .eq('id', editing.id)
    if (teamErr) { setModalError(teamErr.message); setSaving(false); return }

    await supabase.from('members').delete().eq('team_id', editing.id)
    const validMembers = members.filter(m => m.name.trim())
    if (validMembers.length > 0) {
      await supabase.from('members').insert(
        validMembers.map((m, i) => ({
          team_id: editing.id,
          name: m.name.trim(),
          cls: m.cls ?? '',
          role: m.role ?? '',
          sort_order: i,
        }))
      )
    }
    setSaving(false)
    closeModal()
    fetchTeams()
    showToast({ type: 'ok', text: '保存しました' })
  }

  async function handleDelete(id) {
    if (!confirm('このチームを削除しますか？')) return
    await supabase.from('teams').delete().eq('id', id)
    fetchTeams()
  }

  function showToast(msg) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const byGender = g => teams.filter(t => t.gender === g)

  // ⚠️ formBody は変数（<FormBody/>コンポーネントにするとre-mountしてフォーカスが外れるバグが出る）
  const formBody = (
    <>
      <div className="adm-form-row">
        <div className="adm-field">
          <label>チーム名</label>
          <input value={form.name} onChange={f('name')} placeholder="FC紫炎" />
        </div>
        <div className="adm-field adm-field-sm">
          <label>性別</label>
          <select value={form.gender} onChange={f('gender')}>
            <option>男子</option><option>女子</option>
          </select>
        </div>
        <div className="adm-field adm-field-sm">
          <label>グループ</label>
          <select value={form.group_name} onChange={f('group_name')}>
            {['A','B','C','D'].map(g => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div className="adm-field adm-field-sm">
          <label>カラー</label>
          <input type="color" value={form.color} onChange={f('color')} className="adm-color-input" />
        </div>
      </div>
      <div className="adm-field">
        <label>紹介文</label>
        <textarea rows={3} value={form.description} onChange={f('description')} placeholder="チームの紹介を入力..." />
      </div>
      <div className="adm-members-head">
        <label>メンバー</label>
        <button className="adm-btn-sm" onClick={addMember}>＋ 追加</button>
      </div>
      <div className="adm-members-list">
        {members.map((m, i) => (
          <div key={i} className="adm-member-row">
            <input
              className="adm-member-name-input"
              value={m.name}
              onChange={e => updateMember(i, 'name', e.target.value)}
              placeholder="氏名"
            />
            <input
              className="adm-member-cls-input"
              value={m.cls ?? ''}
              onChange={e => updateMember(i, 'cls', e.target.value)}
              placeholder="クラス"
            />
            <input
              className="adm-member-role-input"
              value={m.role ?? ''}
              onChange={e => updateMember(i, 'role', e.target.value)}
              placeholder="役割"
            />
            <button className="adm-btn-icon" onClick={() => removeMember(i)}>✕</button>
          </div>
        ))}
        {members.length === 0 && <div className="adm-empty" style={{ padding: '8px 0', fontSize: 13 }}>メンバーなし</div>}
      </div>
    </>
  )

  return (
    <div className="adm-section">
      <div className="adm-section-head">
        <h2 className="adm-section-title">チーム管理</h2>
        <button className="adm-btn adm-btn-primary" onClick={openCreate}>＋ チームを追加</button>
      </div>

      {toastMsg && (
        <div className={`adm-alert ${toastMsg.type === 'ok' ? 'adm-alert-ok' : 'adm-alert-error'}`}>
          {toastMsg.text}
        </div>
      )}

      {loading ? <div className="adm-loading">読み込み中...</div> : (
        teams.length === 0
          ? <div className="adm-empty">チームがありません。「＋ チームを追加」から登録してください。</div>
          : ['男子', '女子'].map(g => {
              const list = byGender(g)
              if (list.length === 0) return null
              return (
                <div key={g} className="adm-team-group">
                  <div className="adm-team-group-label">{g}</div>
                  <div className="adm-teams-grid">
                    {list.map(team => (
                      <div key={team.id} className="adm-team-card">
                        <div className="adm-team-card-accent" style={{ background: team.color }} />
                        <div className="adm-team-card-body">
                          <div className="adm-team-name">{team.name}</div>
                          <div className="adm-team-meta">
                            グループ {team.group_name} · {(team.members ?? []).length}人
                          </div>
                          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                            <button className="adm-btn-sm" onClick={() => openEdit(team)}>編集</button>
                            <button className="adm-btn-sm adm-btn-danger" onClick={() => handleDelete(team.id)}>削除</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })
      )}

      {/* 作成モーダル */}
      {creating && (
        <div className="adm-modal-backdrop" onClick={closeModal}>
          <div className="adm-modal adm-modal-wide" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-head">
              <h3>チームを作成</h3>
              <button className="adm-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="adm-modal-body">
              {modalError && <div className="adm-alert adm-alert-error">{modalError}</div>}
              {formBody}
            </div>
            <div className="adm-modal-foot">
              <button className="adm-btn" onClick={closeModal}>キャンセル</button>
              <button className="adm-btn adm-btn-primary" onClick={handleCreate} disabled={saving}>
                {saving ? '作成中...' : '作成する'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 編集モーダル */}
      {editing && (
        <div className="adm-modal-backdrop" onClick={closeModal}>
          <div className="adm-modal adm-modal-wide" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-head">
              <h3>{editing.name} を編集</h3>
              <button className="adm-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="adm-modal-body">
              {modalError && <div className="adm-alert adm-alert-error">{modalError}</div>}
              {formBody}
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
