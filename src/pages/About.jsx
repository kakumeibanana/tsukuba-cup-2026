const info = [
  { label: '大会名',   value: 'TSUKUBA CUP 2026夏' },
  { label: '主催',     value: 'サッカークラブ' },
  { label: '運営',     value: '「TSUKUBA CUP 2026夏」実行委員会' },
  { label: '責任者',   value: '末吉優希・河井駿一郎・高草木杏奈' },
  { label: '開催期間', value: '6月9日〜', sub: '昼休み開催' },
  { label: '会場',     value: 'コート面（バスケコート側）' },
  { label: '形式',     value: '予選リーグ → 決勝トーナメント' },
]

const schedule = [
  { date: '5/27（水）',   events: ['参加申し込み開始'] },
  { date: '6/5（金）',    events: ['申し込み締め切り（男子）'] },
  { date: '6/12（金）',   events: ['申し込み締め切り（女子）'] },
  { date: '6/9（火）〜7/14（水）', events: ['大会'] },
  { date: '6/17〜19',    events: ['定期考査'] },
]

const dailyFlow = [
  { time: '12:20',       desc: '担当各局員・第1試合出場各チーム 集合' },
  { time: '12:25–12:30', desc: '第1試合 前半' },
  { time: '12:30',       desc: '第2試合出場チーム 集合' },
  { time: '12:30–12:35', desc: '第1試合 後半' },
  { time: '12:36〜',     desc: '第1試合 PK戦（引き分けの場合）' },
  { time: '12:40',       desc: '第1試合出場チーム 解散' },
  { time: '12:40–12:45', desc: '第2試合 前半' },
  { time: '12:45–12:50', desc: '第2試合 後半' },
  { time: '12:51〜',     desc: '第2試合 PK戦（引き分けの場合）' },
  { time: '12:55–13:00', desc: '片付け・解散' },
]

const rules = [
  { title: '人数',         body: '5人（キーパー含む）' },
  { title: '試合時間',     body: '前後半 各5分・計10分。引き分けの場合はPK戦を行う' },
  { title: 'PK戦',        body: '各チーム3本ずつ交互に蹴る。3本ずつ蹴っても決着がつかない場合はサドンデス。試合前にPK戦で蹴る人を必ず決めておくこと。試合に出ていないメンバーも蹴ることができる' },
  { title: 'メンバー交代', body: 'キーパー以外はプレー中いつでも・何人でも交代可。ただし交代前の選手がコートを出てから次の選手が入ること。キーパーの交代は前後半の間のみ' },
  { title: '服装',         body: '体育の授業基準で運動できる服装。上半身の色をチームで統一すること（統一できない場合はビブス着用）。シューズは運動靴またはトレーニングシューズ（フットサルシューズ）' },
  { title: 'オフサイド',   body: 'なし' },
  { title: 'バックパス',   body: 'サッカーのルールに準ずる（キーパーが手で触れない限り、味方は何度でもキーパーへパス可）' },
  { title: 'キックイン',   body: 'ボールがタッチラインを割ったら相手側のキックインで再開。相手は5m以上離れること。ライン上で静止した状態で蹴り、プレー再開から4秒以内に蹴ること（違反は相手のキックインに変更）' },
  { title: 'ゴールクリアランス', body: '攻撃側が触れたボールがエンドラインを割った場合、キーパーがペナルティーエリア内から手で投げ入れて再開（蹴って始めることは不可）。プレー再開から4秒以内に投げること（違反は相手の間接フリーキック）' },
  { title: 'キーパー4秒ルール', body: 'キーパーはハーフライン手前でボール（足含む）を保持できるのは4秒以内' },
]

const eligibility = [
  '本校在籍の生徒および教職員',
  '各チーム 7人以上10人以内',
  'サッカークラブ員は各チーム5人以内（同時出場は3人まで）',
  '同時に2つ以上のチームに所属不可',
  '募集チーム数に制限は設けない',
]

const format = [
  { label: '部門',         body: '「男子の部」「女子の部」に分けて開催する。女子の部は参加チーム数に応じてリーグ戦のみになる場合もある' },
  { label: '予選リーグ',   body: '3〜4チームの総当たり戦。勝ち点方式で順位を決定（勝 +3・分 +1・負 ±0）。上位1〜2チームが決勝トーナメントへ進出' },
  { label: '決勝トーナメント', body: 'ノックアウト方式。シード権は全チーム中で最多勝ち点のチームに付与（同点時：得失点差→直接対決→じゃんけん）' },
  { label: '表彰',         body: '男女それぞれ 優勝・準優勝・3位・累計得点最多チーム・得点王を表彰。なお天候などで日数が不足した場合、3位決定戦を行わない可能性がある' },
]

export default function About() {
  return (
    <main className="page">
      <div className="page-head">
        <h2 className="page-title">大会について</h2>
      </div>

      {/* Hero */}
      <div className="about-hero">
        <div className="about-grid-bg" />
        <div className="about-hero-content">
          <div className="about-hero-eyebrow">TSUKUBA CUP 2026 SUMMER</div>
          <h1 className="about-hero-title">フットサル大会</h1>
          <p className="about-hero-sub">
            サッカークラブ主催。クラス・学年・部活の枠を超えて<br />
            学校全体でフットサルを楽しむことを目標とする。
          </p>
          <div className="about-hero-chips">
            <span className="about-chip">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              6/9〜
            </span>
            <span className="about-chip">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              コート面
            </span>
            <span className="about-chip">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
              </svg>
              昼休み開催
            </span>
          </div>
          <a
            href="https://www.instagram.com/tsukubacup?igsh=d2s5ZzM2dzkzYjZw"
            target="_blank"
            rel="noreferrer"
            className="about-insta-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
            </svg>
            <span>公式 Instagram <span className="about-insta-handle">@tsukubacup</span></span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </a>
        </div>
      </div>

      {/* 大会情報 + 日程 */}
      <div className="about-content-grid" id="info">
        <div className="card">
          <div className="card-head">
            <div className="card-title">
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
              </svg>
              大会情報
            </div>
          </div>
          <div className="about-info-list">
            {info.map(row => (
              <div key={row.label} className="about-info-row">
                <div className="about-info-label">{row.label}</div>
                <div className="about-info-value">
                  {row.value}
                  {row.sub && <span className="about-info-sub">{row.sub}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              日程
            </div>
          </div>
          <div className="sched-day-list">
            {schedule.map(day => (
              <div key={day.date} className="sched-day-row">
                <div className="sched-day-date num">{day.date}</div>
                <div className="sched-day-events">
                  {day.events.map((e, i) => (
                    <div key={i} className="sched-day-event">{e}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 大会形式 */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-head">
          <div className="card-title">
            <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 21h8M12 17V21M17 5V3H7v2M5 5v6a7 7 0 0014 0V5H5z"/>
            </svg>
            大会形式
          </div>
        </div>
        <div className="about-rule-list">
          {format.map(f => (
            <div key={f.label} className="about-rule-row">
              <div className="about-rule-label">{f.label}</div>
              <div className="about-rule-body">{f.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ルール + 参加資格 */}
      <div className="about-content-grid" id="rules" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-head">
            <div className="card-title">
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
              ルール概要
            </div>
          </div>
          <div className="about-rule-list">
            {rules.map(r => (
              <div key={r.title} className="about-rule-row">
                <div className="about-rule-label">{r.title}</div>
                <div className="about-rule-body">{r.body}</div>
              </div>
            ))}
          </div>
          <p className="about-rule-note">※ 上記以外はFIFA フットサル公式規則 2025–2026 に準ずる</p>
        </div>

        <div>
          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                </svg>
                参加資格・チーム規定
              </div>
            </div>
            <ul className="about-bullet-list">
              {eligibility.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-head">
              <div className="card-title">
                <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                </svg>
                1日の流れ
              </div>
            </div>
            <div className="about-flow-list">
              {dailyFlow.map((f, i) => (
                <div key={i} className="about-flow-row">
                  <div className="about-flow-time num">{f.time}</div>
                  <div className="about-flow-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
