import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminTeams() {
  const [teams, setTeams]     = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState({})
  const [members, setMembers] = useState([])
  const [saving, setSaving]   = useState(false)
  const [msg, setMsg]         = useState(null)

  useEffect(() => { fetchTeams() }, [])

  async function fetchTeams() {
    setLoading(true)
    const { data } = await supabase.from('teams').select('*, members(*)').order('gender').order('group_name')
    setTeams(data ?? [])
    setLoading(false)
  }

  function openEdit(team) {
    setEditing(team)
    setForm({ name: team.name, gender: team.gender, group_name: team.group_name ?? '', color: team.color, description: team.description ?? '' })
    setMembers((team.members ?? []).sort((a, b) => a.sort_order - b.sort_order).map(m => ({ ...m })))
  }
  function closeModal() { setEditing(null) }

  const f = key => e => setForm(p => ({ ...p, [key]: e.target.value }))

  function updateMember(idx, key, val) {
    setMembers(p => p.map((m, i) => i === idx ? { ...m, [key]: val } : m))
  }
  function addMember() { setMembers(p => [...p, { name: '', role: '', sort_order: p.length }]) }
  function removeMember(idx) { setMembers(p => p.filter((_, i) => i !== idx)) }

  async function handleSave() {
    setSaving(true)
    const { error: teamErr } = await supabase.from('teams')
      .update({ name: form.name, gender: form.gender, group_name: form.group_name, color: form.color, description: form.description, updated_at: new Date().toISOString() })
      .eq('id', editing.id)
    if (teamErr) { setMsg({ type: 'error', text: teamErr.message }); setSaving(false); return }

    await supabase.from('members').delete().eq('team_id', editing.id)
    const validMembers = members.filter(m => m.name.trim())
    if (validMembers.length > 0) {
      await supabase.from('members').insert(
        validMembers.map((m, i) => ({ team_id: editing.id, name: m.name.trim(), role: m.role ?? '', sort_order: i }))
      )
    }
    setSaving(false)
    setMsg({ type: 'ok', text: '保存しました' })
    closeModal(); fetchTeams()
    setTimeout(() => setMsg(null), 3000)
  }

  const byGender = (g) => teams.filter(t => t.gender === g)

  return (
    <div className="adm-section">
      <div className="adm-section-head">
        <h2 className="adm-section-title">チーム管理</h2>
      </div>

      {msg && <div className={`adm-alert ${msg.type === 'ok' ? 'adm-alert-ok' : 'adm-alert-error'}`}>{msg.text}</div>}

      {loading ? <div className="adm-loading">読み込み中...</div> : (
        ['男子', '女子'].map(g => (
          <div key={g} className="adm-team-group">
            <div className="adm-team-group-label">{g}</div>
            <div className="adm-teams-grid">
              {byGender(g).map(team => (
                <div key={team.id} className="adm-team-card">
                  <div className="adm-team-card-accent" style={{ background: team.color }} />
                  <div className="adm-team-card-body">
                    <div className="adm-team-name">{team.name}</div>
                    <div className="adm-team-meta">
                      グループ {team.group_name} ·  メンバー {(team.members ?? []).length}人
                    </div>
                    <button className="adm-btn-sm" style={{ marginTop: 10 }} onClick={() => openEdit(team)}>
                      編集
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {editing && (
        <div className="adm-modal-backdrop" onClick={closeModal}>
          <div className="adm-modal adm-modal-wide" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-head">
              <h3>{editing.name} を編集</h3>
              <button className="adm-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="adm-modal-body">
              <div className="adm-form-row">
                <div className="adm-field">
                  <label>チーム名</label>
                  <input value={form.name} onChange={f('name')} />
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
                <textarea rows={3} value={form.description} onChange={f('description')} />
              </div>

              <div className="adm-members-head">
                <label>メンバー</label>
                <button className="adm-btn-sm" onClick={addMember}>＋ 追加</button>
              </div>
              <div className="adm-members-list">
                {members.map((m, i) => (
                  <div key={i} className="adm-member-row">
                    <input className="adm-member-name-input" value={m.name} onChange={e => updateMember(i, 'name', e.target.value)} placeholder="氏名" />
                    <input className="adm-member-role-input" value={m.role} onChange={e => updateMember(i, 'role', e.target.value)} placeholder="役割（例：キャプテン）" />
                    <button className="adm-btn-icon" onClick={() => removeMember(i)}>✕</button>
                  </div>
                ))}
                {members.length === 0 && <div className="adm-empty">メンバーがいません</div>}
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
