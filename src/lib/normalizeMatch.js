const CATEGORY_TO_STAGE = {
  group: 'league',
  reserve: 'reserve',
  quarterfinal: 'tournament',
  semifinal: 'tournament',
  final: 'tournament',
  third: 'tournament',
}

const CATEGORY_TO_ROUND = {
  quarterfinal: '準々決勝',
  semifinal: '準決勝',
  final: '決勝',
  third: '3位決定戦',
}

export function normalizeMatch(m) {
  if (!m) return m
  const match_date = (m.month != null && m.day != null) ? `${m.month}/${m.day}` : null
  const stage  = CATEGORY_TO_STAGE[m.category] ?? 'league'
  const round  = CATEGORY_TO_ROUND[m.category] ?? null
  const gender = m.gender ?? (m.group_name === '女子' ? '女子' : '男子')
  const status = m.status === 'completed' ? 'finished' : m.status

  return {
    ...m,
    home_name: m.home_team,
    away_name: m.away_team,
    score_home: m.home_score,
    score_away: m.away_score,
    gender,
    stage,
    round,
    match_date,
    match_dow: m.weekday,
    match_time: m.kickoff_time,
    status,
  }
}
