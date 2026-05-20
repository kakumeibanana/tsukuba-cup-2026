import { useState } from 'react'
import { supabase } from '../lib/supabase'

const DEADLINE    = '6/1（月）'
const MAX_MEMBERS = 10
const MIN_MEMBERS = 7
const MAX_SOCCER  = 5

export default function Apply() {
  const [gender, setGender]         = useState('男子')
  const [teamName, setTeamName]     = useState('')
  const [repName, setRepName]       = useState('')
  const [repContact, setRepContact] = useState('')
  const [repClass, setRepClass]     = useState('')
  const [members, setMembers]       = useState(Array(MIN_MEMBERS).fill(''))
  const [soccerCount, setSoccerCount] = useState(0)
  const [description, setDescription] = useState('')
  const [checks, setChecks]         = useState({ eligibility: false, noDouble: false })
  const [sending, setSending]       = useState(false)
  const [done, setDone]             = useState(false)
  const [error, setError]           = useState(null)

  function setMember(i, val) {
    setMembers(prev => prev.map((m, idx) => idx === i ? val : m))
  }
  function addMember() {
    if (members.length < MAX_MEMBERS) setMembers(prev => [...prev, ''])
  }
  function removeMember(i) {
    if (members.length > MIN_MEMBERS) setMembers(prev => prev.filter((_, idx) => idx !== i))
  }
  function toggleCheck(key) {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    const filledMembers = members.map(m => m.trim()).filter(Boolean)

    if (!teamName.trim())    { setError('チーム名を入力してください'); return }
    if (!repName.trim())     { setError('代表者名を入力してください'); return }
    if (!repContact.trim())  { setError('連絡先を入力してください'); return }
    if (!repClass.trim())    { setError('クラス・学年を入力してください'); return }
    if (filledMembers.length < MIN_MEMBERS) {
      setError(`メンバーは${MIN_MEMBERS}人以上入力してください`); return
    }
    if (soccerCount > MAX_SOCCER) {
      setError(`サッカークラブ員は${MAX_SOCCER}人以内にしてください`); return
    }
    if (!checks.eligibility || !checks.noDouble) {
      setError('規定の確認チェックを入れてください'); return
    }

    setSending(true)
    const { error: err } = await supabase.from('applications').insert({
      team_name:   teamName.trim(),
      gender,
      rep_name:    repName.trim(),
      rep_contact: repContact.trim(),
      rep_class:   repClass.trim(),
      members:     filledMembers,
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

      {/* 参加資格・チーム規定 */}
      <div className="apply-rules-card">
        <div className="apply-rules-title">参加資格・チーム規定</div>
        <ul className="apply-rules-list">
          <li>参加資格：本校在籍の生徒および教職員</li>
          <li>1チーム <strong>7人以上10人以内</strong></li>
          <li>サッカークラブ員は <strong>1チームにつき5人以内</strong>（同時出場は3人まで）</li>
          <li>同時に2つ以上のチームへの所属は不可</li>
          <li>募集チーム数に制限なし</li>
        </ul>
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
              メンバー全員の名前 <span className="apply-required">必須</span>
              <span className="apply-label-hint">　{MIN_MEMBERS}〜{MAX_MEMBERS}人</span>
            </label>
            <span className="apply-member-count">{members.filter(m => m.trim()).length} / {MAX_MEMBERS}</span>
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

        {/* サッカークラブ員の人数 */}
        <div className="apply-field">
          <label className="apply-label">
            うちサッカークラブ員の人数
            <span className="apply-label-hint">　{MAX_SOCCER}人以内</span>
          </label>
          <div className="apply-soccer-row">
            {[0, 1, 2, 3, 4, 5].map(n => (
              <button type="button" key={n}
                className={`apply-soccer-btn${soccerCount === n ? ' active' : ''}${n > MAX_SOCCER ? ' over' : ''}`}
                onClick={() => setSoccerCount(n)}>
                {n}人
              </button>
            ))}
          </div>
          {soccerCount > 0 && (
            <div className="apply-soccer-note">
              ※ 同時に試合に出場できるのは<strong>3人まで</strong>です
            </div>
          )}
        </div>

        {/* チーム紹介 */}
        <div className="apply-field">
          <label className="apply-label">
            チーム紹介
            <span className="apply-label-hint">　任意・1〜2文</span>
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
              onChange={() => toggleCheck('eligibility')} />
            <span>参加者全員が本校在籍の生徒・教職員であることを確認しました</span>
          </label>
          <label className="apply-check-row">
            <input type="checkbox" checked={checks.noDouble}
              onChange={() => toggleCheck('noDouble')} />
            <span>メンバー全員が同時に2チーム以上に所属していないことを確認しました</span>
          </label>
        </div>

        <button type="submit" className="apply-submit-btn" disabled={sending}>
          {sending ? '送信中...' : '申し込みを送信する'}
        </button>
        <p className="apply-note">送信後、運営から連絡が届きます。</p>
      </form>
    </main>
  )
}
