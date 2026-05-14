export default function RecentResults() {
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">
          <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M14.5 9.5L20 4M20 4h-4M20 4v4" />
            <path d="M9.5 14.5L4 20M4 20h4M4 20v-4" />
            <path d="M9.5 9.5L4 4M4 4h4M4 4v4" />
            <path d="M14.5 14.5L20 20M20 20v-4M20 20h-4" />
          </svg>
          直近の試合結果
        </div>
        <a href="#" className="link-more">
          すべて見る
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
      <div className="results-grid">

        <div className="result-card">
          <div className="date num">5/12 (月)</div>
          <div className="league">男子 予選リーグ Aグループ</div>
          <div className="teams">
            <div className="t winner">
              <svg className="crest" viewBox="0 0 40 40">
                <path d="M20 2 L36 7 V20 C36 28 29 34 20 37 C11 34 4 28 4 20 V7 Z" fill="#5b21b6" />
                <path d="M20 10 L26 20 L20 30 L14 20 Z" fill="#fff" />
              </svg>
              <div className="nm">FC紫炎</div>
            </div>
            <div className="vs">VS</div>
            <div className="t">
              <svg className="crest" viewBox="0 0 40 40">
                <path d="M20 2 L36 7 V20 C36 28 29 34 20 37 C11 34 4 28 4 20 V7 Z" fill="#1e3a8a" />
                <path d="M6 18c4 3 8 3 14 0s10 0 14 0v6c-4 0-8 3-14 3s-10-3-14-3z" fill="#fff" />
              </svg>
              <div className="nm">Blue Wave</div>
            </div>
          </div>
          <div className="score num"><span className="w-side">3</span> <span className="dash">-</span> 1</div>
          <span className="pill pill-win">WIN</span>
        </div>

        <div className="result-card">
          <div className="date num">5/12 (月)</div>
          <div className="league">女子 予選リーグ Bグループ</div>
          <div className="teams">
            <div className="t">
              <svg className="crest" viewBox="0 0 40 40">
                <path d="M20 2 L36 7 V20 C36 28 29 34 20 37 C11 34 4 28 4 20 V7 Z" fill="#be185d" />
                <path d="M14 14h12v4l-6 8-6-8z" fill="#fff" />
              </svg>
              <div className="nm">筑嶺女</div>
            </div>
            <div className="vs">VS</div>
            <div className="t">
              <svg className="crest" viewBox="0 0 40 40">
                <path d="M20 2 L36 7 V20 C36 28 29 34 20 37 C11 34 4 28 4 20 V7 Z" fill="#1e40af" />
                <path d="M20 10l2.5 5.2 5.5.8-4 4 1 5.7L20 23l-5 2.7 1-5.7-4-4 5.5-.8z" fill="#fff" />
              </svg>
              <div className="nm">FC Stella</div>
            </div>
          </div>
          <div className="score num">2 <span className="dash">-</span> 2</div>
          <span className="pill pill-draw">DRAW</span>
        </div>

        <div className="result-card">
          <div className="date num">5/11 (日)</div>
          <div className="league">男子 予選リーグ Cグループ</div>
          <div className="teams">
            <div className="t winner">
              <svg className="crest" viewBox="0 0 40 40">
                <path d="M20 2 L36 7 V20 C36 28 29 34 20 37 C11 34 4 28 4 20 V7 Z" fill="#7c3aed" />
                <path d="M14 14h12l-3 14h-6z" fill="#fff" />
              </svg>
              <div className="nm">FC筑附</div>
            </div>
            <div className="vs">VS</div>
            <div className="t">
              <svg className="crest" viewBox="0 0 40 40">
                <path d="M20 2 L36 7 V20 C36 28 29 34 20 37 C11 34 4 28 4 20 V7 Z" fill="#991b1b" />
                <path d="M12 16l8-4 8 4-2 10-6 4-6-4z" fill="#fff" />
              </svg>
              <div className="nm">AVANTI</div>
            </div>
          </div>
          <div className="score num"><span className="w-side">5</span> <span className="dash">-</span> 0</div>
          <span className="pill pill-win">WIN</span>
        </div>

      </div>
    </div>
  )
}
