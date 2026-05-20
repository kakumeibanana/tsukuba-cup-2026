import { useState } from 'react'
import { supabase } from '../lib/supabase'

const DEADLINE    = '6/1（月）'
const MAX_MEMBERS = 10
const MIN_MEMBERS = 7
const MAX_SOCCER  = 5
const YEARS   = ['1年', '2年', '3年']
const CLASSES = ['1組', '2組', '3組', '4組', '5組', '6組']

const emptyMember = () => ({ name: '', year: '2年', cls: '1組' })

export default function Apply() {
  const [gender, setGender]         = useState('男子')
  const [teamName, setTeamName]     = useState('')
  const [repName, setRepName]       = useState('')
  const [repClass, setRepClass]     = useState('')
  const [members, setMembers]       = useState(Array.from({ length: MIN_MEMBERS }, emptyMember))
  const [leaderIdx, setLeaderIdx]   = useState(0)
  const [soccerCount, setSoccerCount] = useState(0)
  const [description, setDescription] = useState('')
  const [checks, setChecks]         = useState({ eligibility: false, noDouble: false })
  const [sending, setSending]       = useState(false)
  const [done, setDone]             = useState(false)
  const [error, setError]           = useState(null)

  function updateMember(i, field, val) {
    setMembers(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: val } : m))
  }
  function addMember() {
    if (members.length < MAX_MEMBERS) {
      setMembers(prev => [...prev, emptyMember()])
    }
  }
  function removeMember(i) {
    if (members.length > MIN_MEMBERS) {
      setMembers(prev => prev.filter((_, idx) => idx !== i))
      if (leaderIdx >= i && leaderIdx > 0) setLeaderIdx(l => l - 1)
    }
  }

  const filledMembers = members.filter(m => m.name.trim())

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!teamName.trim())   { setError('チーム名を入力してください'); return }
    if (!repName.trim())    { setError('代表者名を入力してください'); return }
    if (!repClass.trim())   { setError('代表者のクラス・学年を入力してください'); return }
    if (filledMembers.length < MIN_MEMBERS) {
      setError(`メンバーは${MIN_MEMBERS}人以上入力してください`); return
    }
    const incomplete = members.findIndex(m => m.name.trim() && (!m.year || !m.cls))
    if (incomplete !== -1) { setError('全メンバーの学年・クラスを選択してください'); return }
    if (soccerCount > MAX_SOCCER) {
      setError(`サッカークラブ員は${MAX_SOCCER}人以内にしてください`); return
    }
    if (!checks.eligibility || !checks.noDouble) {
      setError('規定の確認チェックを入れてください'); return
    }

    const leaderName = members[leaderIdx]?.name?.trim() || ''
    if (!leaderName) { setError('リーダーのメンバー名を入力してください'); return }

    setSending(true)
    const { error: err } = await supabase.from('applications').insert({
      team_name:   teamName.trim(),
      gender,
      rep_name:    repName.trim(),
      rep_class:   repClass.trim(),
      members:     members.filter(m => m.name.trim()),
      leader_name: leaderName,
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
                  <span className="apply-member-num">メンバー {i + 1}</span>
                  {members.length > MIN_MEMBERS && (
                    <button type="button" className="apply-member-del"
                      onClick={() => removeMember(i)}>✕ 削除</button>
                  )}
                </div>

                <div className="apply-field">
                  <label className="apply-label-sm">名前</label>
                  <input className="apply-input" value={m.name}
                    onChange={e => updateMember(i, 'name', e.target.value)}
                    placeholder="フルネームで入力" maxLength={20} />
                </div>

                <div className="apply-member-class-row">
                  <div className="apply-field">
                    <label className="apply-label-sm">学年</label>
                    <select className="apply-input apply-select"
                      value={m.year} onChange={e => updateMember(i, 'year', e.target.value)}>
                      {YEARS.map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                  <div className="apply-field">
                    <label className="apply-label-sm">クラス</label>
                    <select className="apply-input apply-select"
                      value={m.cls} onChange={e => updateMember(i, 'cls', e.target.value)}>
                      {CLASSES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {members.length < MAX_MEMBERS && (
            <button type="button" className="apply-add-member-btn" onClick={addMember}>
              ＋ メンバーを追加
            </button>
          )}
        </div>

        {/* リーダー選択 */}
        <div className="apply-field">
          <label className="apply-label">
            チームリーダー <span className="apply-required">必須</span>
            <span className="apply-label-hint">　上で入力したメンバーから選択</span>
          </label>
          <select className="apply-input apply-select"
            value={leaderIdx}
            onChange={e => setLeaderIdx(Number(e.target.value))}>
            {members.map((m, i) => (
              <option key={i} value={i}>
                {m.name ? `${i + 1}. ${m.name}（${m.year}${m.cls}）` : `メンバー${i + 1}（未入力）`}
              </option>
            ))}
          </select>
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
                className={`apply-soccer-btn${soccerCount === n ? ' active' : ''}`}
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
            placeholder="例：クラス全員で優勝を目指します！"
            rows={3} maxLength={100} />
          <div className="apply-char-count">{description.length} / 100</div>
        </div>

        {/* 確認チェック */}
        <div className="apply-checks">
          <label className="apply-check-row">
            <input type="checkbox" checked={checks.eligibility}
              onChange={() => setChecks(p => ({ ...p, eligibility: !p.eligibility }))} />
            <span>参加者全員が本校在籍の生徒・教職員であることを確認しました</span>
          </label>
          <label className="apply-check-row">
            <input type="checkbox" checked={checks.noDouble}
              onChange={() => setChecks(p => ({ ...p, noDouble: !p.noDouble }))} />
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
