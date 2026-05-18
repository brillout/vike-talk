import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getCurrentStep } from '../../utils/reveal'

const STEP = 1

const FADE = '0.35s ease-out'
const SLIDE = '0.55s cubic-bezier(0.22, 1, 0.36, 1)'
// Powerful waits for Extensions to mostly slide before fading in.
const POWERFUL_FADE_DELAY = '0.4s'
// On reverse, Extensions waits for Powerful to fade before sliding back.
const EXTENSIONS_SLIDE_DELAY = '0.25s'

export function PowerfulHeading() {
  const powerfulRef = useRef<HTMLSpanElement>(null)
  const [revealed, setRevealed] = useState(() => {
    if (typeof window === 'undefined') return false
    // hash === 'last' would normally resolve via getTotalSteps() (which reads
    // the DOM), but the DOM isn't populated during this initial render —
    // trust the URL: any defined step is revealed at #last.
    if (window.location.hash.slice(1) === 'last') return true
    return getCurrentStep() >= STEP
  })
  const [powerfulWidth, setPowerfulWidth] = useState(0)
  // Suppress transitions on first paint so navigating directly into a
  // state (e.g. /23 → /22#last) doesn't animate from mount defaults.
  const [transitionsOn, setTransitionsOn] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setTransitionsOn(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const el = powerfulRef.current
    if (!el) return
    // No initial sync — apply() hasn't toggled data-revealed yet on mount,
    // so reading it here would clobber the useState initializer.
    const sync = () => setRevealed(el.dataset.revealed === 'true')
    const observer = new MutationObserver(sync)
    observer.observe(el, { attributes: true, attributeFilter: ['data-revealed'] })
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    const el = powerfulRef.current
    if (!el) return
    let cancelled = false
    const measure = () => {
      if (!cancelled) setPowerfulWidth(el.getBoundingClientRect().width)
    }
    measure()
    document.fonts?.ready?.then(measure)
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => {
      cancelled = true
      ro.disconnect()
    }
  }, [])

  return (
    // width: 'max-content' shrinks the h1 to its content so Extensions can
    // be left-aligned relative to the heading, not stretched across slide-content.
    <h1 style={{ display: 'grid', gridTemplateColumns: 'auto auto', width: 'max-content', margin: '0 0 25px' }}>
      <span
        ref={powerfulRef}
        className="reveal"
        style={{
          opacity: revealed ? 1 : 0,
          transition: transitionsOn ? `opacity ${FADE} ${revealed ? POWERFUL_FADE_DELAY : '0s'}` : 'none',
        }}
      >
        Powerful&nbsp;
      </span>
      <span
        style={{
          display: 'inline-block',
          transform: `translateX(${revealed ? 0 : -powerfulWidth}px)`,
          transition: transitionsOn ? `transform ${SLIDE} ${revealed ? '0s' : EXTENSIONS_SLIDE_DELAY}` : 'none',
        }}
      >
        Extensions
      </span>
    </h1>
  )
}
