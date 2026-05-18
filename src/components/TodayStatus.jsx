import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const STATUS = {
  open:      { label: '本日は予定通り開催します',    badge: '開催中',  badgeClass: 'ts-badge-open',      emoji: '⚽', grad: 'ts-grad-open' },
  cancelled: { label: '本日は雨天のため中止です',    badge: '中止',    badgeClass: 'ts-badge-cancelled',  emoji: '🌧', grad: 'ts-grad-cancelled' },
  pending:   { label: '本日の開催は現在確認中です',  badge: '確認中',  badgeClass: 'ts-badge-pending',    emoji: '🕐', grad: 'ts-grad-pending' },
  noMatch:   { label: '本日は試合の予定はありません', badge: '予定なし', badgeClass: 'ts-badge-no-match',  emoji: '📅', grad: 'ts-grad-no-match' },
}

const current = STATUS.open

export default function TodayStatus() {
  const navigate  = useNavigate()
  const tapsRef   = useRef([])

  function handleTap() {
    const now = Date.now()
    tapsRef.current = [...tapsRef.current, now].filter(t => now - t < 10000)
    if (tapsRef.current.length >= 10) {
      tapsRef.current = []
      navigate('/admin')
    }
  }

  return (
    <div className={`ts-wrap ${current.grad}`} onClick={handleTap}>
      <div className="ts-body">
        <span className="ts-emoji">{current.emoji}</span>
        <div className="ts-text">
          <div className="ts-title">本日の開催状況</div>
          <div className="ts-msg">{current.label}</div>
        </div>
        <span className={`ts-badge ${current.badgeClass}`}>{current.badge}</span>
      </div>
    </div>
  )
}
