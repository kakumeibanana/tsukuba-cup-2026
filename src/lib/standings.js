export function calcAllStandings(matches, gender) {
  return calcGroupStandings(matches, gender, null, true)
}

export function calcGroupStandings(matches, gender, group, ignoreGroup = false) {
  const inGroup = matches.filter(m =>
    m.gender === gender && m.stage === 'league' && (ignoreGroup || m.group_name === group)
  )
  const teamNames = [...new Set(inGroup.flatMap(m => [m.home_name, m.away_name]))]
  const table = {}
  teamNames.forEach(name => {
    table[name] = { name, g: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 }
  })
  inGroup.filter(m => m.status === 'finished' && m.score_home != null).forEach(m => {
    const h = table[m.home_name], a = table[m.away_name]
    if (!h || !a) return
    h.g++; a.g++
    h.gf += m.score_home; h.ga += m.score_away
    a.gf += m.score_away; a.ga += m.score_home
    h.gd = h.gf - h.ga; a.gd = a.gf - a.ga
    if (m.score_home > m.score_away)      { h.w++; a.l++; h.pts += 3 }
    else if (m.score_home < m.score_away) { a.w++; h.l++; a.pts += 3 }
    else                                   { h.d++; a.d++; h.pts++; a.pts++ }
  })
  const pkBetween = (n1, n2) => inGroup.find(m =>
    (m.home_name === n1 && m.away_name === n2) ||
    (m.home_name === n2 && m.away_name === n1)
  )

  const sorted = Object.values(table).sort((a, b) => {
    const base = b.pts - a.pts || b.gd - a.gd || b.gf - a.gf
    if (base !== 0) return base
    // 完全同率：両チーム間の試合で行った順位決定PKの勝者を上位にする
    const h2h = pkBetween(a.name, b.name)
    if (h2h?.pk_winner === a.name) return -1
    if (h2h?.pk_winner === b.name) return 1
    return a.name.localeCompare(b.name)
  })

  // 順位番号を付与：成績が同じなら同順位。ただしPKで決着していれば別順位
  sorted.forEach((row, i) => {
    if (i === 0) { row.rank = 1; return }
    const prev = sorted[i - 1]
    const sameStats = prev.pts === row.pts && prev.gd === row.gd && prev.gf === row.gf
    const pkSettled = pkBetween(prev.name, row.name)?.pk_winner != null
    row.rank = (sameStats && !pkSettled) ? prev.rank : i + 1
  })

  return sorted
}
