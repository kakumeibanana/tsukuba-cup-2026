import { Link } from 'react-router-dom'

export default function RecentResults() {
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">
          <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 21h8M12 17V21M17 5V3H7v2M5 5v6a7 7 0 0014 0V5H5z"/>
          </svg>
          直近の試合結果
        </div>
        <Link to="/matches" className="link-more">
          すべて見る
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>

      <div className="no-results">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="16" rx="2"/>
          <path d="M3 9h18M8 3v4M16 3v4"/>
        </svg>
        <p>大会は <strong>6/8（月）</strong> から開幕します</p>
        <span>試合結果はここに表示されます</span>
      </div>
    </div>
  )
}
