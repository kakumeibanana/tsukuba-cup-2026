const STATUS = {
  open:      { label: '本日は予定通り開催します',    badge: '開催中', badgeClass: 'ts-badge-open',      emoji: '⚽', grad: 'ts-grad-open' },
  cancelled: { label: '本日は雨天のため中止です',    badge: '中止',   badgeClass: 'ts-badge-cancelled',  emoji: '🌧', grad: 'ts-grad-cancelled' },
  pending:   { label: '本日の開催は現在確認中です',  badge: '確認中', badgeClass: 'ts-badge-pending',    emoji: '🕐', grad: 'ts-grad-pending' },
  noMatch:   { label: '本日は試合の予定はありません', badge: '予定なし', badgeClass: 'ts-badge-no-match', emoji: '📅', grad: 'ts-grad-no-match' },
}

const current = STATUS.open

export default function TodayStatus() {
  return (
    <div className={`ts-wrap ${current.grad}`}>
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
