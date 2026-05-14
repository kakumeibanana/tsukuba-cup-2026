export default function AlertBanner() {
  return (
    <div className="alert">
      <svg className="alert-ico" viewBox="0 0 48 48" fill="none">
        <path d="M14 22a10 10 0 0 1 19.5-3 8 8 0 1 1 .5 16H15a8 8 0 0 1-1-13z" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.6" />
        <path d="M20 36l-2 5M26 36l-2 5M32 36l-2 5" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div className="alert-body">
        <div className="alert-label">本日の開催状況</div>
        <div className="alert-msg">本日の試合は予定通り開催します</div>
      </div>
      <div className="alert-time num">5月13日(水) 11:20 更新</div>
    </div>
  )
}
