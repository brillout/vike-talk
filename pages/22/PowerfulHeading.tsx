import { motion } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getCurrentStep } from '../../utils/reveal'

const STEP = 1
const MOVE = { type: 'spring' as const, stiffness: 220, damping: 26, mass: 0.7 }

export function PowerfulHeading() {
  const powerfulRef = useRef<HTMLSpanElement>(null)
  const [revealed, setRevealed] = useState(() => {
    if (typeof window === 'undefined') return false
    return getCurrentStep() >= STEP
  })
  const [powerfulWidth, setPowerfulWidth] = useState(0)

  useEffect(() => {
    const el = powerfulRef.current
    if (!el) return
    const sync = () => setRevealed(el.dataset.revealed === 'true')
    sync()
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

  const extensionsShift = revealed ? 0 : -powerfulWidth

  return (
    <h1 style={{ display: 'grid', gridTemplateColumns: 'auto auto', width: 'max-content', margin: '0 0 25px' }}>
      <motion.span
        ref={powerfulRef}
        className="reveal"
        initial={false}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut', delay: revealed ? 0.4 : 0 }}
      >
        Powerful&nbsp;
      </motion.span>
      <motion.span
        key={Math.round(powerfulWidth)}
        initial={false}
        animate={{ x: extensionsShift }}
        transition={{ ...MOVE, delay: revealed ? 0 : 0.25 }}
        style={{ display: 'inline-block' }}
      >
        Extensions
      </motion.span>
    </h1>
  )
}
