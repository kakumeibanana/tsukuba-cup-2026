import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

const DEADLINE    = '6/1（月）'
const MAX_MEMBERS = 10
const MIN_MEMBERS = 7
const MAX_SOCCER  = 5
const YEARS   = ['1年', '2年', '3年']
const CLASSES = ['1組', '2組', '3組', '4組', '5組', '6組']

const emptyMember = () => ({ name: '', year: '2年', cls: '1組', isSoccer: false, isTeacher: false })


export default function Apply() {
  const [gender, setGender]         = useState('男子')
  const [teamName, setTeamName]     = useState('')
  const [members, setMembers]       = useState(Array.from({ length: MIN_MEMBERS }, emptyMember))
  const [leaderIdx, setLeaderIdx]   = useState(0)
  const [description, setDescription] = useState('')
  const [checks, setChecks]         = useState({ eligibility: false, noDouble: false })
  const [sending, setSending]       = useState(false)
  const [done, setDone]             = useState(false)
  const [error, setError]           = useState(null)
  const errorRef = useRef(null)

  function updateMember(i, field, val) {
    setMembers(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: val } : m))
  }
  function addMember() {
    if (members.length < MAX_MEMBERS) setMembers(prev => [...prev, emptyMember()])
  }
  function removeMember(i) {
    if (members.length > MIN_MEMBERS) {
      setMembers(prev => prev.filter((_, idx) => idx !== i))
      if (leaderIdx >= i && leaderIdx > 0) setLeaderIdx(l => l - 1)
    }
  }

  const filledMembers = members.filter(m => m.name.trim())
  const soccerCount   = members.filter(m => m.isSoccer).length

  const isFormReady = Boolean(
    teamName.trim() &&
    members.every(m => m.name.trim()) &&
    filledMembers.length >= MIN_MEMBERS &&
    soccerCount <= MAX_SOCCER &&
    members[leaderIdx]?.name?.trim() &&
    description.trim() &&
    checks.eligibility &&
    checks.noDouble
  )

  function showError(msg) {
    setError(msg)
    setTimeout(() => errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!teamName.trim())  { showError('チーム名を入力してください'); return }
    if (filledMembers.length < MIN_MEMBERS) {
      showError(`メンバーは${MIN_MEMBERS}人以上入力してください`); return
    }
    const allFilled = members.every(m => m.name.trim())
    if (!allFilled) { showError('全メンバーの名前を入力してください'); return }
    if (soccerCount > MAX_SOCCER) {
      showError(`サッカークラブ員は${MAX_SOCCER}人以内にしてください`); return
    }
    const leaderName = members[leaderIdx]?.name?.trim() || ''
    if (!leaderName) { showError('リーダーのメンバー名を入力してください'); return }
    if (!description.trim()) { showError('チーム紹介を入力してください'); return }
    if (!checks.eligibility || !checks.noDouble) {
      showError('規定の確認チェックを入れてください'); return
    }

    setSending(true)
    const { error: err } = await supabase.from('applications').insert({
      team_name:   teamName.trim(),
      gender,
      members,
      leader_name: leaderName,
      description: description.trim(),
    })
    if (err) {
      setSending(false)
      showError('送信に失敗しました。もう一度お試しください。')
      return
    }

    // 管理者にメール通知（失敗してもフォームは完了扱いにする）
    supabase.functions.invoke('notify-application', {
      body: { teamName: teamName.trim(), gender },
    }).catch(() => {})

    setSending(false)
    setDone(true)
  }

  if (done) return (
    <main className="page">
      <div className="apply-done">
        <div className="apply-done-icon">✓</div>
        <h2 className="apply-done-title">申し込みを受け付けました</h2>
        <p className="apply-done-sub">
          {teamName}（{gender}）の参加申し込みを受け付けました。<br />
          運営から連絡が届くまでお待ちください。
        </p>
        <a href="/" className="apply-done-btn">ホームへ戻る</a>
      </div>
    </main>
  )

  return (
    <main className="page">
      <div className="page-head">
        <h2 className="page-title">参加申し込み</h2>
      </div>

      <div className="apply-deadline-banner">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        </svg>
        申し込み締め切り：{DEADLINE}
      </div>

      <div className="apply-rules-card">
        <div className="apply-rules-title">参加資格・チーム規定</div>
        <ul className="apply-rules-list">
          <li>参加資格：本校在籍の生徒および教職員</li>
          <li>1チーム <strong>7人以上10人以内</strong></li>
          <li>サッカークラブ員は <strong>1チームにつき5人以内</strong>（同時出場は3人まで）</li>
          <li>同時に2つ以上のチームへの所属は不可</li>
        </ul>
      </div>

      <form className="apply-form card" onSubmit={handleSubmit}>
        {error && <div ref={errorRef} className="adm-alert adm-alert-error">{error}</div>}

        {/* 男女の部 */}
        <div className="apply-field">
          <label className="apply-label">男女の部 <span className="apply-required">必須</span></label>
          <div className="apply-gender-pills">
            {['男子', '女子'].map(g => (
              <button type="button" key={g}
                className={`apply-gender-pill${gender === g ? ' active' : ''}`}
                onClick={() => setGender(g)}>{g}の部</button>
            ))}
          </div>
        </div>

        {/* チーム名 */}
        <div className="apply-field">
          <label className="apply-label">チーム名 <span className="apply-required">必須</span></label>
          <input className="apply-input" value={teamName}
            onChange={e => setTeamName(e.target.value)}
            placeholder="例：2年3組チーム" maxLength={30} />
        </div>

        {/* メンバー */}
        <div className="apply-field">
          <div className="apply-members-head">
            <label className="apply-label">
              メンバー <span className="apply-required">必須</span>
              <span className="apply-label-hint">　{MIN_MEMBERS}〜{MAX_MEMBERS}人</span>
            </label>
            <span className="apply-member-count">{filledMembers.length} / {MAX_MEMBERS}</span>
          </div>

          <div className="apply-members-list">
            {members.map((m, i) => (
              <div key={i} className="apply-member-card">
                <div className="apply-member-card-head">
                  <span className="apply-member-badge">メンバー{i + 1}</span>
                  {i >= MIN_MEMBERS && (
                    <button type="button" className="apply-member-del"
                      onClick={() => removeMember(i)}>✕ 削除</button>
                  )}
                </div>

                <div className="apply-field">
                  <label className="apply-label-sm">名前 <span className="apply-required">必須</span></label>
                  <input className="apply-input" value={m.name}
                    onChange={e => updateMember(i, 'name', e.target.value)}
                    placeholder="フルネームで入力" maxLength={20} />
                </div>

                <label className="apply-soccer-check" style={{ marginTop: 4 }}>
                  <input type="checkbox" checked={m.isTeacher}
                    onChange={e => updateMember(i, 'isTeacher', e.target.checked)} />
                  <span>教職員（先生）</span>
                </label>

                {!m.isTeacher && (
                  <div className="apply-member-class-row">
                    <div className="apply-field">
                      <label className="apply-label-sm">学年 <span className="apply-required">必須</span></label>
                      <select className="apply-input apply-select"
                        value={m.year} onChange={e => updateMember(i, 'year', e.target.value)}>
                        {YEARS.map(y => <option key={y}>{y}</option>)}
                      </select>
                    </div>
                    <div className="apply-field">
                      <label className="apply-label-sm">クラス <span className="apply-required">必須</span></label>
                      <select className="apply-input apply-select"
                        value={m.cls} onChange={e => updateMember(i, 'cls', e.target.value)}>
                        {CLASSES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {!m.isTeacher && (
                  <label className="apply-soccer-check">
                    <input type="checkbox" checked={m.isSoccer}
                      onChange={e => updateMember(i, 'isSoccer', e.target.checked)} />
                    <span>サッカークラブ員</span>
                  </label>
                )}
              </div>
            ))}
          </div>

          {members.length < MAX_MEMBERS && (
            <button type="button" className="apply-add-member-btn" onClick={addMember}>
              ＋ メンバーを追加
            </button>
          )}

          {soccerCount > 0 && (
            <div className="apply-soccer-note" style={{ marginTop: 10 }}>
              サッカークラブ員：{soccerCount}人
              {soccerCount > MAX_SOCCER
                ? <span style={{ color: '#dc2626', marginLeft: 6 }}>⚠ {MAX_SOCCER}人以内にしてください</span>
                : <span style={{ color: '#16a34a', marginLeft: 6 }}>（同時出場は3人まで）</span>
              }
            </div>
          )}
        </div>

        {/* リーダー選択 */}
        <div className="apply-field">
          <label className="apply-label">
            チームリーダー <span className="apply-required">必須</span>
            <span className="apply-label-hint">　メンバーから選択</span>
          </label>
          <select className="apply-input apply-select"
            value={leaderIdx}
            onChange={e => setLeaderIdx(Number(e.target.value))}>
            {members.map((m, i) => (
              <option key={i} value={i}>
                {m.name.trim()
                  ? m.isTeacher
                    ? `${m.name}（先生）`
                    : `${m.name}（${m.year}${m.cls}）`
                  : `メンバー${i + 1}（未入力）`}
              </option>
            ))}
          </select>
        </div>

        {/* チーム紹介 */}
        <div className="apply-field">
          <label className="apply-label">
            チーム紹介 <span className="apply-required">必須</span>
            <span className="apply-label-hint">　1〜2文</span>
          </label>
          <textarea className="apply-input apply-textarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="例：クラス全員で優勝を目指します！サッカー経験者3人が中心です。"
            rows={3} maxLength={100} />
          <div className="apply-char-count">{description.length} / 100</div>
        </div>

        {/* 確認チェック */}
        <div className="apply-checks">
          <label className="apply-check-row">
            <input type="checkbox" checked={checks.eligibility}
              onChange={() => setChecks(p => ({ ...p, eligibility: !p.eligibility }))} />
            <span>参加者全員が本校在籍の生徒・教職員であることを確認しました <span className="apply-required">必須</span></span>
          </label>
          <label className="apply-check-row">
            <input type="checkbox" checked={checks.noDouble}
              onChange={() => setChecks(p => ({ ...p, noDouble: !p.noDouble }))} />
            <span>メンバー全員が同時に2チーム以上に所属していないことを確認しました <span className="apply-required">必須</span></span>
          </label>
        </div>

        <div className="apply-submit-wrap">
          <button type="submit"
            className={`apply-submit-btn${isFormReady ? '' : ' not-ready'}`}
            disabled={sending}>
            {sending
              ? <><span className="apply-submit-spinner" />送信中...</>
              : '申し込みを送信する →'}
          </button>
          <p className="apply-submit-note">送信後、運営から確認の連絡が届きます</p>
        </div>
      </form>
    </main>
  )
}
