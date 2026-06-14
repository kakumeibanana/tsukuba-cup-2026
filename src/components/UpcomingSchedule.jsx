import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { MatchModal } from './MatchCard'
import { normalizeMatch } from '../lib/normalizeMatch'

function sortByMatchDate(a, b) {
  const parse = d => { const [m, day] = (d ?? '0/0').split('/').map(Number); return m * 100 + day }
  return parse(a.match_date) - parse(b.match_date)
}

export default function UpcomingSchedule() {
  const [days, setDays]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    supabase
      .from('matches')
      .select('*')
      .eq('status', 'scheduled')
      .then(({ data }) => {
        const sorted = (data ?? []).map(normalizeMatch).sort(sortByMatchDate)
        const grouped = {}
        sorted.forEach(m => {
          if (!grouped[m.match_date]) grouped[m.match_date] = []
          grouped[m.match_date].push(m)
        })
        const dates = Object.keys(grouped).sort((a, b) => sortByMatchDate({ match_date: a }, { match_date: b }))
        const limited = dates.slice(0, 4).map(date => ({
          date,
          dow: grouped[date][0].match_dow,
          matches: grouped[date].map(m => ({
            raw: m,
            label: m.stage === 'league' ? `グループ ${m.group_name}` : (m.round ?? 'トーナメント'),
            badge: m.gender === '女子' ? 'badge-green' : 'badge-purple',
            home: m.home_name,
            away: m.away_name,
            time: m.match_time,
          })),
        }))
        setDays(limited)
        setLoading(false)
      })
  }, [])

  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">
          <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 9h18M8 3v4M16 3v4" />
          </svg>
          直近の予定
        </div>
        <Link to="/matches" className="link-more">
          日程ページへ
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>

      <div className="usched-list">
        {loading ? (
          <div style={{ padding: '16px 0', color: 'var(--sub)', fontSize: 13 }}>読み込み中...</div>
        ) : days.length === 0 ? (
          <div style={{ padding: '16px 0', color: 'var(--sub)', fontSize: 13 }}>予定されている試合はありません</div>
        ) : (
          days.map(day => (
            <div key={day.date} className="usched-day">
              <div className="usched-day-header">
                <span className="usched-date num">{day.date}（{day.dow}）</span>
              </div>
              <div className="usched-matches">
                {day.matches.map((m, i) => (
                  <div
                    key={i}
                    className="usched-row usched-row-clickable"
                    onClick={() => setSelected(m.raw)}
                  >
                    <span className="usched-time-tag">{m.time ?? '昼休み'}</span>
                    <span className={`badge ${m.badge}`}>{m.label}</span>
                    <span className="usched-teams">
                      <span className="usched-team">{m.home}</span>
                      <span className="usched-vs">vs</span>
                      <span className="usched-team">{m.away}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {selected && (
        <MatchModal
          m={selected}
          homeScorers={[]}
          awayScorers={[]}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
