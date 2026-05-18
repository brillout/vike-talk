import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getCurrentStep } from '../../utils/reveal'

const STEP = 1
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

export function PowerfulHeading() {
  const powerfulRef = useRef<HTMLSpanElement>(null)
  const [revealed, setRevealed] = useState(() => {
    if (typeof window === 'undefined') return false
    if (window.location.hash.slice(1) === 'last') return true
    return getCurrentStep() >= STEP
  })
  const [powerfulWidth, setPowerfulWidth] = useState(0)
  // Suppress transitions until after first paint, so navigating directly into
  // a state (e.g. /23 → /22#last) never animates from initial-mount defaults.
  const [transitionsOn, setTransitionsOn] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setTransitionsOn(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const el = powerfulRef.current
    if (!el) return
    const sync = () => setRevealed(el.dataset.revealed === 'true')
    const observer = new MutationObserver(sync)
    observer.observe(el, { attributes: true, attributeFilter: ['data-revealed'] })
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    const el = powerfulRef.current
    if (!el) return
    const measure = () => setPowerfulWidth(el.getBoundingClientRect().width)
    measure()
    if (document.fonts?.ready) document.fonts.ready.then(measure)
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <h1 style={{ display: 'grid', gridTemplateColumns: 'auto auto', width: 'max-content', margin: '0 0 25px' }}>
      <span
        ref={powerfulRef}
        className="reveal"
        style={{
          opacity: revealed ? 1 : 0,
          transition: transitionsOn ? `opacity 0.35s ease-out ${revealed ? '0.4s' : '0s'}` : 'none',
        }}
      >
        Powerful&nbsp;
      </span>
      <span
        key={Math.round(powerfulWidth)}
        style={{
          display: 'inline-block',
          transform: `translateX(${revealed ? 0 : -powerfulWidth}px)`,
          transition: transitionsOn ? `transform 0.55s ${EASE} ${revealed ? '0s' : '0.25s'}` : 'none',
        }}
      >
        Extensions
      </span>
    </h1>
  )
}
