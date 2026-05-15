const STATUS = {
  open:      { label: '本日は予定通り開催します',   color: 'status-open',      icon: '⚽' },
  cancelled: { label: '本日は雨天のため中止です',   color: 'status-cancelled', icon: '🌧' },
  pending:   { label: '本日の開催は現在確認中です', color: 'status-pending',   icon: '🕐' },
  noMatch:   { label: '本日は試合の予定はありません', color: 'status-no-match', icon: '📅' },
}

const current = STATUS.open

export default function TodayStatus() {
  return (
    <div className={`today-status ${current.color}`}>
      <div className="today-status-inner">
        <span className="today-status-emoji">{current.icon}</span>
        <div>
          <div className="today-status-title">本日の開催状況</div>
          <div className="today-status-msg">{current.label}</div>
        </div>
      </div>
    </div>
  )
}
