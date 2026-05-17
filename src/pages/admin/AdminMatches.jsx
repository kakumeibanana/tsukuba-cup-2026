import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const STATUS_LABELS = {
  scheduled: '予定',
  live:      'LIVE',
  finished:  '終了',
  cancelled: '中止',
}
const STATUS_COLORS = {
  scheduled: '#6b7280',
  live:      '#dc2626',
  finished:  '#5b21b6',
  cancelled: '#9ca3af',
}

const EMPTY_FORM = {
  gender: '男子', stage: 'league', group_name: 'A', round: '',
  match_date: '', match_dow: '月',
  home_name: '', away_name: '',
  score_home: '', score_away: '',
  home_scorers: '', away_scorers: '',
  status: 'scheduled',
}

export default function AdminMatches() {
  const [matches, setMatches]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [editing, setEditing]   = useState(null)   // match object
  const [creating, setCreating] = useState(false)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [saving, setSaving]     = useState(false)
  const [msg, setMsg]           = useState(null)

  useEffect(() => { fetchMatches() }, [])

  async function fetchMatches() {
    setLoading(true)
    const { data } = await supabase.from('matches').select('*').order('match_date')
    setMatches(data ?? [])
    setLoading(false)
  }

  function openEdit(m) {
    setEditing(m)
    setForm({
      gender: m.gender, stage: m.stage,
      group_name: m.group_name ?? '', round: m.round ?? '',
      match_date: m.match_date, match_dow: m.match_dow,
      home_name: m.home_name, away_name: m.away_name,
      score_home: m.score_home ?? '', score_away: m.score_away ?? '',
      home_scorers: (m.home_scorers ?? []).join('\n'),
      away_scorers: (m.away_scorers ?? []).join('\n'),
      status: m.status,
    })
    setCreating(false)
  }

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setCreating(true)
  }

  function closeModal() { setEditing(null); setCreating(false) }

  function toScorers(str) {
    return str.split('\n').map(s => s.trim()).filter(Boolean)
  }

  async function handleSave() {
    setSaving(true)
    const payload = {
      gender: form.gender, stage: form.stage,
      group_name: form.stage === 'league' ? form.group_name : null,
      round: form.stage === 'tournament' ? form.round : null,
      match_date: form.match_date, match_dow: form.match_dow,
      home_name: form.home_name, away_name: form.away_name,
      score_home: form.score_home !== '' ? Number(form.score_home) : null,
      score_away: form.score_away !== '' ? Number(form.score_away) : null,
      home_scorers: toScorers(form.home_scorers),
      away_scorers: toScorers(form.away_scorers),
      status: form.status,
      updated_at: new Date().toISOString(),
    }
    let error
    if (editing) {
      ;({ error } = await supabase.from('matches').update(payload).eq('id', editing.id))
    } else {
      ;({ error } = await supabase.from('matches').insert(payload))
    }
    setSaving(false)
    if (error) { setMsg({ type: 'error', text: error.message }); return }
    setMsg({ type: 'ok', text: editing ? '更新しました' : '作成しました' })
    closeModal()
    fetchMatches()
    setTimeout(() => setMsg(null), 3000)
  }

  async function handleDelete(id) {
    if (!confirm('この試合を削除しますか？')) return
    await supabase.from('matches').delete().eq('id', id)
    fetchMatches()
  }

  const f = (key) => e => setForm(p => ({ ...p, [key]: e.target.value }))

  return (
    <div className="adm-section">
      <div className="adm-section-head">
        <h2 className="adm-section-title">試合管理</h2>
        <button className="adm-btn adm-btn-primary" onClick={openCreate}>＋ 試合を追加</button>
      </div>

      {msg && <div className={`adm-alert ${msg.type === 'ok' ? 'adm-alert-ok' : 'adm-alert-error'}`}>{msg.text}</div>}

      {loading ? (
        <div className="adm-loading">読み込み中...</div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>日程</th><th>性別</th><th>ステージ</th>
                <th>ホーム</th><th>スコア</th><th>アウェイ</th>
                <th>状態</th><th></th>
              </tr>
            </thead>
            <tbody>
              {matches.map(m => (
                <tr key={m.id}>
                  <td className="num">{m.match_date}（{m.match_dow}）</td>
                  <td>{m.gender}</td>
                  <td>{m.stage === 'league' ? `予選G${m.group_name}` : m.round}</td>
                  <td>{m.home_name}</td>
                  <td className="num adm-score-cell">
                    {m.score_home != null ? `${m.score_home} – ${m.score_away}` : '–'}
                  </td>
                  <td>{m.away_name}</td>
                  <td>
                    <span className="adm-status-badge"
                      style={{ background: `${STATUS_COLORS[m.status]}18`, color: STATUS_COLORS[m.status] }}>
                      {STATUS_LABELS[m.status]}
                    </span>
                  </td>
                  <td className="adm-row-actions">
                    <button className="adm-btn-sm" onClick={() => openEdit(m)}>編集</button>
                    <button className="adm-btn-sm adm-btn-danger" onClick={() => handleDelete(m.id)}>削除</button>
                  </td>
                </tr>
              ))}
              {matches.length === 0 && (
                <tr><td colSpan={8} className="adm-empty">試合データがありません</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* モーダル */}
      {(editing || creating) && (
        <div className="adm-modal-backdrop" onClick={closeModal}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-head">
              <h3>{editing ? '試合を編集' : '試合を作成'}</h3>
              <button className="adm-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="adm-modal-body">
              <div className="adm-form-row">
                <div className="adm-field">
                  <label>日付</label>
                  <input value={form.match_date} onChange={f('match_date')} placeholder="6/8" />
                </div>
                <div className="adm-field adm-field-sm">
                  <label>曜日</label>
                  <select value={form.match_dow} onChange={f('match_dow')}>
                    {['月','火','水','木','金','土','日'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="adm-field adm-field-sm">
                  <label>性別</label>
                  <select value={form.gender} onChange={f('gender')}>
                    <option>男子</option><option>女子</option>
                  </select>
                </div>
              </div>
              <div className="adm-form-row">
                <div className="adm-field adm-field-sm">
                  <label>ステージ</label>
                  <select value={form.stage} onChange={f('stage')}>
                    <option value="league">予選リーグ</option>
                    <option value="tournament">決勝トーナメント</option>
                  </select>
                </div>
                {form.stage === 'league' ? (
                  <div className="adm-field adm-field-sm">
                    <label>グループ</label>
                    <select value={form.group_name} onChange={f('group_name')}>
                      {['A','B','C','D'].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                ) : (
                  <div className="adm-field">
                    <label>ラウンド</label>
                    <input value={form.round} onChange={f('round')} placeholder="準決勝 / 決勝" />
                  </div>
                )}
                <div className="adm-field adm-field-sm">
                  <label>状態</label>
                  <select value={form.status} onChange={f('status')}>
                    <option value="scheduled">予定</option>
                    <option value="live">LIVE</option>
                    <option value="finished">終了</option>
                    <option value="cancelled">中止</option>
                  </select>
                </div>
              </div>

              <div className="adm-form-row">
                <div className="adm-field">
                  <label>ホーム</label>
                  <input value={form.home_name} onChange={f('home_name')} placeholder="チーム名" />
                </div>
                <div className="adm-field adm-field-score">
                  <label>得点</label>
                  <input type="number" min="0" value={form.score_home} onChange={f('score_home')} placeholder="–" />
                </div>
                <div className="adm-field adm-field-score">
                  <label>得点</label>
                  <input type="number" min="0" value={form.score_away} onChange={f('score_away')} placeholder="–" />
                </div>
                <div className="adm-field">
                  <label>アウェイ</label>
                  <input value={form.away_name} onChange={f('away_name')} placeholder="チーム名" />
                </div>
              </div>

              <div className="adm-form-row">
                <div className="adm-field">
                  <label>得点者（ホーム）<span className="adm-hint">1人1行</span></label>
                  <textarea rows={3} value={form.home_scorers} onChange={f('home_scorers')}
                    placeholder={"田中 悠真 ×2\n鈴木 大地"} />
                </div>
                <div className="adm-field">
                  <label>得点者（アウェイ）<span className="adm-hint">1人1行</span></label>
                  <textarea rows={3} value={form.away_scorers} onChange={f('away_scorers')}
                    placeholder="山本 陸" />
                </div>
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
