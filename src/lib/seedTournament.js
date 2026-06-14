import { calcGroupStandings, calcAllStandings } from './standings'
import { supabase } from './supabase'

// ── Men's QF seeding: which slot each group fills ──────────────
// M23:QF① M24:QF② M25:QF③ M26:QF④
const MEN_GROUP_SLOTS = {
  A: [
    { matchId: 'M23', slot: 'home_team', rank: 0 }, // A1 → QF①ホーム
    { matchId: 'M25', slot: 'away_team', rank: 1 }, // A2 → QF③アウェイ
  ],
  B: [
    { matchId: 'M23', slot: 'away_team', rank: 1 }, // B2 → QF①アウェイ
    { matchId: 'M25', slot: 'home_team', rank: 0 }, // B1 → QF③ホーム
  ],
  C: [
    { matchId: 'M24', slot: 'home_team', rank: 0 }, // C1 → QF②ホーム
    { matchId: 'M26', slot: 'away_team', rank: 1 }, // C2 → QF④アウェイ
  ],
  D: [
    { matchId: 'M24', slot: 'away_team', rank: 1 }, // D2 → QF②アウェイ
    { matchId: 'M26', slot: 'home_team', rank: 0 }, // D1 → QF④ホーム
  ],
}

// ── Tournament progression tree ────────────────────────────────
// QF → SF → 決勝（男子）、SF → 決勝（女子）
const NEXT_MATCH = {
  'M23': { nextId: 'M29', slot: 'home_team' }, // QF①勝者 → SF①ホーム
  'M24': { nextId: 'M29', slot: 'away_team' }, // QF②勝者 → SF①アウェイ
  'M25': { nextId: 'M30', slot: 'home_team' }, // QF③勝者 → SF②ホーム
  'M26': { nextId: 'M30', slot: 'away_team' }, // QF④勝者 → SF②アウェイ
  'M29': { nextId: 'M34', slot: 'home_team' }, // SF①勝者 → 男子決勝ホーム
  'M30': { nextId: 'M34', slot: 'away_team' }, // SF②勝者 → 男子決勝アウェイ
  'M32': { nextId: 'M33', slot: 'away_team' }, // 女子SF勝者 → 女子決勝アウェイ
}

// ── Auto-seed when a league match is saved as finished ─────────
// allMatches: normalized matches (with the just-saved match patched in)
// Returns array of match IDs updated (for toast), or []
export async function autoSeedLeague(allMatches, gender, group) {
  if (gender === '女子') return seedWomens(allMatches)
  if (!group || !MEN_GROUP_SLOTS[group]) return []
  return seedMensGroup(allMatches, group)
}

async function seedMensGroup(allMatches, group) {
  const groupMatches = allMatches.filter(
    m => m.gender === '男子' && m.stage === 'league' && m.group_name === group
  )
  if (groupMatches.length === 0 || !groupMatches.every(m => m.status === 'finished')) return []

  const standings = calcGroupStandings(allMatches, '男子', group)

  const updates = {}
  for (const { matchId, slot, rank } of MEN_GROUP_SLOTS[group]) {
    const team = standings[rank]?.name
    if (team) {
      if (!updates[matchId]) updates[matchId] = {}
      updates[matchId][slot] = team
    }
  }

  const seeded = []
  for (const [matchId, fields] of Object.entries(updates)) {
    const { error } = await supabase.from('matches').update(fields).eq('id', matchId)
    if (!error) seeded.push(matchId)
  }
  return seeded
}

async function seedWomens(allMatches) {
  const womenLeague = allMatches.filter(m => m.gender === '女子' && m.stage === 'league')
  if (womenLeague.length === 0 || !womenLeague.every(m => m.status === 'finished')) return []

  const standings = calcAllStandings(allMatches, '女子')
  const updates = {
    'M32': { home_team: standings[1]?.name, away_team: standings[2]?.name },
    'M33': { home_team: standings[0]?.name },
  }

  const seeded = []
  for (const [matchId, fields] of Object.entries(updates)) {
    const clean = Object.fromEntries(Object.entries(fields).filter(([, v]) => v))
    if (Object.keys(clean).length === 0) continue
    const { error } = await supabase.from('matches').update(clean).eq('id', matchId)
    if (!error) seeded.push(matchId)
  }
  return seeded
}

// ── Propagate tournament winner to next round ──────────────────
// Called after saving a tournament match result.
// Returns the next matchId if updated, or null.
export async function propagateWinner(matchId, homeTeam, awayTeam, scoreH, scoreA, pkWinner) {
  const next = NEXT_MATCH[matchId]
  if (!next) return null

  let winner = null
  if (scoreH > scoreA)      winner = homeTeam
  else if (scoreA > scoreH) winner = awayTeam
  else                       winner = pkWinner || null
  if (!winner) return null

  const { error } = await supabase
    .from('matches')
    .update({ [next.slot]: winner })
    .eq('id', next.nextId)

  return error ? null : next.nextId
}
