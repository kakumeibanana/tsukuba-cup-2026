import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const STATUS_OPTS = [
  { key: 'scheduled', label: '予定' },
  { key: 'live',      label: '🔴 LIVE' },
  { key: 'finished',  label: '終了' },
  { key: 'cancelled', label: '中止' },
]
const STATUS_COLORS = {
  scheduled: '#6b7280', live: '#dc2626', finished: '#5b21b6', cancelled: '#9ca3af',
}

function ScoreCounter({ value, onChange }) {
  return (
    <div className="adm-counter-row">
      <button className="adm-counter-btn" onClick={() => onChange(Math.max(0, value - 1))}>−</button>
      <div className="adm-counter-val num">{value}</div>
      <button className="adm-counter-btn" onClick={() => onChange(value + 1)}>＋</button>
    </div>
  )
}

export default function AdminMatches() {
  const [matches, setMatches]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [editing, setEditing]   = useState(null)
  const [creating, setCreating] = useState(false)

  const [status, setStatus]     = useState('scheduled')
  const [scoreH, setScoreH]     = useState(0)
  const [scoreA, setScoreA]     = useState(0)
  const [goals, setGoals]       = useState([])
  const [addGoal, setAddGoal]   = useState(null)
  const [goalInput, setGoalInput] = useState('')

  const [cform, setCform] = useState({
    gender: '男子', stage: 'league', group_name: 'A', round: '',
    match_date: '', match_dow: '月', match_time: '昼休み',
    home_name: '', away_name: '',
  })

  const [saving, setSaving] = useState(false)
  const [msg, setMsg]       = useState(null)

  useEffect(() => { fetchMatches() }, [])

  async function fetchMatches() {
    setLoading(true)
    const { data } = await supabase.from('matches').select('*').order('match_date').order('created_at')
    setMatches(data ?? [])
    setLoading(false)
  }

  async function openEdit(m) {
    setEditing(m)
    setStatus(m.status)
    setScoreH(m.score_home ?? 0)
    setScoreA(m.score_away ?? 0)
    setAddGoal(null)
    setGoalInput('')
    const { data } = await supabase.from('goals').select('*').eq('match_id', m.id).order('created_at')
    setGoals(data ?? [])
  }

  function closeModal() { setEditing(null); setCreating(false) }

  function addGoalToList() {
    if (!goalInput.trim()) return
    setGoals(prev => [...prev, {
      id: `tmp-${Date.now()}`,
      team_name: addGoal === 'home' ? editing.home_name : editing.away_name,
      player_name: goalInput.trim(),
    }])
    setGoalInput('')
    setAddGoal(null)
  }

  async function handleSave() {
    setSaving(true)
    const hasScore = status === 'finished' || status === 'live'
    const { error } = await supabase.from('matches').update({
      status,
      score_home: hasScore ? scoreH : null,
      score_away: hasScore ? scoreA : null,
      updated_at: new Date().toISOString(),
    }).eq('id', editing.id)

    if (error) { setSaving(false); setMsg({ type: 'error', text: error.message }); return }

    await supabase.from('goals').delete().eq('match_id', editing.id)
    if (goals.length > 0) {
      await supabase.from('goals').insert(
        goals.map(g => ({ match_id: editing.id, team_name: g.team_name, player_name: g.player_name }))
      )
    }

    setSaving(false)
    setMsg({ type: 'ok', text: '保存しました' })
    closeModal()
    fetchMatches()
    setTimeout(() => setMsg(null), 3000)
  }

  async function handleCreate() {
    if (!cform.home_name || !cform.away_name || !cform.match_date) {
      setMsg({ type: 'error', text: '日付・ホーム・アウェイは必須です' }); return
    }
    setSaving(true)
    const { error } = await supabase.from('matches').insert({
      gender: cform.gender,
      stage: cform.stage,
      group_name: cform.stage === 'league' ? cform.group_name : null,
      round: cform.stage === 'tournament' ? cform.round : null,
      match_date: cform.match_date,
      match_dow: cform.match_dow,
      match_time: cform.match_time || '昼休み',
      home_name: cform.home_name,
      away_name: cform.away_name,
      status: 'scheduled',
    })
    setSaving(false)
    if (error) { setMsg({ type: 'error', text: error.message }); return }
    setMsg({ type: 'ok', text: '試合を作成しました' })
    closeModal()
    fetchMatches()
    setTimeout(() => setMsg(null), 3000)
  }

  async function handleDelete(id) {
    if (!confirm('この試合を削除しますか？')) return
    await supabase.from('matches').delete().eq('id', id)
    fetchMatches()
  }

  // 日付でグループ化
  const grouped = {}
  matches.forEach(m => {
    if (!grouped[m.match_date]) grouped[m.match_date] = []
    grouped[m.match_date].push(m)
  })
  const dates = Object.keys(grouped).sort()

  const cfld = key => e => setCform(p => ({ ...p, [key]: e.target.value }))

  return (
    <div className="adm-section">
      <div className="adm-section-head">
        <h2 className="adm-section-title">試合管理</h2>
        <button className="adm-btn adm-btn-primary" onClick={() => { setCreating(true); setEditing(null) }}>
          ＋ 追加
        </button>
      </div>

      {msg && <div className={`adm-alert ${msg.type === 'ok' ? 'adm-alert-ok' : 'adm-alert-error'}`}>{msg.text}</div>}

      {loading ? <div className="adm-loading">読み込み中...</div>
        : matches.length === 0 ? <div className="adm-empty">試合がありません</div>
        : (
          <div className="adm-match-cards">
            {dates.map(date => (
              <div key={date} className="adm-date-group">
                <div className="adm-date-label">
                  {grouped[date][0].match_date}（{grouped[date][0].match_dow}）・{grouped[date][0].gender}
                </div>
                {grouped[date].map(m => (
                  <button key={m.id} className="adm-match-card" onClick={() => openEdit(m)}>
                    <div className="adm-mc-teams">
                      <div className="adm-mc-home">{m.home_name}</div>
                      <div className="adm-mc-vs">vs</div>
                      <div className="adm-mc-away">{m.away_name}</div>
                    </div>
                    <div className="adm-mc-right">
                      {m.status === 'finished' && m.score_home != null ? (
                        <>
                          <div className="adm-mc-score num">{m.score_home} – {m.score_away}</div>
                          <span className="adm-mc-edit-hint">編集 ›</span>
                        </>
                      ) : m.status === 'live' ? (
                        <>
                          {m.score_home != null && <div className="adm-mc-score num">{m.score_home} – {m.score_away}</div>}
                          <span className="adm-status-badge" style={{ background: '#fee2e218', color: '#dc2626' }}>🔴 LIVE</span>
                        </>
                      ) : m.status === 'cancelled' ? (
                        <span className="adm-status-badge" style={{ background: '#f3f4f6', color: '#9ca3af' }}>中止</span>
                      ) : (
                        <span className="adm-mc-enter-result">結果入力 ›</span>
                      )}
                      <span className="adm-mc-group">
                        {m.stage === 'league' ? `G${m.group_name}` : m.round}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )
      }

      {/* 編集モーダル */}
      {editing && (
        <div className="adm-modal-backdrop" onClick={closeModal}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-head">
              <div className="adm-modal-match-title">
                <span>{editing.home_name}</span>
                <span className="adm-modal-vs">vs</span>
                <span>{editing.away_name}</span>
              </div>
              <button className="adm-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="adm-modal-body">

              {/* 状態 */}
              <div>
                <div className="adm-field-label">試合状態</div>
                <div className="adm-status-pills">
                  {STATUS_OPTS.map(opt => (
                    <button key={opt.key}
                      className={`adm-status-pill${status === opt.key ? ` active-${opt.key}` : ''}`}
                      onClick={() => setStatus(opt.key)}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* スコア */}
              {(status === 'finished' || status === 'live') && (
                <div className="adm-score-area">
                  <div className="adm-score-counter">
                    <div className="adm-counter-team">{editing.home_name}</div>
                    <ScoreCounter value={scoreH} onChange={setScoreH} />
                  </div>
                  <div className="adm-score-vs">—</div>
                  <div className="adm-score-counter">
                    <div className="adm-counter-team">{editing.away_name}</div>
                    <ScoreCounter value={scoreA} onChange={setScoreA} />
                  </div>
                </div>
              )}

              {/* 得点者 */}
              {(status === 'finished' || status === 'live') && (
                <div className="adm-goals-section">
                  <div className="adm-goals-head">
                    <div className="adm-field-label">得点者</div>
                  </div>

                  {goals.length > 0 && (
                    <div className="adm-goal-list">
                      {goals.map(g => (
                        <div key={g.id} className="adm-goal-item">
                          <div className="adm-goal-dot"
                            style={{ background: g.team_name === editing.home_name ? '#7c3aed' : '#db2777' }} />
                          <div className="adm-goal-player">{g.player_name}</div>
                          <div className="adm-goal-team">{g.team_name}</div>
                          <button className="adm-goal-del" onClick={() => setGoals(p => p.filter(x => x.id !== g.id))}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {addGoal && (
                    <div className="adm-goal-add-inline">
                      <div className="adm-goal-add-team-label"
                        style={{ color: addGoal === 'home' ? '#7c3aed' : '#db2777' }}>
                        {addGoal === 'home' ? editing.home_name : editing.away_name}
                      </div>
                      <input
                        autoFocus
                        value={goalInput}
                        onChange={e => setGoalInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addGoalToList()}
                        placeholder="選手名"
                        className="adm-goal-input"
                      />
                      <button className="adm-goal-confirm-btn" onClick={addGoalToList}>追加</button>
                      <button className="adm-goal-del" onClick={() => setAddGoal(null)}>✕</button>
                    </div>
                  )}

                  {!addGoal && (
                    <div className="adm-add-goal-row">
                      <button className="adm-add-goal-btn adm-add-goal-home"
                        onClick={() => { setAddGoal('home'); setGoalInput('') }}>
                        ＋ {editing.home_name}
                      </button>
                      <button className="adm-add-goal-btn adm-add-goal-away"
                        onClick={() => { setAddGoal('away'); setGoalInput('') }}>
                        ＋ {editing.away_name}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 削除 */}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                <button className="adm-btn-sm adm-btn-danger" onClick={() => { handleDelete(editing.id); closeModal() }}>
                  この試合を削除
                </button>
              </div>
            </div>
            <div className="adm-modal-foot">
              <button className="adm-btn" onClick={closeModal}>キャンセル</button>
              <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? '保存中...' : '保存する'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 作成モーダル */}
      {creating && (
        <div className="adm-modal-backdrop" onClick={closeModal}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-head">
              <h3>試合を作成</h3>
              <button className="adm-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="adm-modal-body">
              <div className="adm-form-row">
                <div className="adm-field">
                  <label>日付</label>
                  <input value={cform.match_date} onChange={cfld('match_date')} placeholder="6/8" />
                </div>
                <div className="adm-field adm-field-sm">
                  <label>曜日</label>
                  <select value={cform.match_dow} onChange={cfld('match_dow')}>
                    {['月','火','水','木','金','土','日'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="adm-field adm-field-sm">
                  <label>性別</label>
                  <select value={cform.gender} onChange={cfld('gender')}>
                    <option>男子</option><option>女子</option>
                  </select>
                </div>
              </div>
              <div className="adm-form-row">
                <div className="adm-field adm-field-sm">
                  <label>ステージ</label>
                  <select value={cform.stage} onChange={cfld('stage')}>
                    <option value="league">予選</option>
                    <option value="tournament">決勝</option>
                  </select>
                </div>
                {cform.stage === 'league' ? (
                  <div className="adm-field adm-field-sm">
                    <label>グループ</label>
                    <select value={cform.group_name} onChange={cfld('group_name')}>
                      {['A','B','C','D'].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                ) : (
                  <div className="adm-field">
                    <label>ラウンド</label>
                    <input value={cform.round} onChange={cfld('round')} placeholder="準決勝 / 決勝" />
                  </div>
                )}
              </div>
              <div className="adm-form-row">
                <div className="adm-field">
                  <label>ホーム</label>
                  <input value={cform.home_name} onChange={cfld('home_name')} placeholder="チーム名" />
                </div>
                <div className="adm-field">
                  <label>アウェイ</label>
                  <input value={cform.away_name} onChange={cfld('away_name')} placeholder="チーム名" />
                </div>
              </div>
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
    </div>
  )
}
