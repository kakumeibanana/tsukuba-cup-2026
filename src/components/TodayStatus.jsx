import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const TOURNAMENT_START  = new Date('2026-06-09T00:00:00')
const NEXT_MATCH_START  = new Date('2026-06-22T00:00:00')

const STATUS_MAP = {
  normal:    { label: '本日は予定通り開催します', badge: '開催中', badgeClass: 'ts-badge-open',      emoji: '⚽', grad: 'ts-grad-open' },
  postponed: { label: '雨天のため延期します',      badge: '延期',   badgeClass: 'ts-badge-cancelled', emoji: '🌧', grad: 'ts-grad-cancelled' },
  other:     { label: '',                        badge: 'お知らせ', badgeClass: 'ts-badge-pending',   emoji: '📢', grad: 'ts-grad-pending' },
}

export default function TodayStatus() {
  const navigate = useNavigate()
  const tapsRef  = useRef([])
  const [status, setStatus] = useState('normal')
  const [note, setNote]     = useState('')

  const now           = new Date()
  const beforeStart   = now < TOURNAMENT_START
  const beforeNextMatch = now >= TOURNAMENT_START && now < NEXT_MATCH_START

  function loadStatus() {
    supabase
      .from('settings')
      .select('key, value')
      .in('key', ['event_status', 'event_status_note'])
      .then(({ data }) => {
        if (!data) return
        setStatus(data.find(r => r.key === 'event_status')?.value ?? 'normal')
        setNote(data.find(r => r.key === 'event_status_note')?.value ?? '')
      })
  }

  useEffect(() => {
    if (beforeStart || beforeNextMatch) return
    loadStatus()
    const channel = supabase
      .channel('today-status-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, loadStatus)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [beforeStart, beforeNextMatch])

  function handleTap() {
    const now = Date.now()
    tapsRef.current = [...tapsRef.current, now].filter(t => now - t < 10000)
    if (tapsRef.current.length >= 10) {
      tapsRef.current = []
      navigate('/admin')
    }
  }

  if (beforeStart) {
    return (
      <div className="ts-wrap ts-grad-pending" onClick={handleTap}>
        <div className="ts-body">
          <span className="ts-emoji">📅</span>
          <div className="ts-text">
            <div className="ts-title">開催情報</div>
            <div className="ts-msg">大会は 6/9(火) より開催です</div>
          </div>
          <span className="ts-badge ts-badge-pending">開幕前</span>
        </div>
      </div>
    )
  }

  if (beforeNextMatch) {
    return (
      <div className="ts-wrap ts-grad-pending" onClick={handleTap}>
        <div className="ts-body">
          <span className="ts-emoji">📢</span>
          <div className="ts-text">
            <div className="ts-title">本日の開催状況</div>
            <div className="ts-msg">次の試合は6/22です</div>
          </div>
          <span className="ts-badge ts-badge-pending">お知らせ</span>
        </div>
      </div>
    )
  }

  const s = STATUS_MAP[status] ?? STATUS_MAP.normal
  const label = status === 'other' && note ? note : s.label

  return (
    <div className={`ts-wrap ${s.grad}`} onClick={handleTap}>
      <div className="ts-body">
        <span className="ts-emoji">{s.emoji}</span>
        <div className="ts-text">
          <div className="ts-title">本日の開催状況</div>
          <div className="ts-msg">{label}</div>
        </div>
        <span className={`ts-badge ${s.badgeClass}`}>{s.badge}</span>
      </div>
    </div>
  )
}
