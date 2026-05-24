import { useState } from 'react'

/* ── Layout constants ─────────────────────────────────── */
const UNIT  = 96   // vertical slot height (px)
const CH    = 70   // card height (px)
const CW    = 164  // card width (px)
const CXGAP = 44   // connector column width (px)

/* ── Helpers ──────────────────────────────────────────── */
const byCreated = (a, b) => new Date(a.created_at) - new Date(b.created_at)

function matchWinner(m) {
  if (!m || m.status !== 'finished') return null
  if (m.score_home > m.score_away)   return m.home_name
  if (m.score_away > m.score_home)   return m.away_name
  return m.pk_winner || null
}

function matchLoser(m) {
  const w = matchWinner(m)
  if (!w || !m) return null
  return w === m.home_name ? m.away_name : m.home_name
}

// Center Y for match at round index r, match index i
// r=0 for first round (QF or SF), r=1 for second, etc.
// Formula: Y = (2^r - 0.5 + i * 2^(r+1)) * UNIT
function cY(r, i) {
  return (Math.pow(2, r) - 0.5 + i * Math.pow(2, r + 1)) * UNIT
}

/* ── TeamRow ──────────────────────────────────────────── */
function TeamRow({ name, score, win, lose, shown }) {
  const cls = `bk-team${win ? ' bk-team-win' : ''}${lose ? ' bk-team-lose' : ''}`
  return (
    <div className={cls}>
      <span className="bk-team-name">{name || 'TBD'}</span>
      {shown && score != null && (
        <span className={`bk-team-score num${win ? ' bk-score-win' : ''}`}>{score}</span>
      )}
    </div>
  )
}

/* ── BracketCard ──────────────────────────────────────── */
function BracketCard({ m, homeN, awayN, top, left, onClick }) {
  const fin   = m?.status === 'finished'
  const live  = m?.status === 'live'
  const shown = fin || live
  const isDraw   = fin && m.score_home === m.score_away && !m.pk_winner
  const homeWin  = fin && !isDraw && (m.score_home > m.score_away || m.pk_winner === m.home_name)
  const awayWin  = fin && !isDraw && (m.score_away > m.score_home || m.pk_winner === m.away_name)

  let cls = 'bk-card'
  if (live)  cls += ' bk-card-live'
  if (fin)   cls += ' bk-card-fin'
  if (!m)    cls += ' bk-card-tbd'

  return (
    <div
      className={cls}
      style={{ position: 'absolute', top, left, width: CW, height: CH, cursor: m ? 'pointer' : 'default' }}
      onClick={m ? onClick : undefined}
    >
      {live && <span className="bk-live-dot" />}
      <TeamRow
        name={homeN} score={m?.score_home}
        win={homeWin} lose={fin && !homeWin && !isDraw} shown={shown}
      />
      <div className="bk-card-div" />
      <TeamRow
        name={awayN} score={m?.score_away}
        win={awayWin} lose={fin && !awayWin && !isDraw} shown={shown}
      />
      {fin && m?.pk_winner && <div className="bk-pk-badge">PK</div>}
    </div>
  )
}

/* ── ConnectorSVG ─────────────────────────────────────── */
function ConnectorSVG({ pairs, h }) {
  const mx = CXGAP / 2
  const s  = 'rgba(139,92,246,0.4)'
  return (
    <svg width={CXGAP} height={h} style={{ display: 'block', flexShrink: 0 }}>
      {pairs.map(({ y1, y2, yTo }, i) => {
        const midY = (y1 + y2) / 2
        return (
          <g key={i}>
            <line x1={0} y1={y1}   x2={mx}    y2={y1}   stroke={s} strokeWidth={1.5} />
            <line x1={0} y1={y2}   x2={mx}    y2={y2}   stroke={s} strokeWidth={1.5} />
            <line x1={mx} y1={y1}  x2={mx}    y2={y2}   stroke={s} strokeWidth={1.5} />
            <line x1={mx} y1={midY} x2={CXGAP} y2={yTo} stroke={s} strokeWidth={1.5} />
          </g>
        )
      })}
    </svg>
  )
}

/* ── MatchDetailModal ─────────────────────────────────── */
function MatchDetailModal({ m, goalsMap, onClose }) {
  const fin     = m.status === 'finished'
  const live    = m.status === 'live'
  const shown   = fin || live
  const isDraw  = fin && m.score_home === m.score_away && !m.pk_winner
  const homeWin = fin && !isDraw && (m.score_home > m.score_away || m.pk_winner === m.home_name)
  const awayWin = fin && !isDraw && (m.score_away > m.score_home || m.pk_winner === m.away_name)
  const homeSc  = goalsMap[m.id]?.[m.home_name] ?? []
  const awaySc  = goalsMap[m.id]?.[m.away_name] ?? []

  return (
    <div className="bk-modal-bg" onClick={onClose}>
      <div className="bk-modal" onClick={e => e.stopPropagation()}>
        <button className="bk-modal-x" onClick={onClose}>✕</button>
        <div className="bk-modal-round-label">{m.round}</div>

        <div className="bk-modal-scoreboard">
          <div className={`bk-modal-side${homeWin ? ' bk-modal-side-win' : ''}`}>
            <div className="bk-modal-tname">{m.home_name}</div>
            {shown && m.score_home != null && (
              <div className="bk-modal-num num">{m.score_home}</div>
            )}
          </div>
          <div className="bk-modal-center">
            {shown
              ? <div className="bk-modal-sep">-</div>
              : <>
                  {m.match_date && <div className="bk-modal-date">{m.match_date}（{m.match_dow}）</div>}
                  <div className="bk-modal-vs">vs</div>
                </>
            }
          </div>
          <div className={`bk-modal-side bk-modal-side-r${awayWin ? ' bk-modal-side-win' : ''}`}>
            {shown && m.score_away != null && (
              <div className="bk-modal-num num">{m.score_away}</div>
            )}
            <div className="bk-modal-tname">{m.away_name}</div>
          </div>
        </div>

        {fin && m.pk_winner && (
          <div className="bk-modal-pk-note">PK戦：<strong>{m.pk_winner}</strong> が勝利</div>
        )}

        {(homeSc.length > 0 || awaySc.length > 0) && (
          <div className="bk-modal-goals">
            <div className="bk-modal-goals-l">
              {homeSc.map((s, i) => (
                <div key={i} className="bk-modal-scorer">
                  <span className="bk-goal-dot bk-goal-dot-h" />
                  {s}
                </div>
              ))}
            </div>
            <div className="bk-modal-goals-r">
              {awaySc.map((s, i) => (
                <div key={i} className="bk-modal-scorer bk-modal-scorer-r">
                  {s}
                  <span className="bk-goal-dot bk-goal-dot-a" />
                </div>
              ))}
            </div>
          </div>
        )}

        {shown && m.match_date && (
          <div className="bk-modal-footer">
            {m.match_date}（{m.match_dow}）{m.match_time && ` · ${m.match_time}`}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Main ─────────────────────────────────────────────── */
export default function TournamentBracket({ matches, goalsMap = {} }) {
  const [detail, setDetail] = useState(null)

  const tourn = matches.filter(m => m.stage === 'tournament')
  if (tourn.length === 0) {
    return (
      <div className="bk-empty">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 21h8M12 17V21M17 5V3H7v2M5 5v6a7 7 0 0014 0V5H5z"/>
        </svg>
        決勝トーナメントは予選終了後に組まれます
      </div>
    )
  }

  const qf    = [...tourn.filter(m => m.round === '準々決勝')].sort(byCreated)
  const sf    = [...tourn.filter(m => m.round === '準決勝')].sort(byCreated)
  const fin   = tourn.find(m => m.round === '決勝') || null
  const third = tourn.find(m => m.round === '3位決定戦') || null

  const hasQF   = qf.length > 0
  const sfR     = hasQF ? 1 : 0
  const finR    = hasQF ? 2 : 1
  const nFirst  = hasQF ? 4 : 2
  const bH      = nFirst * 2 * UNIT

  // SF: always 2 slots (null = not created yet)
  const sfSlots = [sf[0] || null, sf[1] || null]

  // Column definitions
  const cols = []
  if (hasQF) cols.push({ label: '準々決勝', items: qf,      r: 0 })
  cols.push({ label: '準決勝',   items: sfSlots, r: sfR })
  cols.push({ label: '決勝',     items: [fin],   r: finR })

  const bW = cols.length * CW + (cols.length - 1) * CXGAP

  // Derive team names for TBD slots
  function homeName(col, idx) {
    const m = col.items[idx]
    if (m?.home_name) return m.home_name
    if (col.label === '準決勝' && hasQF)
      return matchWinner(qf[idx * 2]) || (qf[idx * 2] ? '—' : 'TBD')
    if (col.label === '決勝')
      return matchWinner(sf[0]) || (sf[0] ? '—' : 'TBD')
    return 'TBD'
  }
  function awayName(col, idx) {
    const m = col.items[idx]
    if (m?.away_name) return m.away_name
    if (col.label === '準決勝' && hasQF)
      return matchWinner(qf[idx * 2 + 1]) || (qf[idx * 2 + 1] ? '—' : 'TBD')
    if (col.label === '決勝')
      return matchWinner(sf[1]) || (sf[1] ? '—' : 'TBD')
    return 'TBD'
  }

  const showThird = third || sf.some(m => matchLoser(m))

  return (
    <div className="bk-outer">
      <div className="bk-scroll-wrap">
        {/* Column labels */}
        <div style={{ position: 'relative', height: 28, width: bW, marginBottom: 10 }}>
          {cols.map((col, ci) => (
            <div
              key={col.label}
              className="bk-col-label-text"
              style={{ position: 'absolute', left: ci * (CW + CXGAP), width: CW }}
            >
              {col.label}
            </div>
          ))}
        </div>

        {/* Bracket canvas */}
        <div style={{ position: 'relative', width: bW, height: bH }}>
          {/* Cards */}
          {cols.flatMap((col, ci) =>
            col.items.map((m, mi) => (
              <BracketCard
                key={`${ci}-${mi}`}
                m={m}
                homeN={homeName(col, mi)}
                awayN={awayName(col, mi)}
                top={cY(col.r, mi) - CH / 2}
                left={ci * (CW + CXGAP)}
                onClick={() => setDetail(m)}
              />
            ))
          )}

          {/* Connectors */}
          {cols.slice(0, -1).map((col, ci) => {
            const nextR = cols[ci + 1].r
            const pairs = []
            for (let i = 0; i + 1 < col.items.length; i += 2) {
              pairs.push({
                y1:  cY(col.r, i),
                y2:  cY(col.r, i + 1),
                yTo: cY(nextR, i / 2),
              })
            }
            return (
              <div
                key={`c-${ci}`}
                style={{ position: 'absolute', left: ci * (CW + CXGAP) + CW, top: 0 }}
              >
                <ConnectorSVG pairs={pairs} h={bH} />
              </div>
            )
          })}
        </div>
      </div>

      {/* 3位決定戦 */}
      {showThird && (
        <div className="bk-third-wrap">
          <div className="bk-third-label-text">3位決定戦</div>
          <div style={{ position: 'relative', width: CW, height: CH, margin: '0 auto' }}>
            <BracketCard
              m={third}
              homeN={third?.home_name || matchLoser(sf[0]) || '準決勝1 敗者'}
              awayN={third?.away_name || matchLoser(sf[1]) || '準決勝2 敗者'}
              top={0}
              left={0}
              onClick={() => third && setDetail(third)}
            />
          </div>
        </div>
      )}

      {detail && (
        <MatchDetailModal
          m={detail}
          goalsMap={goalsMap}
          onClose={() => setDetail(null)}
        />
      )}
    </div>
  )
}
