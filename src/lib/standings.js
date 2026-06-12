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
  return Object.values(table).sort((a, b) =>
    b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.name.localeCompare(b.name)
  )
}
