import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollAnimator() {
  const { pathname } = useLocation()

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    )
    document.querySelectorAll('.anim-up').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [pathname])

  return null
}
