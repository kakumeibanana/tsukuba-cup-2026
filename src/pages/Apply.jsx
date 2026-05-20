import { useState } from 'react'
import { supabase } from '../lib/supabase'

const DEADLINE = '6/1（月）'
const MAX_MEMBERS = 10
const MIN_MEMBERS = 7

export default function Apply() {
  const [gender, setGender]       = useState('男子')
  const [teamName, setTeamName]   = useState('')
  const [repName, setRepName]     = useState('')
  const [repContact, setRepContact] = useState('')
  const [repClass, setRepClass]   = useState('')
  const [members, setMembers]     = useState(Array(MIN_MEMBERS).fill(''))
  const [description, setDescription] = useState('')
  const [sending, setSending]     = useState(false)
  const [done, setDone]           = useState(false)
  const [error, setError]         = useState(null)

  function setMember(i, val) {
    setMembers(prev => prev.map((m, idx) => idx === i ? val : m))
  }
  function addMember() {
    if (members.length < MAX_MEMBERS) setMembers(prev => [...prev, ''])
  }
  function removeMember(i) {
    if (members.length > MIN_MEMBERS) setMembers(prev => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    const filledMembers = members.map(m => m.trim()).filter(Boolean)
    if (!teamName.trim()) { setError('チーム名を入力してください'); return }
    if (!repName.trim())  { setError('代表者名を入力してください'); return }
    if (!repContact.trim()) { setError('連絡先を入力してください'); return }
    if (!repClass.trim()) { setError('クラス・学年を入力してください'); return }
    if (filledMembers.length < MIN_MEMBERS) {
      setError(`メンバーは${MIN_MEMBERS}人以上入力してください`); return
    }

    setSending(true)
    const { error: err } = await supabase.from('applications').insert({
      team_name: teamName.trim(),
      gender,
      rep_name: repName.trim(),
      rep_contact: repContact.trim(),
      rep_class: repClass.trim(),
      members: filledMembers,
      description: description.trim(),
    })
    setSending(false)
    if (err) { setError('送信に失敗しました。もう一度お試しください。'); return }
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

      <form className="apply-form card" onSubmit={handleSubmit}>
        {error && <div className="adm-alert adm-alert-error">{error}</div>}

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

        {/* 代表者 */}
        <div className="apply-field-row">
          <div className="apply-field">
            <label className="apply-label">代表者名 <span className="apply-required">必須</span></label>
            <input className="apply-input" value={repName}
              onChange={e => setRepName(e.target.value)}
              placeholder="例：山田太郎" maxLength={20} />
          </div>
          <div className="apply-field">
            <label className="apply-label">クラス・学年 <span className="apply-required">必須</span></label>
            <input className="apply-input" value={repClass}
              onChange={e => setRepClass(e.target.value)}
              placeholder="例：2年3組" maxLength={20} />
          </div>
        </div>

        {/* 連絡先 */}
        <div className="apply-field">
          <label className="apply-label">連絡先（メールアドレス or LINE ID）<span className="apply-required">必須</span></label>
          <input className="apply-input" value={repContact}
            onChange={e => setRepContact(e.target.value)}
            placeholder="例：taro@sgh-tsukuba.org" maxLength={80} />
        </div>

        {/* メンバー */}
        <div className="apply-field">
          <div className="apply-members-head">
            <label className="apply-label">
              メンバー <span className="apply-required">必須</span>
              <span className="apply-label-hint">（{MIN_MEMBERS}〜{MAX_MEMBERS}人）</span>
            </label>
            <span className="apply-member-count">{members.filter(m=>m.trim()).length} / {MAX_MEMBERS}</span>
          </div>
          <div className="apply-members-list">
            {members.map((m, i) => (
              <div key={i} className="apply-member-row">
                <span className="apply-member-num">{i + 1}</span>
                <input className="apply-input apply-member-input"
                  value={m} onChange={e => setMember(i, e.target.value)}
                  placeholder={`メンバー${i + 1}の名前`} maxLength={20} />
                {members.length > MIN_MEMBERS && (
                  <button type="button" className="apply-member-del"
                    onClick={() => removeMember(i)}>✕</button>
                )}
              </div>
            ))}
          </div>
          {members.length < MAX_MEMBERS && (
            <button type="button" className="apply-add-member-btn" onClick={addMember}>
              ＋ メンバーを追加
            </button>
          )}
        </div>

        {/* チーム紹介 */}
        <div className="apply-field">
          <label className="apply-label">チーム紹介（任意）
            <span className="apply-label-hint">　1〜2文で</span>
          </label>
          <textarea className="apply-input apply-textarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="例：クラス全員で優勝を目指します！サッカー経験者3人が中心です。"
            rows={3} maxLength={100} />
          <div className="apply-char-count">{description.length} / 100</div>
        </div>

        <button type="submit" className="apply-submit-btn" disabled={sending}>
          {sending ? '送信中...' : '申し込みを送信する'}
        </button>
        <p className="apply-note">送信後、運営から連絡が届きます。</p>
      </form>
    </main>
  )
}
