import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { normalizeMatch } from '../../lib/normalizeMatch'
import { autoSeedLeague, propagateWinner } from '../../lib/seedTournament'

const STATUS_OPTS = [
  { key: 'scheduled', label: '予定' },
  { key: 'live',      label: '🔴 LIVE' },
  { key: 'finished',  label: '終了' },
  { key: 'postponed', label: '延期' },
  { key: 'cancelled', label: '中止' },
]

function ScoreCounter({ value, onChange }) {
  return (
    <div className="adm-counter-row">
      <button className="adm-counter-btn" onClick={() => onChange(Math.max(0, value - 1))}>−</button>
      <div className="adm-counter-val num">{value}</div>
      <button className="adm-counter-btn" onClick={() => onChange(value + 1)}>＋</button>
    </div>
  )
}

const EMPTY_CFORM = {
  gender: '男子', stage: 'league', group_name: 'A', round: '準決勝',
  match_date: '', match_dow: '月', match_time: '',
  home_name: '', away_name: '',
}

export default function AdminMatches() {
  const [matches, setMatches]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [editing, setEditing]         = useState(null)
  const [creating, setCreating]       = useState(false)
  const [teamOptions, setTeamOptions] = useState([])
  const [search, setSearch]           = useState('')

  const [status, setStatus]           = useState('scheduled')
  const [scoreH, setScoreH]           = useState(0)
  const [scoreA, setScoreA]           = useState(0)
  const [pkWinner, setPkWinner]       = useState('')
  const [pkH, setPkH]                 = useState('')
  const [pkA, setPkA]                 = useState('')
  const [postponedTo, setPostponedTo] = useState('')
  const [mom, setMom]                 = useState('')
  const [momMode, setMomMode]         = useState('select') // 'select' | 'guest'
  const [goals, setGoals]             = useState([])
  const [pickerSide, setPickerSide]     = useState(null)
  const [ogFor, setOgFor]               = useState(null) // 'home' | 'away' — オウンゴールで得点が入る側
  const [guestName, setGuestName]       = useState('')
  const [homeMembers, setHomeMembers]   = useState([])
  const [awayMembers, setAwayMembers]   = useState([])
  const [pendingGoal, setPendingGoal]   = useState(null) // { side, scorer, teamName }
  const [assistGuest, setAssistGuest]   = useState('')

  const [cform, setCform]       = useState(EMPTY_CFORM)
  const [saving, setSaving]     = useState(false)
  const [toastMsg, setToastMsg] = useState(null)
  const [modalError, setModalError] = useState(null)

  useEffect(() => { fetchMatches() }, [])

  async function fetchMatches() {
    setLoading(true)
    const { data } = await supabase.from('matches').select('*')
    const normalized = (data ?? []).map(normalizeMatch)
    const pd = d => { const [m, day] = (d ?? '0/0').split('/').map(Number); return m * 100 + day }
    const pt = t => { if (!t) return 0; const [h, min] = t.split(':').map(Number); return h * 60 + (min || 0) }
    setMatches(normalized.sort((a, b) => pd(a.match_date) - pd(b.match_date) || pt(a.match_time) - pt(b.match_time)))
    setLoading(false)
  }

  async function fetchTeams() {
    const { data } = await supabase.from('teams').select('id, name, gender, group_name').order('gender').order('group_name')
    setTeamOptions(data ?? [])
  }

  async function openEdit(m) {
    setEditing(m)
    setStatus(m.status)
    setScoreH(m.score_home ?? 0)
    setScoreA(m.score_away ?? 0)
    setPkWinner(m.pk_winner ?? '')
    setPkH(m.pk_home ?? '')
    setPkA(m.pk_away ?? '')
    setPostponedTo(m.postponed_to ?? '')
    setMom(m.mom ?? '')
    setPickerSide(null)
    setOgFor(null)
    setModalError(null)

    const [{ data: goalsData }, { data: homeTeam }, { data: awayTeam }] = await Promise.all([
      supabase.from('goals').select('*').eq('match_id', m.id).order('created_at'),
      supabase.from('teams').select('members(id, name, sort_order)').eq('name', m.home_name).single(),
      supabase.from('teams').select('members(id, name, sort_order)').eq('name', m.away_name).single(),
    ])
    setGoals(goalsData ?? [])
    const homeSorted = (homeTeam?.members ?? []).sort((a, b) => a.sort_order - b.sort_order)
    const awaySorted = (awayTeam?.members ?? []).sort((a, b) => a.sort_order - b.sort_order)
    setHomeMembers(homeSorted)
    setAwayMembers(awaySorted)
    const allNames = [...homeSorted, ...awaySorted].map(x => x.name)
    setMomMode(m.mom && !allNames.includes(m.mom) ? 'guest' : 'select')
  }

  async function openCreate() {
    setModalError(null)
    setCform(EMPTY_CFORM)
    setCreating(true)
    setEditing(null)
    await fetchTeams()
  }

  function closeModal() { setEditing(null); setCreating(false); setPickerSide(null); setOgFor(null); setGuestName(''); setMom(''); setMomMode('select'); setModalError(null); setPendingGoal(null); setAssistGuest('') }

  function pickGoal(side, memberName) {
    if (ogFor) {
      // オウンゴール: 選んだ選手は相手チーム所属、得点は ogFor 側に加算。アシストなし。
      setGoals(prev => [...prev, {
        id: `tmp-${Date.now()}-${Math.random()}`,
        team_name: ogFor === 'home' ? editing.home_name : editing.away_name,
        player_name: memberName,
        assist_player: null,
        own_goal: true,
      }])
      setPickerSide(null)
      setOgFor(null)
      return
    }
    setPendingGoal({
      side,
      scorer: memberName,
      teamName: side === 'home' ? editing.home_name : editing.away_name,
    })
  }

  function confirmGoal(assistName) {
    setGoals(prev => [...prev, {
      id: `tmp-${Date.now()}-${Math.random()}`,
      team_name: pendingGoal.teamName,
      player_name: pendingGoal.scorer,
      assist_player: assistName || null,
      own_goal: false,
    }])
    setPendingGoal(null)
    setAssistGuest('')
  }

  async function handleSave() {
    setSaving(true)
    const hasScore = status === 'finished' || status === 'live'
    const isDraw   = hasScore && scoreH === scoreA
    const { error } = await supabase.from('matches').update({
      status:     status === 'finished' ? 'completed' : status,
      home_score: hasScore ? scoreH : null,
      away_score: hasScore ? scoreA : null,
      pk_winner:  (status === 'finished' && isDraw && pkWinner)
                    ? pkWinner : null,
      pk_home:    (status === 'finished' && isDraw && pkWinner && pkH !== '')
                    ? Number(pkH) : null,
      pk_away:    (status === 'finished' && isDraw && pkWinner && pkA !== '')
                    ? Number(pkA) : null,
      mom:        status === 'finished' && mom.trim() ? mom.trim() : null,
      postponed_to: status === 'postponed' && postponedTo.trim() ? postponedTo.trim() : null,
    }).eq('id', editing.id)

    if (error) { setSaving(false); setModalError(error.message); return }

    const { error: delErr } = await supabase.from('goals').delete().eq('match_id', editing.id)
    if (delErr) { setSaving(false); setModalError('得点者の保存に失敗しました: ' + delErr.message); return }

    if (goals.length > 0) {
      const { error: insErr } = await supabase.from('goals').insert(
        goals.map(g => ({ match_id: editing.id, team_name: g.team_name, player_name: g.player_name, assist_player: g.assist_player ?? null, own_goal: g.own_goal ?? false }))
      )
      if (insErr) { setSaving(false); setModalError('得点者の保存に失敗しました: ' + insErr.message); return }
    }

    let seedMsg = ''
    if (status === 'finished') {
      if (editing.stage === 'league') {
        const patchedMatches = matches.map(m =>
          m.id === editing.id
            ? { ...m, status: 'finished', score_home: scoreH, score_away: scoreA }
            : m
        )
        const seeded = await autoSeedLeague(patchedMatches, editing.gender, editing.group_name)
        if (seeded.length > 0) seedMsg = ' ／ トーナメント組み合わせを更新'
      } else if (editing.stage === 'tournament') {
        const nextId = await propagateWinner(editing.id, editing.home_name, editing.away_name, scoreH, scoreA, pkWinner)
        if (nextId) seedMsg = ' ／ 次ラウンドに勝者を反映'
      }
    }

    setSaving(false)
    closeModal()
    fetchMatches()
    showToast({ type: 'ok', text: `保存しました${seedMsg}` })
  }

  async function handleCreate() {
    if (!cform.home_name || !cform.away_name || !cform.match_date) {
      setModalError('日付・ホーム・アウェイは必須です'); return
    }
    if (cform.home_name === cform.away_name) {
      setModalError('ホームとアウェイに同じチームは選べません'); return
    }
    setSaving(true)
    const [monthStr, dayStr] = (cform.match_date ?? '').split('/')
    const ROUND_TO_CAT = { '準々決勝': 'quarterfinal', '準決勝': 'semifinal', '決勝': 'final', '3位決定戦': 'third' }
    const category  = cform.stage === 'league' ? 'group' : (ROUND_TO_CAT[cform.round] ?? 'final')
    const group_name = cform.stage === 'league'
      ? (cform.gender === '女子' ? '女子' : cform.group_name)
      : null
    const { error } = await supabase.from('matches').insert({
      gender:       cform.gender,
      category,
      group_name,
      month:        parseInt(monthStr) || null,
      day:          parseInt(dayStr)   || null,
      weekday:      cform.match_dow,
      kickoff_time: cform.match_time || null,
      home_team:    cform.home_name,
      away_team:    cform.away_name,
      status:       'scheduled',
    })
    setSaving(false)
    if (error) { setModalError(error.message); return }
    closeModal()
    fetchMatches()
    showToast({ type: 'ok', text: '試合を作成しました' })
  }

  async function handleDelete(id) {
    if (!confirm('この試合を削除しますか？')) return
    await supabase.from('matches').delete().eq('id', id)
    fetchMatches()
  }

  function showToast(msg) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const displayMatches = search.trim()
    ? matches.filter(m =>
        m.home_name.toLowerCase().includes(search.toLowerCase()) ||
        m.away_name.toLowerCase().includes(search.toLowerCase()) ||
        (m.match_date ?? '').includes(search)
      )
    : matches

  const grouped = {}
  displayMatches.forEach(m => {
    if (!grouped[m.match_date]) grouped[m.match_date] = []
    grouped[m.match_date].push(m)
  })
  const dates = Object.keys(grouped).sort((a, b) => {
    const p = d => { const [m, day] = d.split('/').map(Number); return m * 100 + day }
    return p(a) - p(b)
  })
  const cfld  = key => e => setCform(p => ({ ...p, [key]: e.target.value }))

  const pickerMembers  = pickerSide === 'home' ? homeMembers : awayMembers
  const pickerTeamName = pickerSide === 'home' ? editing?.home_name : editing?.away_name
  const pickerColor    = pickerSide === 'home' ? '#7c3aed' : '#db2777'

  const genderedTeams = teamOptions.filter(t => t.gender === cform.gender)

  // PK入力を表示する条件
  const showPk = status === 'finished' && scoreH === scoreA

  return (
    <div className="adm-section">
      <div className="adm-section-head">
        <h2 className="adm-section-title">試合管理</h2>
        <div className="adm-section-head-actions">
          <input
            className="adm-search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="チーム・日付で検索"
          />
          <button className="adm-btn adm-btn-primary" onClick={openCreate}>＋ 追加</button>
        </div>
      </div>

      {toastMsg && (
        <div className={`adm-alert ${toastMsg.type === 'ok' ? 'adm-alert-ok' : 'adm-alert-error'}`}>
          {toastMsg.text}
        </div>
      )}

      {loading ? <div className="adm-loading">読み込み中...</div>
        : displayMatches.length === 0 ? (
          <div className="adm-empty">{search ? '該当する試合がありません' : '試合がありません'}</div>
        ) : (
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
                          <div className="adm-mc-score num">
                            {m.score_home} – {m.score_away}
                            {m.pk_winner && <span style={{ fontSize: 10, marginLeft: 4, color: '#6b7280' }}>PK</span>}
                          </div>
                          <span className="adm-mc-edit-hint">編集 ›</span>
                        </>
                      ) : m.status === 'live' ? (
                        <>
                          {m.score_home != null && <div className="adm-mc-score num">{m.score_home} – {m.score_away}</div>}
                          <span className="adm-status-badge" style={{ background: '#fee2e218', color: '#dc2626' }}>🔴 LIVE</span>
                        </>
                      ) : m.status === 'cancelled' ? (
                        <span className="adm-status-badge" style={{ background: '#f3f4f6', color: '#9ca3af' }}>中止</span>
                      ) : m.status === 'postponed' ? (
                        <span className="adm-status-badge" style={{ background: '#fef3c7', color: '#b45309' }}>延期</span>
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

      {/* ===== 編集モーダル ===== */}
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
              {modalError && <div className="adm-alert adm-alert-error">{modalError}</div>}

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

              {status === 'postponed' && (
                <div>
                  <div className="adm-field-label">延期先（任意）</div>
                  <input
                    className="adm-search-input"
                    value={postponedTo}
                    onChange={e => setPostponedTo(e.target.value)}
                    placeholder="例：7/2（木）"
                    style={{ width: '100%' }}
                  />
                  <div style={{ fontSize: 11, color: 'var(--sub)', marginTop: 4 }}>
                    入力すると詳細画面に「○○に延期されました」と表示されます
                  </div>
                </div>
              )}

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

              {/* PK入力（決勝T・終了・引き分けのときのみ） */}
              {showPk && (
                <div>
                  <div className="adm-field-label">PK結果（引き分けのため）</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      { value: '',               label: 'PKなし' },
                      { value: editing.home_name, label: `${editing.home_name} 勝ち` },
                      { value: editing.away_name, label: `${editing.away_name} 勝ち` },
                    ].map(opt => (
                      <button key={opt.value}
                        onClick={() => setPkWinner(opt.value)}
                        style={{
                          padding: '6px 12px', borderRadius: 8, fontSize: 13, border: '1px solid',
                          borderColor: pkWinner === opt.value ? '#7c3aed' : 'var(--line)',
                          background:  pkWinner === opt.value ? '#7c3aed18' : 'transparent',
                          color:       pkWinner === opt.value ? '#7c3aed' : 'var(--ink-600)',
                          fontWeight:  pkWinner === opt.value ? 600 : 400,
                          cursor: 'pointer',
                        }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {pkWinner && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                      <span style={{ fontSize: 13, color: 'var(--ink-600)' }}>{editing.home_name}</span>
                      <input type="number" min="0" inputMode="numeric" value={pkH}
                        onChange={e => setPkH(e.target.value)}
                        style={{ width: 52, padding: '6px 8px', borderRadius: 8, border: '1px solid var(--line)', textAlign: 'center', fontSize: 15 }} />
                      <span style={{ fontWeight: 700, color: 'var(--sub)' }}>－</span>
                      <input type="number" min="0" inputMode="numeric" value={pkA}
                        onChange={e => setPkA(e.target.value)}
                        style={{ width: 52, padding: '6px 8px', borderRadius: 8, border: '1px solid var(--line)', textAlign: 'center', fontSize: 15 }} />
                      <span style={{ fontSize: 13, color: 'var(--ink-600)' }}>{editing.away_name}</span>
                    </div>
                  )}
                </div>
              )}

              {(status === 'finished' || status === 'live') && (
                <div className="adm-goals-section">
                  <div className="adm-field-label">得点者</div>
                  {goals.length > 0 && (
                    <div className="adm-goal-list">
                      {goals.map(g => (
                        <div key={g.id} className="adm-goal-item">
                          <div className="adm-goal-dot"
                            style={{ background: g.team_name === editing.home_name ? '#7c3aed' : '#db2777' }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="adm-goal-player">
                              {g.player_name}
                              {g.own_goal && <span style={{ color: '#dc2626', fontWeight: 600, marginLeft: 4 }}>(OG)</span>}
                            </div>
                            {g.assist_player && (
                              <div style={{ fontSize: 11, color: 'var(--sub)', marginTop: 1 }}>A: {g.assist_player}</div>
                            )}
                          </div>
                          <div className="adm-goal-team">{g.team_name}</div>
                          <button className="adm-goal-del"
                            onClick={() => setGoals(p => p.filter(x => x.id !== g.id))}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                  {pickerSide ? (
                    <div className="adm-member-picker">
                      {pendingGoal ? (
                        /* ── アシスト選択 ── */
                        <>
                          <div className="adm-member-picker-header">
                            <span style={{ color: pickerColor, fontWeight: 600, fontSize: 13 }}>
                              ⚽ {pendingGoal.scorer} のアシストは？
                            </span>
                            <button className="adm-btn-icon" onClick={() => { setPendingGoal(null); setAssistGuest('') }}>✕</button>
                          </div>
                          {pickerMembers.filter(m => m.name !== pendingGoal.scorer).length > 0 && (
                            <div className="adm-member-picker-list">
                              {pickerMembers.filter(m => m.name !== pendingGoal.scorer).map(m => (
                                <button key={m.id} className="adm-member-pick-btn"
                                  style={{ borderColor: pickerColor, color: pickerColor }}
                                  onClick={() => confirmGoal(m.name)}>
                                  {m.name}
                                </button>
                              ))}
                            </div>
                          )}
                          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                            <input
                              value={assistGuest}
                              onChange={e => setAssistGuest(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') confirmGoal(assistGuest.trim() || null) }}
                              placeholder="助っ人の名前を入力"
                              style={{ flex: 1, padding: '5px 8px', border: '1px solid var(--line)', borderRadius: 6, fontSize: 13 }}
                            />
                            <button onClick={() => confirmGoal(assistGuest.trim() || null)}
                              className="adm-btn-sm" style={{ background: '#f3f4f6', color: 'var(--ink-700)', whiteSpace: 'nowrap' }}>
                              {assistGuest.trim() ? '追加' : 'なし'}
                            </button>
                          </div>
                        </>
                      ) : (
                        /* ── 得点者選択 ── */
                        <>
                          <div className="adm-member-picker-header">
                            <span style={{ color: pickerColor, fontWeight: 600, fontSize: 13 }}>
                              {ogFor
                                ? `オウンゴール（${pickerTeamName}の選手 → ${ogFor === 'home' ? editing.home_name : editing.away_name}に加点）`
                                : pickerTeamName}
                            </span>
                            <button className="adm-btn-icon" onClick={() => { setPickerSide(null); setOgFor(null) }}>✕</button>
                          </div>
                          {pickerMembers.length > 0 ? (
                            <>
                              <div className="adm-member-picker-list">
                                {pickerMembers.map(m => (
                                  <button key={m.id} className="adm-member-pick-btn"
                                    style={{ borderColor: pickerColor, color: pickerColor }}
                                    onClick={() => pickGoal(pickerSide, m.name)}>
                                    {m.name}
                                  </button>
                                ))}
                              </div>
                              <div style={{ borderTop: '1px solid var(--line)', marginTop: 8, paddingTop: 8 }}>
                                <div style={{ fontSize: 11, color: 'var(--sub)', marginBottom: 5, fontWeight: 600 }}>助っ人</div>
                                <div style={{ display: 'flex', gap: 6 }}>
                                  <input value={guestName} onChange={e => setGuestName(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter' && guestName.trim()) { pickGoal(pickerSide, guestName.trim()); setGuestName('') } }}
                                    placeholder="氏名を入力"
                                    style={{ flex: 1, padding: '5px 8px', border: '1px solid var(--line)', borderRadius: 6, fontSize: 13 }} />
                                  <button onClick={() => { if (guestName.trim()) { pickGoal(pickerSide, guestName.trim()); setGuestName('') } }}
                                    className="adm-btn-sm" style={{ whiteSpace: 'nowrap', background: '#f3f4f6', color: 'var(--ink-700)' }}>追加</button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div>
                              <div style={{ fontSize: 12, color: 'var(--sub)', marginBottom: 8 }}>選手が未登録です。名前を直接入力して追加できます。</div>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <input autoFocus value={guestName} onChange={e => setGuestName(e.target.value)}
                                  onKeyDown={e => { if (e.key === 'Enter' && guestName.trim()) { pickGoal(pickerSide, guestName.trim()); setGuestName('') } }}
                                  placeholder="選手名を入力して Enter"
                                  style={{ flex: 1, padding: '8px 10px', border: `1.5px solid ${pickerColor}`, borderRadius: 8, fontSize: 14 }} />
                                <button onClick={() => { if (guestName.trim()) { pickGoal(pickerSide, guestName.trim()); setGuestName('') } }}
                                  className="adm-btn adm-btn-primary" style={{ whiteSpace: 'nowrap' }}>追加</button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="adm-add-goal-row">
                        <button className="adm-add-goal-btn adm-add-goal-home"
                          onClick={() => setPickerSide('home')}>
                          ＋ {editing.home_name}
                        </button>
                        <button className="adm-add-goal-btn adm-add-goal-away"
                          onClick={() => setPickerSide('away')}>
                          ＋ {editing.away_name}
                        </button>
                      </div>
                      <div className="adm-add-goal-row" style={{ marginTop: 6 }}>
                        <button className="adm-add-goal-btn" style={{ borderColor: '#dc2626', color: '#dc2626' }}
                          onClick={() => { setOgFor('home'); setPickerSide('away') }}>
                          OG ＋ {editing.home_name}
                        </button>
                        <button className="adm-add-goal-btn" style={{ borderColor: '#dc2626', color: '#dc2626' }}
                          onClick={() => { setOgFor('away'); setPickerSide('home') }}>
                          OG ＋ {editing.away_name}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {status === 'finished' && (
                <div>
                  <div className="adm-field-label">MOM（Man of the Match）</div>
                  <select
                    value={momMode === 'guest' ? '__guest__' : mom}
                    onChange={e => {
                      if (e.target.value === '__guest__') { setMomMode('guest'); setMom('') }
                      else { setMomMode('select'); setMom(e.target.value) }
                    }}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--line)', borderRadius: 8, fontSize: 13, background: '#fff' }}
                  >
                    <option value="">— 未選定 —</option>
                    {homeMembers.length > 0 && (
                      <optgroup label={editing?.home_name}>
                        {homeMembers.map(m => (
                          <option key={m.id} value={m.name}>{m.name}</option>
                        ))}
                      </optgroup>
                    )}
                    {awayMembers.length > 0 && (
                      <optgroup label={editing?.away_name}>
                        {awayMembers.map(m => (
                          <option key={m.id} value={m.name}>{m.name}</option>
                        ))}
                      </optgroup>
                    )}
                    <option value="__guest__">✏️ 助っ人（手入力）</option>
                  </select>
                  {momMode === 'guest' && (
                    <input
                      autoFocus
                      value={mom}
                      onChange={e => setMom(e.target.value)}
                      placeholder="助っ人の名前を入力"
                      style={{ width: '100%', marginTop: 6, padding: '8px 10px', border: '1px solid var(--purple-500)', borderRadius: 8, fontSize: 13 }}
                    />
                  )}
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                <button className="adm-btn-sm adm-btn-danger"
                  onClick={() => { handleDelete(editing.id); closeModal() }}>
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

      {/* ===== 作成モーダル ===== */}
      {creating && (
        <div className="adm-modal-backdrop" onClick={closeModal}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-head">
              <h3>試合を作成</h3>
              <button className="adm-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="adm-modal-body">
              {modalError && <div className="adm-alert adm-alert-error">{modalError}</div>}

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
                    <select value={cform.round} onChange={cfld('round')}>
                      {['準々決勝','準決勝','決勝','3位決定戦'].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div className="adm-form-row">
                <div className="adm-field">
                  <label>ホーム</label>
                  {genderedTeams.length > 0 ? (
                    <select value={cform.home_name} onChange={cfld('home_name')}>
                      <option value="">— 選択 —</option>
                      {genderedTeams.map(t => (
                        <option key={t.id} value={t.name}>{t.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input value={cform.home_name} onChange={cfld('home_name')} placeholder="チーム名" />
                  )}
                </div>
                <div className="adm-field">
                  <label>アウェイ</label>
                  {genderedTeams.length > 0 ? (
                    <select value={cform.away_name} onChange={cfld('away_name')}>
                      <option value="">— 選択 —</option>
                      {genderedTeams.filter(t => t.name !== cform.home_name).map(t => (
                        <option key={t.id} value={t.name}>{t.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input value={cform.away_name} onChange={cfld('away_name')} placeholder="チーム名" />
                  )}
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
