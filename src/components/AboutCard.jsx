const ChevRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6l6 6-6 6" />
  </svg>
)

export default function AboutCard() {
  return (
    <div className="about-card" id="about">
      <div className="about-head">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
        </svg>
        大会について
      </div>
      <div className="about-lead">
        クラスや学年、部活の枠を超えて、<br />
        みんなでフットサルを楽しむ大会です。
      </div>
      <div className="about-links">
        <a className="about-link" href="#">
          <svg className="lead" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 5a2 2 0 0 1 2-2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
            <path d="M13 3v5h5M8 13h8M8 17h6" />
          </svg>
          大会実施要項
          <span className="chev"><ChevRight /></span>
        </a>
        <a className="about-link" href="#">
          <svg className="lead" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5M12 16v.01" strokeLinecap="round" />
          </svg>
          ルール・注意事項
          <span className="chev"><ChevRight /></span>
        </a>
        <a className="about-link" href="#">
          <svg className="lead" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13z" />
            <circle cx="12" cy="9" r="3" />
          </svg>
          会場について
          <span className="chev"><ChevRight /></span>
        </a>
        <a className="about-link" href="#" id="teams">
          <svg className="lead" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="8" cy="9" r="3" />
            <circle cx="17" cy="10" r="2.5" />
            <path d="M2 20c1-3.5 3.5-5 6-5s5 1.5 6 5M14 20c.5-2.5 2-4 3.5-4s3 1.2 3.5 4" />
          </svg>
          運営体制
          <span className="chev"><ChevRight /></span>
        </a>
      </div>
    </div>
  )
}
