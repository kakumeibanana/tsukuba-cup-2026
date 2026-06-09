import { useRef, useCallback, useEffect } from 'react'

export default function StTable({ children }) {
  const wrapRef  = useRef(null)
  const thumbRef = useRef(null)
  const trackRef = useRef(null)

  const update = useCallback(() => {
    const el    = wrapRef.current
    const thumb = thumbRef.current
    const track = trackRef.current
    if (!el || !thumb || !track) return
    const ratio = el.clientWidth / el.scrollWidth
    if (ratio >= 1) { track.style.display = 'none'; return }
    track.style.display = ''
    thumb.style.width = `${ratio * 100}%`
    thumb.style.left  = `${(el.scrollLeft / (el.scrollWidth - el.clientWidth)) * (1 - ratio) * 100}%`
  }, [])

  useEffect(() => {
    const el = wrapRef.current
    update()
    el?.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    if (el) ro.observe(el)
    return () => { el?.removeEventListener('scroll', update); ro.disconnect() }
  }, [update, children])

  return (
    <div className="st-table-outer">
      <div ref={wrapRef} className="table-wrap">{children}</div>
      <div ref={trackRef} className="st-scrollbar-track">
        <div ref={thumbRef} className="st-scrollbar-thumb" />
      </div>
    </div>
  )
}
