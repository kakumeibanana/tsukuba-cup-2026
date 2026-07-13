import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function matchWinner(m) {
  if (m.home_score > m.away_score) return m.home_team
  if (m.away_score > m.home_score) return m.away_team
  return m.pk_winner || null
}

export default function ChampionBanner() {
  const [champions, setChampions] = useState([])

  useEffect(() => {
    function load() {
      supabase
        .from('matches')
        .select('gender, home_team, away_team, home_score, away_score, pk_winner')
        .eq('category', 'final')
        .eq('status', 'completed')
        .then(({ data }) => {
          const list = (data ?? [])
            .map(m => ({ gender: m.gender, name: matchWinner(m) }))
            .filter(c => c.name)
            .sort((a, b) => (a.gender === '女子' ? -1 : 1) - (b.gender === '女子' ? -1 : 1))
          setChampions(list)
        })
    }
    load()
    const channel = supabase
      .channel('champion-banner-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, load)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  if (champions.length === 0) return null

  return (
    <div className="ts-wrap champ-wrap">
      <div className="champ-body">
        {champions.map(c => (
          <div key={c.gender} className="champ-row">
            <span className="champ-emoji">🏆</span>
            <div className="champ-text">
              <div className="champ-label">{c.gender} 優勝</div>
              <div className="champ-name">{c.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
